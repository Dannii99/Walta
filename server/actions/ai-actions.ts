"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateAdvisorAnalysis } from "@/lib/ai/simulation-advisor";
import {
  generateInsights,
  clearInsightsCache,
} from "@/lib/ai/simulation-insights";
import { getMonthlyEquivalent } from "@/lib/recurrence";
import {
  calculateFrenchEA,
  calculateNominalMonthly,
  getVerdict,
  type Verdict,
} from "@/lib/simulation-engine";
import { AdvisorAnalysisSchema } from "@/lib/ai/schemas";
import type { InsightsContext } from "@/lib/ai/prompts";

const ADVISOR_CACHE_HOURS = 24;

interface SimulationInputRow {
  price: number;
  downPayment: number;
  term: number;
  rate: number;
  formula?: string;
}

interface SimulationResultRow {
  monthlyPayment: number;
  verdict: string;
  availableAfter: number;
  totalInterest: number;
  totalCost: number;
}

function parseSimulationInputs(raw: unknown): SimulationInputRow {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid simulation inputs");
  }
  const r = raw as Record<string, unknown>;
  return {
    price: Number(r.price ?? 0),
    downPayment: Number(r.downPayment ?? 0),
    term: Number(r.term ?? 0),
    rate: Number(r.rate ?? 0),
    formula: typeof r.formula === "string" ? r.formula : "french_ea",
  };
}

function parseSimulationResult(raw: unknown): SimulationResultRow {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid simulation result");
  }
  const r = raw as Record<string, unknown>;
  return {
    monthlyPayment: Number(r.monthlyPayment ?? 0),
    verdict: String(r.verdict ?? "WARNING"),
    availableAfter: Number(r.availableAfter ?? 0),
    totalInterest: Number(r.totalInterest ?? 0),
    totalCost: Number(r.totalCost ?? 0),
  };
}

async function loadFinancialContext(userId: string) {
  const budget = await prisma.budget.findFirst({
    where: { userId },
    include: {
      categories: {
        include: { transactions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!budget) {
    throw new Error("No budget found for user");
  }

  const income = Number(budget.income);

  const totalMonthly = budget.categories.reduce((sum, cat) => {
    return (
      sum +
      cat.transactions.reduce((s, t) => {
        return s + getMonthlyEquivalent(Number(t.amount), t.recurrence);
      }, 0)
    );
  }, 0);

  const available = Math.max(0, income - totalMonthly);
  const recommendedMax = available * 0.3;

  const activeLoans = await prisma.loan.findMany({
    where: { userId, status: "ACTIVE" },
    select: {
      type: true,
      monthlyPayment: true,
      termMonths: true,
      paidInstallments: true,
    },
  });

  const activeLoansList = activeLoans.map((l) => ({
    type: l.type,
    monthlyPayment: Number(l.monthlyPayment),
    remainingMonths: Math.max(0, l.termMonths - l.paidInstallments),
  }));

  const activeLoansTotal = activeLoansList.reduce(
    (sum, l) => sum + l.monthlyPayment,
    0
  );

  return {
    income,
    available,
    recommendedMax,
    activeLoansTotal,
    activeLoans: activeLoansList,
  };
}

export async function generateSimulationAdvice(simulationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });

  if (!simulation || simulation.userId !== userId) {
    throw new Error("Simulation not found or unauthorized");
  }

  const now = new Date();
  const cacheValid =
    simulation.aiAnalysis &&
    simulation.aiAnalysisGeneratedAt &&
    now.getTime() - simulation.aiAnalysisGeneratedAt.getTime() <
      ADVISOR_CACHE_HOURS * 60 * 60 * 1000;

  if (cacheValid) {
    const cached = AdvisorAnalysisSchema.safeParse(JSON.parse(simulation.aiAnalysis!));
    if (cached.success) {
      return {
        analysis: cached.data,
        cached: true,
        generatedAt: simulation.aiAnalysisGeneratedAt!,
      };
    }
  }

  const ctx = await loadFinancialContext(userId);
  const inputs = parseSimulationInputs(simulation.inputs);
  const result = parseSimulationResult(simulation.result);

  const principal = Math.max(0, inputs.price - inputs.downPayment);
  const termMonths = inputs.term;
  const termYears = Math.round((termMonths / 12) * 10) / 10;

  const monthlyPayment =
    inputs.formula === "nominal_monthly"
      ? calculateNominalMonthly(principal, inputs.rate, termMonths)
      : calculateFrenchEA(principal, inputs.rate, termMonths);

  const { verdict: engineVerdict, percentage } = getVerdict(
    monthlyPayment,
    ctx.available
  );

  const verdictMap: Record<Verdict, "APPROVED" | "WARNING" | "REJECTED"> = {
    SAFE: "APPROVED",
    TIGHT: "WARNING",
    RISKY: "REJECTED",
    NOT_RECOMMENDED: "REJECTED",
  };

  const analysis = await generateAdvisorAnalysis({
    income: ctx.income,
    available: ctx.available,
    recommendedMax: ctx.recommendedMax,
    activeLoansTotal: ctx.activeLoansTotal,
    activeLoans: ctx.activeLoans,
    simulation: {
      type: simulation.type,
      title: simulation.title,
      price: inputs.price,
      downPayment: inputs.downPayment,
      principal,
      termMonths,
      termYears,
      rate: inputs.rate,
      formula: inputs.formula ?? "french_ea",
      monthlyPayment,
      percentage,
      verdict: verdictMap[engineVerdict],
      remainingAfter: ctx.available - monthlyPayment,
      totalInterest: result.totalInterest,
      totalCost: result.totalCost,
    },
  });

  const generatedAt = new Date();
  await prisma.simulation.update({
    where: { id: simulationId },
    data: {
      aiAnalysis: JSON.stringify(analysis),
      aiAnalysisGeneratedAt: generatedAt,
    },
  });

  revalidatePath(`/simulations/${simulationId}`);

  return {
    analysis,
    cached: false,
    generatedAt,
  };
}

export async function generateSimulationInsights() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const simulations = await prisma.simulation.findMany({
    where: { userId },
    select: { type: true, result: true },
    orderBy: { createdAt: "desc" },
  });

  if (simulations.length === 0) {
    return { insight: null as string | null, cached: false };
  }

  const ctx = await loadFinancialContext(userId);

  const summary = simulations.map((s) => {
    const result = parseSimulationResult(s.result);
    return {
      type: s.type,
      monthlyPayment: result.monthlyPayment,
      verdict: result.verdict,
    };
  });

  const totalMonthly = summary.reduce((sum, s) => sum + s.monthlyPayment, 0);
  const ratio =
    ctx.available > 0 ? (totalMonthly / ctx.available) * 100 : 0;

  const insightsContext: InsightsContext = {
    simulations: summary,
    totalMonthly,
    available: ctx.available,
    ratio,
  };

  const insight = await generateInsights(insightsContext, userId);

  return { insight, cached: false };
}

export async function invalidateInsightsCache() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  clearInsightsCache(session.user.id);
}
