import { describe, it, expect } from "vitest";
import {
  generateAmortizationSchedule,
  calculateRemainingBalance,
  getProjectedPayoffDate,
  getNextPaymentDate,
  getPaidInstallments,
  getCurrentEffectiveLoanPayment,
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

  // -----------------------------------------------------------------------
  // Phase transitions via REDUCE_PAYMENT extras
  // -----------------------------------------------------------------------

  it("REDUCE_PAYMENT extra recalculates the cuota starting the next month", () => {
    // Loan: $100M, 15% EA, 60 months → base cuota ~$2,378,456
    // Extra of $20M at month 6 with REDUCE_PAYMENT, new term 60 months
    // (same as original). The new cuota is for the smaller post-extra
    // balance over the same term, so it MUST be lower than the base.
    const loan = makeLoan();
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "20000000",
      date: new Date("2024-06-15"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 60,
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [], [extra]);
    // Row 6 (the extra month) still uses the base cuota.
    expect(schedule[5].payment).toBeCloseTo(parseFloat(loan.monthlyPayment), 0);
    // Row 7+ uses a recalculated cuota that is lower than the base.
    const baseCuota = parseFloat(loan.monthlyPayment);
    expect(schedule[6].payment).toBeLessThan(baseCuota);
  });

  it("REDUCE_PAYMENT extra changes the paymentPhase marker on subsequent rows", () => {
    // Use a setup where the new term is bigger than the original remaining
    // so the schedule grows past the original term and the new phase
    // covers all remaining rows.
    const loan = makeLoan({
      termMonths: 24,
      monthlyPayment: "4835200",
    });
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "10000000",
      date: new Date("2024-06-15"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 30, // longer than the original 24
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [], [extra]);
    // Rows 1..6 are phase 1, rows 7..30 are phase 2.
    for (let i = 0; i < 6; i++) {
      expect(schedule[i].paymentPhase).toBe(1);
    }
    for (let i = 6; i < schedule.length; i++) {
      expect(schedule[i].paymentPhase).toBe(2);
    }
  });

  it("REDUCE_TERM extra (legacy) keeps the base cuota in rows BEFORE the extra", () => {
    // Legacy behavior: extra reduces the balance, the cuota stays the same.
    // The row.payment equals the base cuota in rows that are not past the
    // extra's effect (i.e. where the balance still supports the full
    // principal portion). This is the historical behavior.
    const loan = makeLoan();
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "20000000",
      date: new Date("2024-02-01"),
      // No recalculationMode → defaults to REDUCE_TERM (legacy).
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [], [extra]);
    // Row 1 (before the extra) uses the base cuota.
    const baseCuota = parseFloat(loan.monthlyPayment);
    expect(schedule[0].payment).toBeCloseTo(baseCuota, 0);
    // All rows remain in phase 1.
    for (const row of schedule) {
      expect(row.paymentPhase).toBe(1);
    }
  });

  it("supports multiple chained REDUCE_PAYMENT extras", () => {
    // Two chained recalcs. Original: 24 months, 15% EA.
    // Extra 1: month 6, new term 30 (duración). Initial phase 2 would cover
    //   months 7..36, but gets TRUNCATED at month 18 by extra 2.
    // Extra 2: month 18, new term 36 (duración). Phase 3 covers months 19..54.
    // Total schedule length: 54 rows (max phase endMonth).
    const loan = makeLoan({
      termMonths: 24,
      monthlyPayment: "4835200",
    });
    const extras: LoanExtraPayment[] = [
      {
        id: "e1",
        loanId: loan.id,
        amount: "10000000",
        date: new Date("2024-06-15"),
        recalculationMode: "REDUCE_PAYMENT",
        newTermMonths: 30,
        createdAt: new Date(),
      },
      {
        id: "e2",
        loanId: loan.id,
        amount: "5000000",
        date: new Date("2025-06-15"),
        recalculationMode: "REDUCE_PAYMENT",
        newTermMonths: 36,
        createdAt: new Date(),
      },
    ];
    const schedule = generateAmortizationSchedule(loan, [], extras);
    // Schedule extends to 54 rows (phase 3 endMonth = 18 + 36).
    expect(schedule.length).toBe(54);
    // Phases: 1..6 (phase 1), 7..18 (phase 2, TRUNCATED by extra 2),
    // 19..54 (phase 3).
    for (let i = 0; i < 6; i++) {
      expect(schedule[i].paymentPhase).toBe(1);
    }
    for (let i = 6; i < 18; i++) {
      expect(schedule[i].paymentPhase).toBe(2);
    }
    for (let i = 18; i < 54; i++) {
      expect(schedule[i].paymentPhase).toBe(3);
    }
  });

  it("REDUCE_PAYMENT with newTermMonths shorter than remaining term still recalculates", () => {
    // $50M, 15% EA, 24 months, then extra of $20M with newTermMonths = 18.
    // The schedule now ends at 24 rows (endMonth = 6 + 18 = 24, draining
    // the post-extra balance over 18 cuotas).
    const loan = makeLoan({
      principal: "50000000",
      termMonths: 24,
      monthlyPayment: "2415568",
      totalInterest: "7973624",
      totalCost: "57973624",
    });
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "20000000",
      date: new Date("2024-06-15"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 18,
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [], [extra]);
    // Schedule should be 24 rows (phase 2 endMonth = 6 + 18).
    expect(schedule.length).toBe(24);
    // Rows 1..6 = phase 1, rows 7..24 = phase 2.
    for (let i = 0; i < 6; i++) {
      expect(schedule[i].paymentPhase).toBe(1);
    }
    for (let i = 6; i < 24; i++) {
      expect(schedule[i].paymentPhase).toBe(2);
    }
  });

  it("REDUCE_PAYMENT with newTermMonths > original term extends the schedule", () => {
    // Edge case: user wants to LENGTHEN the term by recalculating. The
    // schedule extends past the original termMonths.
    const loan = makeLoan({
      termMonths: 12,
      monthlyPayment: "9000000",
      totalInterest: "8000000",
      totalCost: "108000000",
    });
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "10000000",
      date: new Date("2024-06-15"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 18, // longer than the original 12
      createdAt: new Date(),
    };
    const schedule = generateAmortizationSchedule(loan, [], [extra]);
    // Schedule must extend to 24 rows (phase 2 endMonth = 6 + 18).
    expect(schedule.length).toBe(24);
    // Rows 1..6 = phase 1, rows 7..24 = phase 2.
    for (let i = 0; i < 6; i++) {
      expect(schedule[i].paymentPhase).toBe(1);
    }
    for (let i = 6; i < 24; i++) {
      expect(schedule[i].paymentPhase).toBe(2);
    }
  });

  // -----------------------------------------------------------------------
  // getCurrentEffectiveLoanPayment — cuota vigente post-recalcs
  // -----------------------------------------------------------------------

  it("getCurrentEffectiveLoanPayment falls back to loan.monthlyPayment with no extras", () => {
    const loan = makeLoan();
    const current = getCurrentEffectiveLoanPayment(loan, [], []);
    expect(current).toBeCloseTo(parseFloat(loan.monthlyPayment), 6);
  });

  it("getCurrentEffectiveLoanPayment returns the post-recalc cuota after a REDUCE_PAYMENT", () => {
    // Realistic scenario: ~$50M loan at 15% EA, 72m. Big extra at month 12
    // with REDUCE_PAYMENT, new term 72 (same plazo restante). The new
    // cuota must be LOWER than the base cuota.
    // paidInstallments = 12 → next row is month 13 (phase 2, post-recalc).
    const loan = makeLoan({
      principal: "50000000",
      termMonths: 72,
      monthlyPayment: "1010000",
      paidInstallments: 12,
    });
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "30000000",
      date: new Date("2024-12-26"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 72,
      createdAt: new Date(),
    };
    const baseCuota = parseFloat(loan.monthlyPayment);
    const current = getCurrentEffectiveLoanPayment(loan, [], [extra]);
    expect(current).toBeGreaterThan(0);
    expect(current).toBeLessThan(baseCuota);
  });

  it("getCurrentEffectiveLoanPayment uses paidInstallments to find the next-month row", () => {
    // With paidInstallments = 0, next row is month 1 (phase 1 → base cuota).
    // With paidInstallments = 7 (past the extra at month 6), next row is
    // month 8 (phase 2 → new cuota).
    const loan = makeLoan({
      termMonths: 24,
      monthlyPayment: "4835200",
    });
    const extra: LoanExtraPayment = {
      id: "e1",
      loanId: loan.id,
      amount: "10000000",
      date: new Date("2024-06-15"),
      recalculationMode: "REDUCE_PAYMENT",
      newTermMonths: 30,
      createdAt: new Date(),
    };
    const beforeExtra = getCurrentEffectiveLoanPayment(
      { ...loan, paidInstallments: 0 },
      [],
      [extra]
    );
    const afterExtra = getCurrentEffectiveLoanPayment(
      { ...loan, paidInstallments: 7 },
      [],
      [extra]
    );
    const baseCuota = parseFloat(loan.monthlyPayment);
    expect(beforeExtra).toBeCloseTo(baseCuota, 0);
    expect(afterExtra).toBeLessThan(baseCuota);
  });
});
