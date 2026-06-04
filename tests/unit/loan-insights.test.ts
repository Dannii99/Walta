import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateLoanInsights,
  clearLoanInsightsCache,
  clearAllLoanInsightsCache,
  _getLoanInsightsCacheSizeForTests,
} from "@/lib/ai/loan-insights";
import type { LoanInsightsContext } from "@/lib/ai/loan-prompts";

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
  ],
  activeCount: 1,
  paidOffCount: 0,
  defaultedCount: 0,
  totalActiveMonthly: 1_018_463.5,
  totalPrincipalRemaining: 26_630_730,
  totalPaid: 20_369_270,
  available: 401_700,
  income: 4_000_000,
  ratio: 253,
  hasMoratory: false,
};

const emptyContext: LoanInsightsContext = {
  ...baseContext,
  loans: [],
  activeCount: 0,
  paidOffCount: 0,
  defaultedCount: 0,
  totalActiveMonthly: 0,
  totalPrincipalRemaining: 0,
  totalPaid: 0,
  ratio: 0,
};

beforeEach(() => {
  clearAllLoanInsightsCache();
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

describe("generateLoanInsights", () => {
  it("returns cached empty-state message when portfolio is empty (no GROQ call)", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    const first = await generateLoanInsights(emptyContext, "user-1");
    const second = await generateLoanInsights(emptyContext, "user-1");

    expect(first).toMatch(/Aún no tienes créditos/i);
    expect(second).toBe(first);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls GROQ and returns parsed insight on first call with loans", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  insight: "Tu cuota de $1.018.463 representa 253% del disponible.",
                }),
              },
            },
          ],
        }) as unknown as Response
      );

    const result = await generateLoanInsights(baseContext, "user-1");

    expect(result).toMatch(/253% del disponible/);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("returns cached insight on second call without re-hitting GROQ", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  insight: "Tu portafolio está en zona riesgosa.",
                }),
              },
            },
          ],
        }) as unknown as Response
      );

    const first = await generateLoanInsights(baseContext, "user-1");
    const second = await generateLoanInsights(baseContext, "user-1");

    expect(first).toBe(second);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("keys cache by userId (no cross-user leaks)", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        mockGroqResponse({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  insight:
                    "Tu compromiso total con créditos activos está por encima del disponible mensual.",
                }),
              },
            },
          ],
        }) as unknown as Response
      );

    await generateLoanInsights(baseContext, "user-1");
    await generateLoanInsights(baseContext, "user-2");
    await generateLoanInsights(baseContext, "user-3");

    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(_getLoanInsightsCacheSizeForTests()).toBe(3);
  });

  it("clearLoanInsightsCache removes a specific user's cache entry", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      mockGroqResponse({
        choices: [
          {
            message: {
              content: JSON.stringify({
                insight:
                  "Tu portafolio tiene un crédito dominante que deberías revisar pronto.",
              }),
            },
          },
        ],
      }) as unknown as Response
    );

    await generateLoanInsights(baseContext, "user-1");
    await generateLoanInsights(baseContext, "user-2");
    expect(_getLoanInsightsCacheSizeForTests()).toBe(2);

    clearLoanInsightsCache("user-1");
    expect(_getLoanInsightsCacheSizeForTests()).toBe(1);
  });
});
