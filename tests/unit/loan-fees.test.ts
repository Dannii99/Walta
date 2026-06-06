import { describe, it, expect } from "vitest";
import {
  getEffectiveMonthlyPayment,
  calculateTotalMonthlyFees,
  calculateTotalUpfrontFees,
  ANNUAL_TO_MONTHLY,
} from "@/lib/loan-fees";
import type { FeeItem } from "@/types";

describe("calculateTotalMonthlyFees", () => {
  it("returns 0 for an empty array", () => {
    expect(calculateTotalMonthlyFees([])).toBe(0);
  });

  it("divides a single monthly fee by ANNUAL_TO_MONTHLY (annual model)", () => {
    // $1,200,000 annual insurance → $100,000/mes
    const fees: FeeItem[] = [
      { id: "f1", name: "Seguro anual", amount: 1_200_000, type: "monthly" },
    ];
    expect(calculateTotalMonthlyFees(fees)).toBe(1_200_000 / ANNUAL_TO_MONTHLY);
  });

  it("sums multiple monthly fees (each ÷ 12)", () => {
    const fees: FeeItem[] = [
      { id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" },
      { id: "f2", name: "Administración", amount: 600_000, type: "monthly" },
    ];
    const expected = 1_200_000 / 12 + 600_000 / 12;
    expect(calculateTotalMonthlyFees(fees)).toBeCloseTo(expected, 6);
  });

  it("ignores upfront fees", () => {
    const fees: FeeItem[] = [
      { id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" },
      { id: "f2", name: "Pago único", amount: 999_999, type: "upfront" },
    ];
    expect(calculateTotalMonthlyFees(fees)).toBe(1_200_000 / 12);
  });
});

describe("calculateTotalUpfrontFees", () => {
  it("returns 0 for an empty array", () => {
    expect(calculateTotalUpfrontFees([])).toBe(0);
  });

  it("sums upfront fees without dividing by 12", () => {
    const fees: FeeItem[] = [
      { id: "f1", name: "Pago único A", amount: 150_000, type: "upfront" },
      { id: "f2", name: "Pago único B", amount: 250_000, type: "upfront" },
    ];
    expect(calculateTotalUpfrontFees(fees)).toBe(400_000);
  });

  it("ignores monthly fees", () => {
    const fees: FeeItem[] = [
      { id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" },
      { id: "f2", name: "Pago único", amount: 150_000, type: "upfront" },
    ];
    expect(calculateTotalUpfrontFees(fees)).toBe(150_000);
  });
});

describe("getEffectiveMonthlyPayment", () => {
  it("returns the bank cuota unchanged when loan has no fees", () => {
    const loan = { monthlyPayment: "2000000" };
    expect(getEffectiveMonthlyPayment(loan)).toBe(2_000_000);
  });

  it("returns the bank cuota unchanged when fees array is empty", () => {
    const loan = { monthlyPayment: "2000000", fees: [] };
    expect(getEffectiveMonthlyPayment(loan)).toBe(2_000_000);
  });

  it("returns the bank cuota unchanged when fees is null/undefined", () => {
    const loanA = { monthlyPayment: "2000000", fees: null };
    const loanB = { monthlyPayment: "2000000", fees: undefined };
    expect(getEffectiveMonthlyPayment(loanA)).toBe(2_000_000);
    expect(getEffectiveMonthlyPayment(loanB)).toBe(2_000_000);
  });

  it("adds monthly fee contribution (annual ÷ 12) to the bank cuota", () => {
    const loan = {
      monthlyPayment: "2000000",
      fees: [
        { id: "f1", name: "Seguro anual", amount: 3_600_000, type: "monthly" as const },
      ],
    };
    // 2_000_000 + 3_600_000 / 12 = 2_000_000 + 300_000 = 2_300_000
    expect(getEffectiveMonthlyPayment(loan)).toBe(2_300_000);
  });

  it("ignores upfront fees when summing monthly fees", () => {
    const loan = {
      monthlyPayment: "1000000",
      fees: [
        { id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" as const },
        { id: "f2", name: "Pago único", amount: 999_999, type: "upfront" as const },
      ],
    };
    // 1_000_000 + 100_000 = 1_100_000 (upfront fee excluded)
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_100_000);
  });

  it("accepts number amounts in fees", () => {
    const loan = {
      monthlyPayment: 1_000_000,
      fees: [{ id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" as const }],
    };
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_100_000);
  });

  it("accepts string amounts in fees", () => {
    const loan = {
      monthlyPayment: "1000000",
      fees: [
        { id: "f1", name: "Seguro", amount: "1200000", type: "monthly" as const },
      ],
    };
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_100_000);
  });

  it("accepts Decimal-like amounts in fees (toString contract)", () => {
    const decimalLike = { toString: () => "1200000" };
    const loan = {
      monthlyPayment: "1000000",
      fees: [{ id: "f1", name: "Seguro", amount: decimalLike, type: "monthly" as const }],
    };
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_100_000);
  });

  it("accepts Decimal-like monthlyPayment (toString contract)", () => {
    const decimalLike = { toString: () => "1000000" };
    const loan = {
      monthlyPayment: decimalLike,
      fees: [
        { id: "f1", name: "Seguro", amount: "1200000", type: "monthly" as const },
      ],
    };
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_100_000);
  });

  it("skips fees whose type is not exactly 'monthly'", () => {
    const loan = {
      monthlyPayment: "1000000",
      fees: [
        { id: "f1", name: "Algo raro", amount: 999_999, type: "weird" as string },
      ],
    };
    // type "weird" doesn't match === "monthly", so it's ignored
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_000_000);
  });

  it("sums multiple monthly fees (each ÷ 12) cumulatively", () => {
    const loan = {
      monthlyPayment: "1000000",
      fees: [
        { id: "f1", name: "Seguro", amount: 1_200_000, type: "monthly" as const },
        { id: "f2", name: "Administración", amount: 600_000, type: "monthly" as const },
      ],
    };
    // 1_000_000 + 100_000 + 50_000 = 1_150_000
    expect(getEffectiveMonthlyPayment(loan)).toBe(1_150_000);
  });
});
