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
    paidInstallments: 0,
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

  it("keeps full term length but marks rows after balance exhaustion as PAID_OFF", () => {
    // Bug #6 fix: the schedule length must remain equal to the original term
    // even when extras zero the balance early. Rows after the balance is
    // exhausted (and beyond paidInstallments) are flagged PAID_OFF with
    // balance=0, distinct from "paid from extract" (which requires a real
    // paidInstallments value). The UI shows the full original term accurately
    // and the count of "pagadas" excludes PAID_OFF.
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
    // Both schedules have the same length (full term).
    expect(scheduleWithExtra.length).toBe(scheduleWithoutExtra.length);
    // After the extra zeroes the balance, the remaining rows are PAID_OFF
    // (not PAID via paidFromExtract, which requires paidInstallments > 0).
    const zeroedRows = scheduleWithExtra.filter(
      (r) => r.balance <= 0.01 && r.status === "PAID_OFF"
    );
    expect(zeroedRows.length).toBeGreaterThan(0);
  });

  it("uses NAMV formula correctly (higher monthly rate)", () => {
    const loanEA = makeLoan({ formula: "french_ea", annualRate: "0.15" });
    const loanNAMV = makeLoan({ formula: "nominal_monthly", annualRate: "0.15" });

    const scheduleEA = generateAmortizationSchedule(loanEA, [], []);
    const scheduleNAMV = generateAmortizationSchedule(loanNAMV, [], []);

    // NAMV with same nominal rate should have higher interest in early months
    // because monthly rate = 0.15/12 = 0.0125 vs EA monthly = (1.15)^(1/12)-1 Ôëê 0.0117
    expect(scheduleNAMV[0].interest).toBeGreaterThan(scheduleEA[0].interest);
  });

  it("marks past months as DEFAULTED when loan status is DEFAULTED", () => {
    const loan = makeLoan({ startDate: new Date("2020-01-01"), status: "DEFAULTED" });
    const schedule = generateAmortizationSchedule(loan, [], []);
    const defaultedRows = schedule.filter((r) => r.status === "DEFAULTED");
    expect(defaultedRows.length).toBeGreaterThan(0);
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

  it("returns paidInstallments when set (sourced from bank extract)", () => {
    const loan = makeLoan({ paidInstallments: 7 });
    expect(getPaidInstallments(loan)).toBe(7);
  });

  it("falls back to payments count when paidInstallments is undefined", () => {
    const payments: LoanPayment[] = [
      { id: "p1", loanId: "l1", amount: "100", principalPaid: "80", interestPaid: "20", paidDate: new Date(), createdAt: new Date() },
      { id: "p2", loanId: "l1", amount: "100", principalPaid: "80", interestPaid: "20", paidDate: new Date(), createdAt: new Date() },
    ];
    const base = makeLoan({ payments });
    // strip paidInstallments to simulate a legacy record
    const { paidInstallments: _ignore, ...rest } = base;
    void _ignore;
    const loan = { ...rest, payments } as Loan;
    expect(getPaidInstallments(loan)).toBe(2);
  });
});

describe("generateAmortizationSchedule (paidInstallments integration)", () => {
  it("keeps full term length even when balance is exhausted early by extras", () => {
    // Term = 11 months, large extra payment at month 2 zeroes the balance.
    // Schedule MUST still have 11 rows (the full original term).
    const loan = makeLoan({
      termMonths: 11,
      monthlyPayment: "900000",
      startDate: new Date("2024-01-01"),
    });
    const extraPayments: LoanExtraPayment[] = [
      {
        id: "ex1",
        loanId: "loan-1",
        amount: "99000000",
        date: new Date("2024-02-15"),
        createdAt: new Date(),
      },
    ];
    const schedule = generateAmortizationSchedule(loan, [], extraPayments);
    expect(schedule.length).toBe(11);
  });

  it("marks first N rows as PAID with paidFromExtract when paidInstallments > real payments", () => {
    const loan = makeLoan({
      termMonths: 12,
      paidInstallments: 5,
      startDate: new Date("2024-01-01"),
    });
    const schedule = generateAmortizationSchedule(loan, [], []);
    expect(schedule.length).toBe(12);
    // First 5 rows are paid-from-extract
    for (let i = 0; i < 5; i++) {
      expect(schedule[i].status).toBe("PAID");
      expect(schedule[i].paidFromExtract).toBe(true);
    }
    // Rows 6-12 are pending/upcoming
    for (let i = 5; i < 12; i++) {
      expect(schedule[i].status).not.toBe("PAID");
      expect(schedule[i].paidFromExtract).toBeFalsy();
    }
  });

  it("prefers real LoanPayment over paidFromExtract when both cover the same month", () => {
    const loan = makeLoan({
      termMonths: 12,
      paidInstallments: 3,
      startDate: new Date("2024-01-01"),
    });
    const realPayment: LoanPayment = {
      id: "real1",
      loanId: "loan-1",
      amount: "2378456",
      principalPaid: "2000000",
      interestPaid: "378456",
      paidDate: new Date("2024-01-15"),
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [realPayment], []);
    // Row 1 has a real payment → NOT paidFromExtract
    expect(schedule[0].status).toBe("PAID");
    expect(schedule[0].paidFromExtract).toBeFalsy();
    // Rows 2-3 are paidFromExtract
    expect(schedule[1].status).toBe("PAID");
    expect(schedule[1].paidFromExtract).toBe(true);
    expect(schedule[2].status).toBe("PAID");
    expect(schedule[2].paidFromExtract).toBe(true);
  });

  it("sets monthlyFee to 0 on every row when loan has no fees", () => {
    const loan = makeLoan();
    const schedule = generateAmortizationSchedule(loan, [], []);
    expect(schedule.length).toBeGreaterThan(0);
    for (const row of schedule) {
      expect(row.monthlyFee).toBe(0);
    }
  });

  it("sets monthlyFee to the same constant value on every row when loan has fees", () => {
    // Annual insurance = $3,600,000 stored as monthly fee → $300,000/mes
    const loan = makeLoan({
      fees: [
        { id: "f1", name: "Seguro anual", amount: 3_600_000, type: "monthly" },
      ],
    });
    const schedule = generateAmortizationSchedule(loan, [], []);
    expect(schedule.length).toBeGreaterThan(0);
    const first = schedule[0].monthlyFee;
    expect(first).toBe(300_000);
    for (const row of schedule) {
      expect(row.monthlyFee).toBe(first);
    }
  });

  it("makes totalPayment equal payment + monthlyFee on every row", () => {
    const loan = makeLoan({
      fees: [
        { id: "f1", name: "Seguro anual", amount: 1_200_000, type: "monthly" },
        { id: "f2", name: "Administración", amount: 600_000, type: "monthly" },
      ],
    });
    const schedule = generateAmortizationSchedule(loan, [], []);
    for (const row of schedule) {
      expect(row.totalPayment).toBeCloseTo(row.payment + row.monthlyFee, 6);
    }
  });
});
