import type { Loan, LoanPayment, LoanExtraPayment, AmortizationRow } from "@/types";
import { calculateTotalMonthlyFees } from "@/lib/loan-fees";
import { calculateFrenchPayment, resolveMonthlyRate } from "@/lib/loan-formulas";

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
 * One "phase" of the amortization schedule. The loan may transition through
 * multiple phases over its lifetime — one per recalc-triggering extra.
 *
 * - `monthlyPayment` is the financial cuota (capital + interest, NO fees) used
 *   for every row in this phase.
 * - `startMonth` is the 1-based month index where the phase starts.
 * - `endMonth` is the inclusive last month of the phase (set by the caller
 *   when the next phase starts; `Infinity` for the last phase).
 */
interface AmortizationPhase {
  startMonth: number;
  endMonth: number;
  monthlyPayment: number;
  /**
   * `termMonths` budget for the phase. The generator only emits rows up to
   * `endMonth`, so the `termMonths` value is informational (used for the
   * "how many months did this phase plan for?" calculation if needed).
   */
  termMonths: number;
  /** The extra that triggered this phase, if any. */
  triggeredBy: string | null;
}

/**
 * Computes the end (inclusive) month of the last row in the schedule.
 *
 * The schedule length is driven by the phase list (whose first phase
 * defaults to `loan.termMonths` and subsequent phases use the user-specified
 * `newTermMonths`). We use `max(maxPhaseEndMonth, paidInstallments)` so
 * the schedule extends when a recalc lengthens the term and so the rows
 * covered by `paidInstallments` always render (even if the natural
 * amortization would have ended earlier).
 */
function computeUpperBound(
  loan: Loan,
  phases: AmortizationPhase[]
): number {
  const paidInstallments = loan.paidInstallments ?? 0;
  let maxFromPhases = 0;
  for (const p of phases) {
    maxFromPhases = Math.max(maxFromPhases, p.endMonth);
  }
  return Math.max(maxFromPhases, paidInstallments);
}

/**
 * Computes the outstanding balance of the loan AT the end of the given
 * month index, after applying all scheduled payments for months 1..monthIndex
 * + all extras up to that month. Used by the engine to derive the new cuota
 * for phase transitions.
 */
function balanceAtEndOfMonth(
  loan: Loan,
  payments: LoanPayment[],
  sortedExtras: LoanExtraPayment[],
  monthIndex: number
): number {
  const principal = parseFloat(loan.principal);
  const annualRate = parseFloat(loan.annualRate);
  const basePayment = parseFloat(loan.monthlyPayment);
  const startDate = new Date(loan.startDate);

  const monthlyRate = resolveMonthlyRate(annualRate, loan.formula);

  let balance = principal;
  const upperBound = Math.min(monthIndex, loan.termMonths);

  for (let m = 1; m <= upperBound; m++) {
    const currentDate = addMonths(startDate, m - 1);
    const interest = balance * monthlyRate;
    let principalPortion = basePayment - interest;
    if (principalPortion >= balance) principalPortion = balance;
    if (principalPortion < 0) principalPortion = 0;
    balance = Math.max(0, balance - principalPortion);

    // Apply extras for this month (recompute at the loan level, NOT
    // respecting phase transitions — we want the historical balance up to
    // the recalc point).
    const extrasThisMonth = sortedExtras.filter((ex) =>
      isSameMonth(new Date(ex.date), currentDate)
    );
    for (const ex of extrasThisMonth) {
      const extraAmt = parseFloat(ex.amount);
      balance = Math.max(0, balance - extraAmt);
    }
  }

  return balance;
}

/**
 * Generates the amortization schedule for a loan, respecting real payments,
 * extra payments, and the `paidInstallments` count synced from the bank
 * statement. Supports **phase transitions** triggered by extras with
 * `recalculationMode === "REDUCE_PAYMENT"`.
 *
 * **Phase semantics**:
 * - Phase 1: months 1..termMonths (or until the first REDUCE_PAYMENT extra),
 *   using `loan.monthlyPayment` as the financial cuota.
 * - Phase N (N>1): starts the month after a REDUCE_PAYMENT extra, using a
 *   new cuota recomputed via French formula over `ex.newTermMonths` against
 *   the post-extra balance. Subsequent extras may trigger more phases.
 * - The schedule length is the maximum of: original term, paidInstallments,
 *   last phase's endMonth, and the rows needed to drain the balance.
 *
 * **Length semantics** (Bug #6 fix, still valid):
 * Rows beyond the natural term (paidInstallments > termMonths) are generated
 * as a final row with status `PAID`. Rows covered by `paidInstallments` but
 * lacking a real `LoanPayment` are flagged with `paidFromExtract: true`.
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
  const baseMonthlyPayment = parseFloat(loan.monthlyPayment);
  const startDate = new Date(loan.startDate);
  const today = new Date();

  const monthlyRate = resolveMonthlyRate(annualRate, formula);

  // Sort extras by date so we can build the phase list in chronological order.
  const sortedExtras = extraPayments
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

  // Build the phase list. Phase 1 is the original. Each REDUCE_PAYMENT extra
  // starts a new phase whose cuota is computed at generation time below.
  const phases: AmortizationPhase[] = [
    {
      startMonth: 1,
      endMonth: termMonths,
      monthlyPayment: baseMonthlyPayment,
      termMonths,
      triggeredBy: null,
    },
  ];

  for (const ex of sortedExtras) {
    if (ex.recalculationMode !== "REDUCE_PAYMENT") continue;
    if (ex.newTermMonths == null) continue;

    const exDate = new Date(ex.date);
    const monthOffset =
      (exDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
      (exDate.getUTCMonth() - startDate.getUTCMonth());
    const extraMonth = monthOffset + 1;
    if (extraMonth < 1) continue;

    // End the previous phase AT the extra's month (the extra applies to
    // the old cuota, then the new cuota starts next month).
    const prev = phases[phases.length - 1];
    if (extraMonth <= prev.endMonth) {
      prev.endMonth = extraMonth;
    } else if (extraMonth > prev.endMonth) {
      // The extra falls after the previous phase's planned end. The phase
      // is naturally truncated; we just start the new one after the extra.
      // (Unlikely but defensive: extra scheduled in the future of a
      // phase that's already exhausted.)
    }

    // Compute the post-extra balance. We replay the loan's history using
    // the ORIGINAL cuota + the sortedExtras up to (and including) this
    // extra, ignoring the phase transition. This gives the saldo
    // pendiente that the new cuota will amortize.
    const postExtraBalance = balanceAtEndOfMonth(
      loan,
      payments,
      sortedExtras.filter((e) => {
        const eDate = new Date(e.date);
        const eMonth =
          (eDate.getUTCFullYear() - startDate.getUTCFullYear()) * 12 +
          (eDate.getUTCMonth() - startDate.getUTCMonth()) + 1;
        return eMonth <= extraMonth;
      }),
      extraMonth
    );

    // Compute the new cuota for the post-extra balance over the user-specified
    // new term.
    const newCuota = calculateFrenchPayment(
      postExtraBalance,
      monthlyRate,
      ex.newTermMonths
    );

    phases.push({
      startMonth: extraMonth + 1,
      endMonth: extraMonth + ex.newTermMonths,
      monthlyPayment: newCuota,
      termMonths: ex.newTermMonths,
      triggeredBy: ex.id,
    });
  }

  // Resolve the upper bound: max of (original term, paidInstallments, last
  // phase's endMonth).
  const upperBound = computeUpperBound(loan, phases);

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  // Helper: which phase does this month belong to?
  function phaseFor(month: number): AmortizationPhase | null {
    for (const p of phases) {
      if (month >= p.startMonth && month <= p.endMonth) return p;
    }
    return null;
  }

  for (let month = 1; month <= upperBound; month++) {
    const currentDate = addMonths(startDate, month - 1);
    const phase = phaseFor(month);
    const currentPhasePayment = phase?.monthlyPayment ?? baseMonthlyPayment;

    const interest = balance * monthlyRate;
    let principalPortion = currentPhasePayment - interest;

    // Final payment adjustment within the phase: cap at remaining balance.
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

    const paidFromExtract = !hasRealPayment && month <= paidInstallments;

    // Determine status with priority:
    // 1. Real payment → PAID (actualPayment set)
    // 2. Within paidInstallments range, no real payment → PAID (extract-synthetic)
    // 3. Balance already exhausted beyond the extract range → PAID_OFF
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
      paymentPhase: phase ? phases.indexOf(phase) + 1 : undefined,
    });
  }

  return schedule;
}

/**
 * Returns the financial cuota (capital + interest, NO fees) for the next
 * unpaid month. This is the cuota that the UI should display as "Cuota
 * mensual" / "Cuota vigente" AFTER any `REDUCE_PAYMENT` extras have
 * triggered a recalc.
 *
 * Falls back to `loan.monthlyPayment` (the bank cuota, which is **never**
 * mutated by recalcs to preserve extract coherence) when no schedule row
 * matches the next month — e.g. when the loan is fully paid off, when no
 * payments/extras are passed, or when `paidInstallments` is past the
 * schedule's upper bound.
 */
export function getCurrentEffectiveLoanPayment(
  loan: Loan,
  payments: LoanPayment[] = [],
  extras: LoanExtraPayment[] = []
): number {
  const schedule = generateAmortizationSchedule(loan, payments, extras);
  if (schedule.length === 0) return parseFloat(loan.monthlyPayment);

  const nextMonth = (loan.paidInstallments ?? 0) + 1;
  const nextRow = schedule.find((r) => r.month === nextMonth);
  return nextRow?.payment ?? parseFloat(loan.monthlyPayment);
}

/**
 * Returns the date of the next unpaid installment. Backward-compatible: when
 * called with a single `loan` argument, uses the historical formula
 * `addMonths(startDate, paidCount + 1)` where `paidCount` is sourced from
 * `loan.payments.length` (preserves pre-recalc behavior for callers that
 * don't have explicit payments + extras handy).
 */
export function getNextPaymentDate(loan: Loan): Date {
  const startDate = new Date(loan.startDate);
  const paidCount = loan.payments?.length ?? 0;
  return addMonths(startDate, paidCount + 1);
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
