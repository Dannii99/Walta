"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateAdvisorAnalysis } from "@/lib/ai/simulation-advisor";
import {
  generateInsights,
  clearInsightsCache,
} from "@/lib/ai/simulation-insights";
import {
  calculateFrenchEA,
  calculateNominalMonthly,
  getVerdict,
  type Verdict,
} from "@/lib/simulation-engine";
import { AdvisorAnalysisSchema } from "@/lib/ai/schemas";
import { getEffectiveMonthlyPayment } from "@/lib/loan-fees";
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
        return s + Number(t.amount);
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
      fees: { where: { type: "monthly" } },
    },
  });

  const activeLoansList = activeLoans.map((l) => ({
    type: l.type,
    monthlyPayment: getEffectiveMonthlyPayment(l),
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

// ─── Loan AI (Feature A: advisor, Feature B: insights) ────────────

import { generateLoanAdvisorAnalysis, invalidateLoanAdvisorCache } from "@/lib/ai/loan-advisor";
import { generateLoanInsights, clearLoanInsightsCache } from "@/lib/ai/loan-insights";
import {
  type LoanForAdvisor,
  type OtherLoanSummary,
  type LoanAdvisorContext,
  type ActiveLoanSummary,
  type LoanInsightsContext,
} from "@/lib/ai/loan-prompts";
import { getLoanHealthFromCapacity } from "@/lib/credit-engine";
import { generateAmortizationSchedule } from "@/lib/loan-engine";

interface LoanWithRelations {
  id: string;
  userId: string;
  title: string;
  type: string;
  principal: { toString(): string } | number | string;
  downPayment: { toString(): string } | number | string;
  annualRate: { toString(): string } | number | string;
  termMonths: number;
  formula: string;
  monthlyPayment: { toString(): string } | number | string;
  totalInterest: { toString(): string } | number | string;
  totalCost: { toString(): string } | number | string;
  startDate: Date | string;
  status: string;
  paidInstallments: number;
  fees?: Array<{
    id: string;
    name: string;
    amount: { toString(): string } | number | string;
    type: string;
  }>;
  payments?: Array<{
    amount: { toString(): string } | number | string;
    paidDate: Date | string;
  }>;
}

function num(value: { toString(): string } | number | string): number {
  if (typeof value === "number") return value;
  return Number(value.toString());
}

function dateToISO(d: Date | string): string {
  return typeof d === "string" ? d : d.toISOString();
}

async function loadAdvisorContextForLoan(
  userId: string,
  loanId: string
): Promise<{ ctx: LoanAdvisorContext; loanStatus: string }> {
  const loan = (await prisma.loan.findUnique({
    where: { id: loanId },
    include: {
      payments: { orderBy: { paidDate: "desc" }, take: 50 },
      fees: { where: { type: "monthly" } },
    },
  })) as LoanWithRelations | null;

  if (!loan || loan.userId !== userId) {
    throw new Error("Loan not found or unauthorized");
  }

  const budgetCtx = await loadFinancialContext(userId);

  const otherActiveLoans = await prisma.loan.findMany({
    where: { userId, status: "ACTIVE", NOT: { id: loanId } },
    select: {
      type: true,
      title: true,
      monthlyPayment: true,
      termMonths: true,
      paidInstallments: true,
      fees: { where: { type: "monthly" } },
    },
  });

  const otherLoans: OtherLoanSummary[] = otherActiveLoans.map((l) => ({
    type: l.type,
    title: l.title,
    monthlyPayment: getEffectiveMonthlyPayment(l),
    remainingMonths: Math.max(0, l.termMonths - l.paidInstallments),
  }));

  const otherActiveLoansTotal = otherLoans.reduce(
    (sum, l) => sum + l.monthlyPayment,
    0
  );
  const activeLoansTotal = otherActiveLoansTotal + getEffectiveMonthlyPayment(loan);

  const principal = num(loan.principal);
  const bankMonthlyPayment = num(loan.monthlyPayment);
  const monthlyPayment = getEffectiveMonthlyPayment(loan);
  const monthlyFees = monthlyPayment - bankMonthlyPayment;

  // Cuota efectiva del próximo mes, post-recalcs. Si difiere de la cuota
  // banco, el motor recalculó la cuota financiera tras un REDUCE_PAYMENT.
  const schedule = generateAmortizationSchedule(
    loan as unknown as Parameters<typeof generateAmortizationSchedule>[0],
    (loan.payments ?? []) as unknown as Parameters<typeof generateAmortizationSchedule>[1],
    ((loan as unknown as { extraPayments?: unknown[] }).extraPayments ?? []) as unknown as Parameters<typeof generateAmortizationSchedule>[2]
  );
  const nextRow = schedule.find(
    (r) => r.month === (loan.paidInstallments ?? 0) + 1
  );
  const currentEffectivePayment = nextRow?.payment ?? bankMonthlyPayment;

  const totalPaidAgg = await prisma.loanPayment.aggregate({
    where: { loanId },
    _sum: { amount: true, principalPaid: true },
  });
  const totalPaid = Number(totalPaidAgg._sum.amount ?? 0);
  const principalPaid = Number(totalPaidAgg._sum.principalPaid ?? 0);
  const remainingBalance = Math.max(0, principal - principalPaid);
  const percentPaid = principal > 0 ? (principalPaid / principal) * 100 : 0;

  const { health } = getLoanHealthFromCapacity(
    monthlyPayment,
    budgetCtx.available
  );

  const recentPayments = (loan.payments ?? []).slice(0, 3).map((p) => ({
    month: 0,
    amount: num(p.amount),
    paidDate: dateToISO(p.paidDate),
  }));

  const upcomingMonths: { month: number; amount: number; projectedDate: string }[] = [];
  const start = new Date(loan.startDate);
  for (let i = 1; i <= 3; i++) {
    const projected = new Date(start);
    projected.setMonth(projected.getMonth() + loan.paidInstallments + i);
    upcomingMonths.push({
      month: loan.paidInstallments + i,
      amount: bankMonthlyPayment,
      projectedDate: projected.toISOString(),
    });
  }

  const loanForAdvisor: LoanForAdvisor = {
    id: loan.id,
    title: loan.title,
    type: loan.type,
    principal,
    downPayment: num(loan.downPayment),
    annualRate: num(loan.annualRate),
    termMonths: loan.termMonths,
    monthlyPayment: bankMonthlyPayment,
    totalInterest: num(loan.totalInterest),
    totalCost: num(loan.totalCost),
    startDate: dateToISO(loan.startDate),
    status: loan.status,
    paidInstallments: loan.paidInstallments,
    totalPaid,
    remainingBalance,
    percentPaid,
    health,
    recentPayments,
    upcomingPayments: upcomingMonths,
    monthlyFees,
    formula: loan.formula,
    currentEffectivePayment,
  };

  return {
    ctx: {
      income: budgetCtx.income,
      available: budgetCtx.available,
      recommendedMax: budgetCtx.recommendedMax,
      activeLoansTotal,
      otherLoans,
      loan: loanForAdvisor,
    },
    loanStatus: loan.status,
  };
}

export async function generateLoanAdvice(loanId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const { ctx } = await loadAdvisorContextForLoan(userId, loanId);

  const result = await generateLoanAdvisorAnalysis(ctx, userId, loanId);
  return result;
}

export async function generateLoanPortfolioInsights() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const loans = await prisma.loan.findMany({
    where: { userId },
    select: {
      type: true,
      title: true,
      status: true,
      monthlyPayment: true,
      paidInstallments: true,
      principal: true,
      termMonths: true,
      formula: true,
      fees: { where: { type: "monthly" } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (loans.length === 0) {
    return { insight: null as string | null, cached: false };
  }

  const budgetCtx = await loadFinancialContext(userId);

  const paidAgg = await prisma.loanPayment.aggregate({
    where: { loan: { userId } },
    _sum: { amount: true },
  });
  const totalPaid = Number(paidAgg._sum.amount ?? 0);

  const principalPaidAgg = await prisma.loanPayment.aggregate({
    where: { loan: { userId } },
    _sum: { principalPaid: true },
  });
  const totalPrincipalPaid = Number(principalPaidAgg._sum.principalPaid ?? 0);
  const totalPrincipalAll = loans.reduce(
    (s, l) => s + Number(l.principal),
    0
  );
  const totalPrincipalRemaining = Math.max(
    0,
    totalPrincipalAll - totalPrincipalPaid
  );

  const activeLoans = loans.filter((l) => l.status === "ACTIVE");
  const totalActiveMonthly = activeLoans.reduce(
    (s, l) => s + getEffectiveMonthlyPayment(l),
    0
  );
  const ratio =
    budgetCtx.available > 0
      ? (totalActiveMonthly / budgetCtx.available) * 100
      : 0;

  const moratoryCount = await prisma.loan.count({
    where: { userId, status: "DEFAULTED" },
  });
  const hasMoratory = moratoryCount > 0;

  const summaries: ActiveLoanSummary[] = loans.map((l) => {
    const principal = Number(l.principal);
    const paid = l.paidInstallments;
    const bankMonthly = Number(l.monthlyPayment);
    const totalMonthly = getEffectiveMonthlyPayment(l);
    const monthlyFees = totalMonthly - bankMonthly;
    const pct = principal > 0 && l.termMonths > 0
      ? Math.min(100, (paid / l.termMonths) * 100)
      : 0;
    return {
      type: l.type,
      title: l.title,
      status: l.status,
      monthlyPayment: totalMonthly,
      remainingBalance: Math.max(0, principal - (paid * bankMonthly * 0.4)),
      percentPaid: pct,
      monthlyFees,
    };
  });

  const insightsContext: LoanInsightsContext = {
    loans: summaries,
    activeCount: activeLoans.length,
    paidOffCount: loans.filter((l) => l.status === "PAID_OFF").length,
    defaultedCount: loans.filter((l) => l.status === "DEFAULTED").length,
    totalActiveMonthly,
    totalPrincipalRemaining,
    totalPaid,
    available: budgetCtx.available,
    income: budgetCtx.income,
    ratio,
    hasMoratory,
  };

  const insight = await generateLoanInsights(insightsContext, userId);
  return { insight, cached: false };
}

export async function invalidateLoanInsightsCache() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  clearLoanInsightsCache(session.user.id);
}

export async function invalidateLoanAdvisorCacheAction(loanId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  invalidateLoanAdvisorCache(session.user.id, loanId);
}
