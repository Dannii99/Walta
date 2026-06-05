import { describe, it, expect } from "vitest";
import {
  buildLoanAdvisorUserPrompt,
  buildLoanInsightsUserPrompt,
  type LoanAdvisorContext,
  type LoanInsightsContext,
} from "@/lib/ai/loan-prompts";

describe("buildLoanAdvisorUserPrompt", () => {
  const baseContext: LoanAdvisorContext = {
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
    ],
    loan: {
      id: "loan-1",
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
      health: "DEFAULTED",
      recentPayments: [
        { month: 20, amount: 1_018_463.5, paidDate: "2025-09-15" },
        { month: 19, amount: 1_018_463.5, paidDate: "2025-08-15" },
      ],
      upcomingPayments: [
        { month: 21, amount: 1_018_463.5, projectedDate: "2025-10-15" },
        { month: 22, amount: 1_018_463.5, projectedDate: "2025-11-15" },
      ],
      monthlyFees: 35_000,
      formula: "french_ea",
    },
  };

  it("includes user financial context with specific figures", () => {
    const prompt = buildLoanAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("CONTEXTO FINANCIERO DEL USUARIO");
    expect(prompt).toMatch(/4\.000\.000/);
    expect(prompt).not.toMatch(/4\.000\.000,00/);
    expect(prompt).toMatch(/401\.700/);
    expect(prompt).toMatch(/120\.510/);
    expect(prompt).toMatch(/2\.550\.000/);
  });

  it("includes the loan being analyzed with all key fields", () => {
    const prompt = buildLoanAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("CRÉDITO A ANALIZAR");
    expect(prompt).toContain("Carro 2026");
    expect(prompt).toContain("Tipo: Vehículo");
    expect(prompt).toContain("Estado: Activo");
    expect(prompt).toContain("Salud (ratio cuota/disponible): Riesgoso");
    expect(prompt).toMatch(/47\.000\.000/);
    expect(prompt).toMatch(/26\.289\.376/);
    expect(prompt).toContain("17.18% EA");
    expect(prompt).toContain("Francesa (EA)");
    expect(prompt).toContain("72 meses");
    expect(prompt).toMatch(/1\.018\.46[34]/);
  });

  it("includes progress (paid/remaining/percent)", () => {
    const prompt = buildLoanAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("Cuotas pagadas: 20 de 72 (28% completado)");
    expect(prompt).toMatch(/20\.369\.270/);
    expect(prompt).toMatch(/26\.630\.730/);
  });

  it("includes other active loans with their details", () => {
    const prompt = buildLoanAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("Otros créditos activos:");
    expect(prompt).toContain('Vehículo "Moto"');
    expect(prompt).toMatch(/540\.000/);
    expect(prompt).toContain("18 meses restantes");
  });

  it("handles no other loans gracefully", () => {
    const ctx = { ...baseContext, otherLoans: [], activeLoansTotal: 1_018_463.5 };
    const prompt = buildLoanAdvisorUserPrompt(ctx);

    expect(prompt).toContain("Otros créditos activos: ninguno");
  });

  it("formats recent payments with dates and amounts", () => {
    const prompt = buildLoanAdvisorUserPrompt(baseContext);

    expect(prompt).toContain("PAGOS RECIENTES");
    expect(prompt).toMatch(/1\.018\.46[34]/);
    expect(prompt).not.toContain("sin pagos registrados aún");
  });

  it("shows 'sin pagos registrados aún' when loan is brand new", () => {
    const ctx = {
      ...baseContext,
      loan: { ...baseContext.loan, paidInstallments: 0, recentPayments: [] },
    };
    const prompt = buildLoanAdvisorUserPrompt(ctx);

    expect(prompt).toContain("sin pagos registrados aún");
  });
});

describe("buildLoanInsightsUserPrompt", () => {
  const baseContext: LoanInsightsContext = {
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
    ],
    activeCount: 2,
    paidOffCount: 0,
    defaultedCount: 0,
    totalActiveMonthly: 1_558_463.5,
    totalPrincipalRemaining: 35_030_730,
    totalPaid: 28_700_000,
    available: 401_700,
    income: 4_000_000,
    ratio: 388,
    hasMoratory: false,
  };

  it("includes portfolio totals with specific figures", () => {
    const prompt = buildLoanInsightsUserPrompt(baseContext);

    expect(prompt).toContain("PORTAFOLIO DE CRÉDITOS DEL USUARIO");
    expect(prompt).toMatch(/4\.000\.000/);
    expect(prompt).toMatch(/401\.700/);
    expect(prompt).toMatch(/1\.558\.46[34]/);
    expect(prompt).toMatch(/35\.030\.730/);
    expect(prompt).toContain("Ratio (cuotas activas / disponible): 388%");
  });

  it("flags when ratio exceeds 100% (EXCEDE EL DISPONIBLE)", () => {
    const prompt = buildLoanInsightsUserPrompt(baseContext);
    expect(prompt).toContain("(EXCEDE EL DISPONIBLE)");
  });

  it("omits EXCEDE marker when ratio is under 100%", () => {
    const ctx = { ...baseContext, ratio: 65 };
    const prompt = buildLoanInsightsUserPrompt(ctx);

    expect(prompt).not.toContain("EXCEDE EL DISPONIBLE");
    expect(prompt).toContain("Ratio (cuotas activas / disponible): 65%");
  });

  it("flags moratory credits when present", () => {
    const prompt = buildLoanInsightsUserPrompt(baseContext);
    expect(prompt).toMatch(/Créditos con cuotas en mora:.*NO/);
  });

  it("flags moratory credits SÍ when hasMoratory=true", () => {
    const ctx = { ...baseContext, hasMoratory: true };
    const prompt = buildLoanInsightsUserPrompt(ctx);

    expect(prompt).toMatch(/Créditos con cuotas en mora:.*SÍ/);
  });

  it("handles empty portfolio", () => {
    const ctx: LoanInsightsContext = {
      ...baseContext,
      loans: [],
      activeCount: 0,
      paidOffCount: 0,
      defaultedCount: 0,
      totalActiveMonthly: 0,
      totalPrincipalRemaining: 0,
      ratio: 0,
    };
    const prompt = buildLoanInsightsUserPrompt(ctx);

    expect(prompt).toContain("Detalle: sin créditos");
    expect(prompt).toContain("Total créditos: 0 (0 activos, 0 pagados, 0 en mora)");
  });

  it("lists each loan with its type label and details", () => {
    const prompt = buildLoanInsightsUserPrompt(baseContext);

    expect(prompt).toContain("Carro 2026");
    expect(prompt).toContain("Moto");
    expect(prompt).toContain("% pagado");
    expect(prompt).toContain("Activo");
  });
});
