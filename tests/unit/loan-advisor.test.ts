import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateLoanAdvisorAnalysis,
  invalidateLoanAdvisorCache,
  clearAllLoanAdvisorCache,
  _getLoanAdvisorCacheSizeForTests,
} from "@/lib/ai/loan-advisor";
import type { LoanAdvisorContext } from "@/lib/ai/loan-prompts";

const baseContext: LoanAdvisorContext = {
  income: 4_000_000,
  available: 401_700,
  recommendedMax: 120_510,
  activeLoansTotal: 1_018_463.5,
  otherLoans: [],
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
    recentPayments: [],
    upcomingPayments: [],
    monthlyFees: 0,
    formula: "french_ea",
  },
};

const validAnalysis = {
  verdict_explanation: "Tu crédito está en zona riesgosa.",
  recommendations: [
    {
      title: "Haz un abono extra",
      description: "Reduce el plazo y los intereses.",
      impact: "positive",
    },
  ],
  risks: ["Riesgo de mora si no reduces la cuota."],
  alternative_suggestion: "Refinancia si consigues una tasa menor.",
};

beforeEach(() => {
  clearAllLoanAdvisorCache();
  process.env.GROQ_API_KEY = "gsk_test_dummy_key_for_unit_tests_1234567890";
  vi.restoreAllMocks();
});

function mockGroqResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  };
}

describe("generateLoanAdvisorAnalysis", () => {
  it("calls GROQ and returns parsed analysis on first call", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [{ message: { content: JSON.stringify(validAnalysis) } }],
        }) as unknown as Response
      );

    const result = await generateLoanAdvisorAnalysis(
      baseContext,
      "user-1",
      "loan-1"
    );

    expect(result.analysis.verdict_explanation).toBe(
      "Tu crédito está en zona riesgosa."
    );
    expect(result.cached).toBe(false);
    expect(result.generatedAt).toBeInstanceOf(Date);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("returns cached result on second call without re-hitting GROQ", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [{ message: { content: JSON.stringify(validAnalysis) } }],
        }) as unknown as Response
      );

    const first = await generateLoanAdvisorAnalysis(
      baseContext,
      "user-1",
      "loan-1"
    );
    const second = await generateLoanAdvisorAnalysis(
      baseContext,
      "user-1",
      "loan-1"
    );

    expect(first.cached).toBe(false);
    expect(second.cached).toBe(true);
    expect(second.analysis.verdict_explanation).toBe(
      first.analysis.verdict_explanation
    );
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("keys cache by userId:loanId (no cross-user leaks)", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [{ message: { content: JSON.stringify(validAnalysis) } }],
        }) as unknown as Response
      );

    await generateLoanAdvisorAnalysis(baseContext, "user-1", "loan-1");
    await generateLoanAdvisorAnalysis(baseContext, "user-2", "loan-1");
    await generateLoanAdvisorAnalysis(baseContext, "user-1", "loan-2");

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(_getLoanAdvisorCacheSizeForTests()).toBe(3);
  });

  it("invalidates cache for a specific userId:loanId", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      mockGroqResponse({
        choices: [{ message: { content: JSON.stringify(validAnalysis) } }],
      }) as unknown as Response
    );

    await generateLoanAdvisorAnalysis(baseContext, "user-1", "loan-1");
    await generateLoanAdvisorAnalysis(baseContext, "user-2", "loan-1");
    expect(_getLoanAdvisorCacheSizeForTests()).toBe(2);

    invalidateLoanAdvisorCache("user-1", "loan-1");
    expect(_getLoanAdvisorCacheSizeForTests()).toBe(1);

    const next = await generateLoanAdvisorAnalysis(
      baseContext,
      "user-1",
      "loan-1"
    );
    expect(next.cached).toBe(false);
  });

  it("throws GroqParseError when response fails schema validation", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      mockGroqResponse({
        choices: [
          {
            message: {
              content: JSON.stringify({ verdict_explanation: "incomplete" }),
            },
          },
        ],
      }) as unknown as Response
    );

    await expect(
      generateLoanAdvisorAnalysis(baseContext, "user-1", "loan-1")
    ).rejects.toThrow(/schema validation/i);
  });
});
