import { describe, it, expect } from "vitest";
import {
  buildAdvisorUserPrompt,
  buildInsightsUserPrompt,
  type AdvisorContext,
  type InsightsContext,
} from "@/lib/ai/prompts";

describe("buildAdvisorUserPrompt", () => {
  const baseContext: AdvisorContext = {
    income: 5_000_000,
    available: 2_380_000,
    recommendedMax: 714_000,
    activeLoansTotal: 450_000,
    activeLoans: [
      {
        type: "VEHICLE",
        monthlyPayment: 450_000,
        remainingMonths: 24,
      },
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
      monthlyPayment: 950_000,
      percentage: 39.9,
      verdict: "WARNING",
      remainingAfter: 1_430_000,
      totalInterest: 17_000_000,
      totalCost: 57_000_000,
    },
  };

  it("includes all key financial context fields", () => {
    const prompt = buildAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("CONTEXTO FINANCIERO DEL USUARIO");
    expect(prompt).toContain("SIMULACIÓN A ANALIZAR");
    expect(prompt).toMatch(/5\.000\.000/);
    expect(prompt).toMatch(/2\.380\.000/);
    expect(prompt).toMatch(/714\.000/);
    expect(prompt).toMatch(/450\.000/);
    expect(prompt).toContain("Carro familiar");
    expect(prompt).toMatch(/50\.000\.000/);
    expect(prompt).toMatch(/40\.000\.000/);
    expect(prompt).toContain("60 meses (5 años)");
    expect(prompt).toContain("15.00% EA");
    expect(prompt).toContain("Francesa (EA)");
    expect(prompt).toMatch(/950\.000/);
    expect(prompt).toContain("39.9%");
  });

  it("handles empty active loans list", () => {
    const ctx = {
      ...baseContext,
      activeLoans: [],
      activeLoansTotal: 0,
    };
    const prompt = buildAdvisorUserPrompt(ctx);
    expect(prompt).toContain("Créditos activos: ninguno");
    expect(prompt).toMatch(/\$[\s\u00A0]+0/);
  });

  it("uses correct type label for VEHICLE", () => {
    const prompt = buildAdvisorUserPrompt(baseContext);
    expect(prompt).toContain("Tipo: Vehículo");
  });

  it("uses correct type label for HOUSING", () => {
    const ctx = {
      ...baseContext,
      simulation: { ...baseContext.simulation, type: "HOUSING" },
    };
    const prompt = buildAdvisorUserPrompt(ctx);
    expect(prompt).toContain("Tipo: Vivienda");
  });

  it("uses correct type label for PERSONAL", () => {
    const ctx = {
      ...baseContext,
      simulation: { ...baseContext.simulation, type: "PERSONAL" },
    };
    const prompt = buildAdvisorUserPrompt(ctx);
    expect(prompt).toContain("Tipo: Personal / Libre inversión");
  });

  it("uses correct formula label for nominal_monthly", () => {
    const ctx = {
      ...baseContext,
      simulation: { ...baseContext.simulation, formula: "nominal_monthly" },
    };
    const prompt = buildAdvisorUserPrompt(ctx);
    expect(prompt).toContain("Fórmula: NAMV mensual");
  });

  it("formats multiple active loans with semicolons", () => {
    const ctx = {
      ...baseContext,
      activeLoans: [
        { type: "VEHICLE", monthlyPayment: 450_000, remainingMonths: 24 },
        { type: "HOUSING", monthlyPayment: 1_200_000, remainingMonths: 180 },
      ],
    };
    const prompt = buildAdvisorUserPrompt(ctx);
    expect(prompt).toContain("Vehículo");
    expect(prompt).toContain("Vivienda");
    expect(prompt).toContain(";");
  });
});

describe("buildInsightsUserPrompt", () => {
  it("includes portfolio summary with all simulations", () => {
    const ctx: InsightsContext = {
      simulations: [
        { type: "VEHICLE", monthlyPayment: 950_000, verdict: "WARNING" },
        { type: "PERSONAL", monthlyPayment: 300_000, verdict: "APPROVED" },
        { type: "HOUSING", monthlyPayment: 1_200_000, verdict: "REJECTED" },
      ],
      totalMonthly: 2_450_000,
      available: 2_380_000,
      ratio: 103,
    };
    const prompt = buildInsightsUserPrompt(ctx);

    expect(prompt).toContain("Total simulaciones: 3");
    expect(prompt).toContain("Vehículo");
    expect(prompt).toContain("Personal / Libre inversión");
    expect(prompt).toContain("Vivienda");
    expect(prompt).toMatch(/2\.450\.000/);
    expect(prompt).toMatch(/2\.380\.000/);
    expect(prompt).toContain("103%");
    expect(prompt).toContain("EXCEDE EL DISPONIBLE");
  });

  it("handles zero simulations gracefully", () => {
    const ctx: InsightsContext = {
      simulations: [],
      totalMonthly: 0,
      available: 2_380_000,
      ratio: 0,
    };
    const prompt = buildInsightsUserPrompt(ctx);
    expect(prompt).toContain("Total simulaciones: 0");
    expect(prompt).toContain("sin simulaciones");
  });

  it("handles single simulation", () => {
    const ctx: InsightsContext = {
      simulations: [
        { type: "VEHICLE", monthlyPayment: 500_000, verdict: "APPROVED" },
      ],
      totalMonthly: 500_000,
      available: 2_000_000,
      ratio: 25,
    };
    const prompt = buildInsightsUserPrompt(ctx);
    expect(prompt).toContain("Total simulaciones: 1");
    expect(prompt).toContain("25%");
    expect(prompt).not.toContain("EXCEDE EL DISPONIBLE");
  });

  it("does not flag exceeded when ratio is exactly 100", () => {
    const ctx: InsightsContext = {
      simulations: [
        { type: "HOUSING", monthlyPayment: 2_000_000, verdict: "REJECTED" },
      ],
      totalMonthly: 2_000_000,
      available: 2_000_000,
      ratio: 100,
    };
    const prompt = buildInsightsUserPrompt(ctx);
    expect(prompt).toContain("100%");
    expect(prompt).not.toContain("EXCEDE EL DISPONIBLE");
  });
});
