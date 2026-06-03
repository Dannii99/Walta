/**
 * Smoke test for AI advisor + insights prompts.
 * Run with: npx tsx scripts/test-ai-prompt.ts
 *
 * Requires GROQ_API_KEY in .env. Outputs to scripts/test-ai-output.md
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

  const { generateAdvisorAnalysis } = await import("../lib/ai/simulation-advisor");
  const { generateInsights, clearAllInsightsCache } = await import(
    "../lib/ai/simulation-insights"
  );
  const { formatCOP } = await import("../lib/currency");

  const advisorContext = {
    income: 5_000_000,
    available: 2_380_000,
    recommendedMax: 714_000,
    activeLoansTotal: 450_000,
    activeLoans: [
      { type: "VEHICLE", monthlyPayment: 450_000, remainingMonths: 24 },
    ],
    simulation: {
      type: "VEHICLE",
      title: "Carro familiar",
      price: 50_000_000,
      downPayment: 10_000_000,
      principal: 40_000_000,
      termMonths: 60,
      termYears: 5,
      rate: 0.15,
      formula: "french_ea",
      monthlyPayment: 949_902.6,
      percentage: 39.9,
      verdict: "WARNING",
      remainingAfter: 1_430_097.4,
      totalInterest: 16_994_156,
      totalCost: 56_994_156,
    },
  };

  const insightsContext = {
    simulations: [
      {
        type: "VEHICLE",
        title: "Carro familiar",
        monthlyPayment: 949_902.6,
        verdict: "WARNING",
      },
      {
        type: "PERSONAL",
        title: "Libre inversión",
        monthlyPayment: 300_000,
        verdict: "APPROVED",
      },
      {
        type: "HOUSING",
        title: "Apartamento",
        monthlyPayment: 1_200_000,
        verdict: "REJECTED",
      },
    ],
    totalMonthly: 2_449_902.6,
    available: 2_380_000,
    ratio: 102.9,
  };

  const userId = "smoke-test-user";

  const outputLines: string[] = [];
  const stamp = new Date().toISOString();
  outputLines.push(`# AI Smoke Test Output`);
  outputLines.push(`Generated: ${stamp}`);
  outputLines.push(`Model: llama-3.3-70b-versatile`);
  outputLines.push("");

  outputLines.push("## Context");
  outputLines.push("```");
  outputLines.push(`Income: ${formatCOP(advisorContext.income)}`);
  outputLines.push(`Available: ${formatCOP(advisorContext.available)}`);
  outputLines.push(`Recommended max (30%): ${formatCOP(advisorContext.recommendedMax)}`);
  outputLines.push(`Active loans total: ${formatCOP(advisorContext.activeLoansTotal)}`);
  outputLines.push(
    `Simulation: ${advisorContext.simulation.type} - ${advisorContext.simulation.title}`
  );
  outputLines.push(
    `  Price: ${formatCOP(advisorContext.simulation.price)}`
  );
  outputLines.push(
    `  Monthly payment: ${formatCOP(advisorContext.simulation.monthlyPayment)} (${advisorContext.simulation.percentage.toFixed(1)}% of available)`
  );
  outputLines.push("```");
  outputLines.push("");

  // ─── Feature A: Advisor ─────────────────────────────────
  console.log("→ Calling GROQ for advisor analysis (Feature A)...");
  const advisorStart = Date.now();
  let advisorError: string | null = null;
  let advisorAnalysis = null;
  try {
    advisorAnalysis = await generateAdvisorAnalysis(advisorContext);
  } catch (err) {
    advisorError = err instanceof Error ? err.message : String(err);
    console.error("Advisor error:", advisorError);
  }
  const advisorMs = Date.now() - advisorStart;
  console.log(`  Done in ${advisorMs}ms`);

  outputLines.push("## Feature A: Advisor Analysis");
  outputLines.push(`Latency: ${advisorMs}ms`);
  outputLines.push("");

  if (advisorError) {
    outputLines.push(`**ERROR:** ${advisorError}`);
  } else if (advisorAnalysis) {
    outputLines.push("### Verdict Explanation");
    outputLines.push(advisorAnalysis.verdict_explanation);
    outputLines.push("");

    outputLines.push("### Recommendations");
    advisorAnalysis.recommendations.forEach((r, i) => {
      outputLines.push(
        `${i + 1}. **[${r.impact.toUpperCase()}]** ${r.title}`
      );
      outputLines.push(`   ${r.description}`);
    });
    outputLines.push("");

    outputLines.push("### Risks");
    advisorAnalysis.risks.forEach((r) => {
      outputLines.push(`- ${r}`);
    });
    outputLines.push("");

    if (advisorAnalysis.alternative_suggestion) {
      outputLines.push("### Alternative");
      outputLines.push(advisorAnalysis.alternative_suggestion);
      outputLines.push("");
    }

    outputLines.push("### Raw JSON");
    outputLines.push("```json");
    outputLines.push(JSON.stringify(advisorAnalysis, null, 2));
    outputLines.push("```");
  }

  outputLines.push("");
  outputLines.push("---");
  outputLines.push("");

  // ─── Feature B: Insights ────────────────────────────────
  console.log("→ Calling GROQ for portfolio insights (Feature B)...");
  clearAllInsightsCache();
  const insightsStart = Date.now();
  let insightsError: string | null = null;
  let insight = null;
  try {
    insight = await generateInsights(insightsContext, userId);
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

  const outPath = join(process.cwd(), "scripts", "test-ai-output.md");
  writeFileSync(outPath, outputLines.join("\n"), "utf8");
  console.log(`\n✓ Output written to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
