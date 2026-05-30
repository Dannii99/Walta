import { describe, it, expect } from "vitest";
import {
  generateAmortizationSchedule,
  calculateRemainingBalance,
  getProjectedPayoffDate,
  getNextPaymentDate,
  getPaidInstallments,
} from "@/lib/loan-engine";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

function makeLoan(overrides: Partial<Loan> = {}): Loan {
  return {
    id: "loan-1",
    userId: "user-1",
    title: "Test Loan",
    type: "VEHICLE",
    principal: "100000000",
    downPayment: "0",
    annualRate: "0.15",
    termMonths: 60,
    formula: "french_ea",
    monthlyPayment: "2378456",
    startDate: new Date("2024-01-01"),
    status: "ACTIVE",
    totalInterest: "42620736",
    totalCost: "142620736",
    currency: "COP",
    createdAt: new Date(),
    updatedAt: new Date(),
    payments: [],
    extraPayments: [],
    ...overrides,
  };
}

describe("generateAmortizationSchedule", () => {
  it("generates schedule with correct number of months for no extras", () => {
    const loan = makeLoan();
    const schedule = generateAmortizationSchedule(loan, [], []);
    expect(schedule.length).toBeLessThanOrEqual(60);
    expect(schedule.length).toBeGreaterThan(0);
    expect(schedule[0].month).toBe(1);
    expect(schedule[schedule.length - 1].balance).toBeLessThan(1);
  });

  it("reduces balance each month", () => {
    const loan = makeLoan();
    const schedule = generateAmortizationSchedule(loan, [], []);
    expect(schedule[0].balance).toBeLessThan(parseFloat(loan.principal));
    expect(schedule[schedule.length - 1].balance).toBeLessThan(1);
  });

  it("marks months with actual payments as PAID", () => {
    const loan = makeLoan();
    const payment: LoanPayment = {
      id: "p1",
      loanId: loan.id,
      amount: loan.monthlyPayment,
      principalPaid: "2000000",
      interestPaid: "378456",
      paidDate: new Date("2024-01-15"),
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [payment], []);
    expect(schedule[0].status).toBe("PAID");
    expect(schedule[0].actualPayment).not.toBeNull();
  });

  it("marks past months without payment as PENDING", () => {
    const loan = makeLoan({ startDate: new Date("2020-01-01") });
    const schedule = generateAmortizationSchedule(loan, [], []);
    const pendingRows = schedule.filter((r) => r.status === "PENDING");
    expect(pendingRows.length).toBeGreaterThan(0);
  });

  it("marks future months as UPCOMING", () => {
    const loan = makeLoan({ startDate: new Date("2030-01-01") });
    const schedule = generateAmortizationSchedule(loan, [], []);
    const upcomingRows = schedule.filter((r) => r.status === "UPCOMING");
    expect(upcomingRows.length).toBeGreaterThan(0);
    expect(upcomingRows.length).toBeLessThanOrEqual(60);
  });

  it("shortens term when extra payments are applied", () => {
    const loan = makeLoan();
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "20000000",
      date: new Date("2024-02-01"),
      createdAt: new Date(),
    };
    const scheduleWithExtra = generateAmortizationSchedule(loan, [], [extra]);
    const scheduleWithoutExtra = generateAmortizationSchedule(loan, [], []);
    expect(scheduleWithExtra.length).toBeLessThan(scheduleWithoutExtra.length);
  });

  it("uses NAMV formula correctly (higher monthly rate)", () => {
    const loanEA = makeLoan({ formula: "french_ea", annualRate: "0.15" });
    const loanNAMV = makeLoan({ formula: "nominal_monthly", annualRate: "0.15" });

    const scheduleEA = generateAmortizationSchedule(loanEA, [], []);
    const scheduleNAMV = generateAmortizationSchedule(loanNAMV, [], []);

    // NAMV with same nominal rate should have higher interest in early months
    // because monthly rate = 0.15/12 = 0.0125 vs EA monthly = (1.15)^(1/12)-1 ≈ 0.0117
    expect(scheduleNAMV[0].interest).toBeGreaterThan(scheduleEA[0].interest);
  });
});

describe("calculateRemainingBalance", () => {
  it("returns principal when no payments made and future start", () => {
    const loan = makeLoan({ startDate: new Date("2030-01-01") });
    const balance = calculateRemainingBalance(loan, [], []);
    expect(balance).toBe(parseFloat(loan.principal));
  });

  it("returns lower balance after some payments", () => {
    const loan = makeLoan({ startDate: new Date("2020-01-01") });
    const payments: LoanPayment[] = Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      loanId: loan.id,
      amount: loan.monthlyPayment,
      principalPaid: "2000000",
      interestPaid: "378456",
      paidDate: new Date(2020, i, 15),
      createdAt: new Date(),
    }));
    const balance = calculateRemainingBalance(loan, payments, []);
    expect(balance).toBeLessThan(parseFloat(loan.principal));
  });
});

describe("getProjectedPayoffDate", () => {
  it("returns date for fully paid loan", () => {
    const loan = makeLoan();
    const date = getProjectedPayoffDate(loan, [], []);
    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(2028); // 2024 + 5 years
  });

  it("returns null when balance will not reach zero", () => {
    const loan = makeLoan({ monthlyPayment: "1000" }); // way too low
    const date = getProjectedPayoffDate(loan, [], []);
    expect(date).toBeNull();
  });
});

describe("getNextPaymentDate", () => {
  it("returns startDate + 1 month when no payments", () => {
    const loan = makeLoan({ startDate: new Date("2024-01-01"), payments: [] });
    const next = getNextPaymentDate(loan);
    expect(next.getUTCFullYear()).toBe(2024);
    expect(next.getUTCMonth()).toBe(1); // February
  });

  it("returns startDate + paidCount + 1 when payments exist", () => {
    const payments: LoanPayment[] = Array.from({ length: 3 }, (_, i) => ({
      id: `p${i}`,
      loanId: "loan-1",
      amount: "1000000",
      principalPaid: "800000",
      interestPaid: "200000",
      paidDate: new Date(2024, i, 15),
      createdAt: new Date(),
    }));
    const loan = makeLoan({ startDate: new Date("2024-01-01"), payments });
    const next = getNextPaymentDate(loan);
    expect(next.getUTCMonth()).toBe(4); // May (0-indexed)
  });
});

describe("getPaidInstallments", () => {
  it("returns 0 when no payments", () => {
    const loan = makeLoan({ payments: [] });
    expect(getPaidInstallments(loan)).toBe(0);
  });

  it("returns payment count", () => {
    const payments: LoanPayment[] = [
      { id: "p1", loanId: "l1", amount: "100", principalPaid: "80", interestPaid: "20", paidDate: new Date(), createdAt: new Date() },
      { id: "p2", loanId: "l1", amount: "100", principalPaid: "80", interestPaid: "20", paidDate: new Date(), createdAt: new Date() },
    ];
    const loan = makeLoan({ payments });
    expect(getPaidInstallments(loan)).toBe(2);
  });
});
