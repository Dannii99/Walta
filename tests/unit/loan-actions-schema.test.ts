import { describe, it, expect } from "vitest";
import {
  createLoanSchema,
  computePaidInstallments,
} from "@/server/schemas/loan-schemas";

const validBaseInput = {
  userId: "user-1",
  title: "Apartamento",
  type: "HOUSING" as const,
  principal: 100_000_000,
  downPayment: 0,
  annualRate: 0.18,
  termMonths: 60,
  formula: "french_ea" as const,
  monthlyPayment: 2_500_000,
  totalInterest: 50_000_000,
  totalCost: 150_000_000,
  fees: [],
};

describe("computePaidInstallments (derives count of toggled PAID months)", () => {
  it("returns 0 when pastPaymentsSync is empty", () => {
    expect(computePaidInstallments([])).toBe(0);
  });

  it("returns 3 when 3 entries are PAID", () => {
    const sync = [
      { month: 0, year: 2025, status: "PAID" as const },
      { month: 1, year: 2025, status: "PAID" as const },
      { month: 2, year: 2025, status: "PAID" as const },
    ];
    expect(computePaidInstallments(sync)).toBe(3);
  });

  it("only counts PAID entries (skips PENDING and DEFAULTED)", () => {
    const sync = [
      { month: 0, year: 2025, status: "PAID" as const },
      { month: 1, year: 2025, status: "PENDING" as const },
      { month: 2, year: 2025, status: "DEFAULTED" as const },
      { month: 3, year: 2025, status: "PAID" as const },
    ];
    expect(computePaidInstallments(sync)).toBe(2);
  });
});

describe("createLoanSchema (startDate validation)", () => {
  it("rejects a startDate more than 1 day in the future", () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    expect(() =>
      createLoanSchema.parse({ ...validBaseInput, startDate: future })
    ).toThrow(/fecha de inicio/i);
  });

  it("accepts a startDate 60 months in the past with termMonths=60", () => {
    const sixtyMonthsAgo = new Date();
    sixtyMonthsAgo.setMonth(sixtyMonthsAgo.getMonth() - 60);
    const parsed = createLoanSchema.parse({
      ...validBaseInput,
      startDate: sixtyMonthsAgo,
    });
    expect(parsed.startDate).toBeInstanceOf(Date);
  });
});
