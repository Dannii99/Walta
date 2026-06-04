/**
 * Smoke test for AI loan advisor + insights prompts.
 * Run with: npx tsx scripts/test-loan-ai.ts
 *
 * Requires GROQ_API_KEY in .env. Outputs to scripts/test-loan-ai-output.md
 * for manual inspection of quality.
 */

import { config } from "dotenv";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env" });

async function main() {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not found in .env");
    process.exit(1);
  }

  const { generateLoanAdvisorAnalysis, clearAllLoanAdvisorCache } = await import(
    "../lib/ai/loan-advisor"
  );
  const {
    generateLoanInsights,
    clearAllLoanInsightsCache,
  } = await import("../lib/ai/loan-insights");
  const { formatCOP } = await import("../lib/currency");

  const advisorContext = {
    income: 4_000_000,
    available: 401_700,
    recommendedMax: 120_510,
    activeLoansTotal: 2_550_000,
    otherLoans: [
      {
        type: "VEHICLE",
        title: "Moto",
        monthlyPayment: 540_000,
        remainingMonths: 18,
      },
      {
        type: "PERSONAL",
        title: "Libre inversión",
        monthlyPayment: 991_536.5,
        remainingMonths: 24,
      },
    ],
    loan: {
      id: "smoke-loan-1",
      title: "Carro 2026",
      type: "VEHICLE",
      principal: 47_000_000,
      downPayment: 8_000_000,
      annualRate: 0.1718,
      termMonths: 72,
      monthlyPayment: 1_018_463.5,
      totalInterest: 26_289_376,
      totalCost: 73_289_376,
      startDate: "2024-01-15",
      status: "ACTIVE",
      paidInstallments: 20,
      totalPaid: 20_369_270,
      remainingBalance: 26_630_730,
      percentPaid: 28,
      health: "DEFAULTED" as const,
      recentPayments: [
        { month: 20, amount: 1_018_463.5, paidDate: "2025-09-15" },
        { month: 19, amount: 1_018_463.5, paidDate: "2025-08-15" },
      ],
      upcomingPayments: [
        { month: 21, amount: 1_018_463.5, projectedDate: "2025-10-15" },
      ],
      monthlyFees: 35_000,
      formula: "french_ea",
    },
  };

  const insightsContext = {
    loans: [
      {
        type: "VEHICLE",
        title: "Carro 2026",
        status: "ACTIVE",
        monthlyPayment: 1_018_463.5,
        remainingBalance: 26_630_730,
        percentPaid: 28,
        monthlyFees: 35_000,
      },
      {
        type: "VEHICLE",
        title: "Moto",
        status: "ACTIVE",
        monthlyPayment: 540_000,
        remainingBalance: 8_400_000,
        percentPaid: 35,
        monthlyFees: 0,
      },
      {
        type: "PERSONAL",
        title: "Libre inversión",
        status: "ACTIVE",
        monthlyPayment: 991_536.5,
        remainingBalance: 18_500_000,
        percentPaid: 22,
        monthlyFees: 0,
      },
    ],
    activeCount: 3,
    paidOffCount: 0,
    defaultedCount: 0,
    totalActiveMonthly: 2_550_000,
    totalPrincipalRemaining: 53_530_730,
    totalPaid: 28_700_000,
    available: 401_700,
    income: 4_000_000,
    ratio: 635,
    hasMoratory: false,
  };

  const userId = "smoke-test-user";

  const outputLines: string[] = [];
  const stamp = new Date().toISOString();
  outputLines.push(`# Loan AI Smoke Test Output`);
  outputLines.push(`Generated: ${stamp}`);
  outputLines.push(`Model: llama-3.3-70b-versatile`);
  outputLines.push("");

  outputLines.push("## Context");
  outputLines.push("```");
  outputLines.push(`Income: ${formatCOP(advisorContext.income)}`);
  outputLines.push(`Available: ${formatCOP(advisorContext.available)}`);
  outputLines.push(`Recommended max (30%): ${formatCOP(advisorContext.recommendedMax)}`);
  outputLines.push(
    `Active loans total: ${formatCOP(advisorContext.activeLoansTotal)}`
  );
  outputLines.push(
    `Loan: ${advisorContext.loan.type} - ${advisorContext.loan.title}`
  );
  outputLines.push(
    `  Principal: ${formatCOP(advisorContext.loan.principal)} at ${(advisorContext.loan.annualRate * 100).toFixed(2)}% EA`
  );
  outputLines.push(
    `  Monthly payment: ${formatCOP(advisorContext.loan.monthlyPayment)}`
  );
  outputLines.push(
    `  Progress: ${advisorContext.loan.paidInstallments}/${advisorContext.loan.termMonths} (${advisorContext.loan.percentPaid}%)`
  );
  outputLines.push(
    `  Health: ${advisorContext.loan.health} (ratio > 100% del disponible)`
  );
  outputLines.push("```");
  outputLines.push("");

  // ─── Feature A: Loan Advisor ─────────────────────────────
  console.log("→ Calling GROQ for loan advisor analysis (Feature A)...");
  clearAllLoanAdvisorCache();
  const advisorStart = Date.now();
  let advisorError: string | null = null;
  let advisorResult = null;
  try {
    advisorResult = await generateLoanAdvisorAnalysis(
      advisorContext,
      userId,
      advisorContext.loan.id
    );
  } catch (err) {
    advisorError = err instanceof Error ? err.message : String(err);
    console.error("Advisor error:", advisorError);
  }
  const advisorMs = Date.now() - advisorStart;
  console.log(`  Done in ${advisorMs}ms`);

  outputLines.push("## Feature A: Loan Advisor Analysis");
  outputLines.push(`Latency: ${advisorMs}ms`);
  outputLines.push("");

  if (advisorError) {
    outputLines.push(`**ERROR:** ${advisorError}`);
  } else if (advisorResult) {
    outputLines.push("### Verdict Explanation");
    outputLines.push(advisorResult.analysis.verdict_explanation);
    outputLines.push("");

    outputLines.push("### Recommendations");
    advisorResult.analysis.recommendations.forEach((r, i) => {
      outputLines.push(
        `${i + 1}. **[${r.impact.toUpperCase()}]** ${r.title}`
      );
      outputLines.push(`   ${r.description}`);
    });
    outputLines.push("");

    outputLines.push("### Risks");
    advisorResult.analysis.risks.forEach((r) => {
      outputLines.push(`- ${r}`);
    });
    outputLines.push("");

    if (advisorResult.analysis.alternative_suggestion) {
      outputLines.push("### Alternative");
      outputLines.push(advisorResult.analysis.alternative_suggestion);
      outputLines.push("");
    }

    outputLines.push("### Raw JSON");
    outputLines.push("```json");
    outputLines.push(JSON.stringify(advisorResult.analysis, null, 2));
    outputLines.push("```");
  }

  outputLines.push("");
  outputLines.push("---");
  outputLines.push("");

  // ─── Feature B: Portfolio Insights ──────────────────────
  console.log("→ Calling GROQ for portfolio insights (Feature B)...");
  clearAllLoanInsightsCache();
  const insightsStart = Date.now();
  let insightsError: string | null = null;
  let insight: string | null = null;
  try {
    insight = await generateLoanInsights(insightsContext, userId);
  } catch (err) {
    insightsError = err instanceof Error ? err.message : String(err);
    console.error("Insights error:", insightsError);
  }
  const insightsMs = Date.now() - insightsStart;
  console.log(`  Done in ${insightsMs}ms`);

  outputLines.push("## Feature B: Portfolio Insights");
  outputLines.push(`Latency: ${insightsMs}ms`);
  outputLines.push("");

  if (insightsError) {
    outputLines.push(`**ERROR:** ${insightsError}`);
  } else {
    outputLines.push("### Insight");
    outputLines.push(insight ?? "(null)");
  }

  const outPath = join(process.cwd(), "scripts", "test-loan-ai-output.md");
  writeFileSync(outPath, outputLines.join("\n"), "utf8");
  console.log(`\n✓ Output written to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
