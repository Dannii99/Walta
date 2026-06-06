import type { Loan, LoanPayment, LoanExtraPayment, AmortizationRow } from "@/types";
import { calculateTotalMonthlyFees } from "@/lib/loan-fees";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(year, month + months, day));
}

function isSameMonth(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth()
  );
}

/**
 * Generates the amortization schedule for a loan, respecting real payments,
 * extra payments, and the `paidInstallments` count synced from the bank
 * statement.
 *
 * **Length semantics** (Bug #6 fix):
 * The schedule length is the maximum of:
 * - `termMonths`            (the original term)
 * - `paidInstallments`      (what the bank statement says)
 * - rows needed to drain the balance
 *
 * This prevents the schedule from collapsing when an extra payment zeroes
 * the balance early. Rows beyond the natural term (paidInstallments > termMonths)
 * are generated as a final row with status `PAID`.
 *
 * Rows covered by `paidInstallments` but lacking a real `LoanPayment` are
 * flagged with `paidFromExtract: true` so the UI can distinguish them from
 * manually-recorded payments.
 */
export function generateAmortizationSchedule(
  loan: Loan,
  payments: LoanPayment[],
  extraPayments: LoanExtraPayment[]
): AmortizationRow[] {
  const principal = parseFloat(loan.principal);
  const annualRate = parseFloat(loan.annualRate);
  const termMonths = loan.termMonths;
  const formula = loan.formula;
  const monthlyPayment = parseFloat(loan.monthlyPayment);
  const startDate = new Date(loan.startDate);
  const today = new Date();

  const monthlyRate =
    formula === "french_ea"
      ? Math.pow(1 + annualRate, 1 / 12) - 1
      : annualRate / 12;

  const sortedExtras = extraPayments
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  // Pre-compute the monthly fee contribution (constant across all rows of
  // this loan). Comes from `loan.fees` (relational LoanFee[] post-migration
  // or FeeItem[] from older tests/queries). Same annual÷12 model as
  // `calculateTotalMonthlyFees`.
  const monthlyFee = calculateTotalMonthlyFees(
    (loan.fees ?? []) as Parameters<typeof calculateTotalMonthlyFees>[0]
  );

  // Find the latest month that any real LoanPayment covers, so we know which
  // months are "real" vs synthetic-from-extract.
  const realPaidMonths = new Set<number>();
  for (const p of payments) {
    const paidDate = new Date(p.paidDate);
    const monthsFromStart =
      (paidDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
      (paidDate.getUTCMonth() - startDate.getUTCMonth());
    const month = monthsFromStart + 1;
    if (month >= 1 && month <= termMonths * 2) {
      realPaidMonths.add(month);
    }
  }

  const paidInstallments = loan.paidInstallments ?? 0;

  // Determine how many rows we need. We go up to max(termMonths, paidInstallments)
  // and break early if the balance is exhausted.
  const upperBound = Math.max(termMonths, paidInstallments);

  for (let month = 1; month <= upperBound; month++) {
    const currentDate = addMonths(startDate, month - 1);
    const interest = balance * monthlyRate;
    let principalPortion = monthlyPayment - interest;

    // Final payment adjustment
    if (principalPortion >= balance) {
      principalPortion = balance;
    }

    if (principalPortion < 0) principalPortion = 0;
    balance = Math.max(0, balance - principalPortion);

    // Apply extra payments for this month
    const extrasThisMonth = sortedExtras.filter((ex) =>
      isSameMonth(new Date(ex.date), currentDate)
    );
    let extraTotal = 0;
    for (const ex of extrasThisMonth) {
      const extraAmt = parseFloat(ex.amount);
      extraTotal += extraAmt;
      balance = Math.max(0, balance - extraAmt);
    }

    // Find a real LoanPayment matching this month
    const actual = payments.find((p) =>
      isSameMonth(new Date(p.paidDate), currentDate)
    );
    const hasRealPayment = actual !== undefined;

    // Determine paidFromExtract: only rows within the paidInstallments range
    // (set from the bank statement) and lacking a real LoanPayment backing.
    // Rows beyond that range that show balance=0 are NOT extract-paid — they
    // represent "credit paid off early via extras" (a different concept).
    const paidFromExtract = !hasRealPayment && month <= paidInstallments;

    // Determine status with priority:
    // 1. Real payment → PAID (actualPayment set)
    // 2. Within paidInstallments range, no real payment → PAID (extract-synthetic)
    // 3. Balance already exhausted beyond the extract range → PAID_OFF
    //    (the credit is paid off; the row is informational, not a real installment)
    // 4. Current month already passed, not paid → PENDING or DEFAULTED
    // 5. Future month → UPCOMING
    let status: AmortizationRow["status"];
    if (hasRealPayment) {
      status = "PAID";
    } else if (paidFromExtract) {
      status = "PAID";
    } else if (balance <= 0.01 && month > paidInstallments) {
      status = "PAID_OFF";
    } else if (currentDate < today) {
      status = loan.status === "DEFAULTED" ? "DEFAULTED" : "PENDING";
    } else {
      status = "UPCOMING";
    }

    schedule.push({
      month,
      date: currentDate,
      payment: principalPortion + interest,
      monthlyFee,
      totalPayment: principalPortion + interest + monthlyFee,
      interest,
      principal: principalPortion,
      extraPayment: extraTotal,
      balance,
      status,
      actualPayment: actual ?? null,
      paidFromExtract: paidFromExtract || undefined,
    });
  }

  return schedule;
}

export function calculateRemainingBalance(
  loan: Loan,
  payments: LoanPayment[],
  extraPayments: LoanExtraPayment[]
): number {
  const today = new Date();
  const startDate = new Date(loan.startDate);

  // If loan hasn't started yet, return full principal
  if (startDate > today) {
    return parseFloat(loan.principal);
  }

  const schedule = generateAmortizationSchedule(loan, payments, extraPayments);
  if (schedule.length === 0) return parseFloat(loan.principal);

  // Find the last PAID row to determine actual remaining balance
  const paidRows = schedule.filter((row) => row.status === "PAID");
  if (paidRows.length > 0) {
    const lastPaid = paidRows[paidRows.length - 1];
    // If there are pending/defaulted rows after last paid, balance continues to accrue
    // but for simplicity we return the scheduled balance at current month or last paid
    const currentMonthRow = schedule.find((row) => isSameMonth(row.date, today));
    if (currentMonthRow) {
      return currentMonthRow.balance;
    }
    return lastPaid.balance;
  }

  // Find the row corresponding to the current month
  const currentMonthRow = schedule.find((row) => isSameMonth(row.date, today));
  if (currentMonthRow) {
    return currentMonthRow.balance;
  }

  // If today is before the first row, return principal
  if (today < schedule[0].date) {
    return parseFloat(loan.principal);
  }

  // If today is after the last row, return final balance
  return schedule[schedule.length - 1].balance;
}

export function getProjectedPayoffDate(
  loan: Loan,
  payments: LoanPayment[],
  extraPayments: LoanExtraPayment[]
): Date | null {
  const schedule = generateAmortizationSchedule(loan, payments, extraPayments);
  if (schedule.length === 0) return null;
  const lastRow = schedule[schedule.length - 1];
  if (lastRow.balance > 0.01) return null; // not projected to be paid off
  return lastRow.date;
}

export function getNextPaymentDate(loan: Loan): Date {
  const startDate = new Date(loan.startDate);
  const paidCount = loan.payments?.length ?? 0;
  return addMonths(startDate, paidCount + 1);
}

export function getPaidInstallments(loan: Loan): number {
  return loan.paidInstallments ?? loan.payments?.length ?? 0;
}

export function getDaysOverdue(date: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function getPaymentStatusCounts(
  schedule: AmortizationRow[]
): {
  paid: number;
  paidFromExtract: number;
  paidReal: number;
  paidOff: number;
  pending: number;
  defaulted: number;
  upcoming: number;
} {
  return schedule.reduce(
    (acc, row) => {
      if (row.status === "PAID") {
        acc.paid++;
        if (row.paidFromExtract) acc.paidFromExtract++;
        else acc.paidReal++;
      } else if (row.status === "PAID_OFF") {
        acc.paidOff++;
      } else if (row.status === "PENDING") acc.pending++;
      else if (row.status === "DEFAULTED") acc.defaulted++;
      else if (row.status === "UPCOMING") acc.upcoming++;
      return acc;
    },
    { paid: 0, paidFromExtract: 0, paidReal: 0, paidOff: 0, pending: 0, defaulted: 0, upcoming: 0 }
  );
}
