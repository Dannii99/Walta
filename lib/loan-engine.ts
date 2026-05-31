import type { Loan, LoanPayment, LoanExtraPayment, AmortizationRow } from "@/types";

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

  for (let month = 1; month <= termMonths * 2; month++) {
    if (balance <= 0.01) break;

    const currentDate = addMonths(startDate, month - 1);
    const interest = balance * monthlyRate;
    let principalPortion = monthlyPayment - interest;

    // Final payment adjustment
    if (principalPortion >= balance) {
      principalPortion = balance;
    }

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

    const actual = payments.find((p) => isSameMonth(new Date(p.paidDate), currentDate));

    let status: AmortizationRow["status"];
    if (actual) {
      status = "PAID";
    } else if (currentDate < today) {
      status = loan.status === "DEFAULTED" ? "DEFAULTED" : "PENDING";
    } else {
      status = "UPCOMING";
    }

    schedule.push({
      month,
      date: currentDate,
      payment: principalPortion + interest,
      interest,
      principal: principalPortion,
      extraPayment: extraTotal,
      balance,
      status,
      actualPayment: actual ?? null,
    });

    if (balance <= 0.01) break;
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
  return loan.payments?.length ?? 0;
}

export function getDaysOverdue(date: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function getPaymentStatusCounts(
  schedule: AmortizationRow[]
): { paid: number; pending: number; defaulted: number; upcoming: number } {
  return schedule.reduce(
    (acc, row) => {
      if (row.status === "PAID") acc.paid++;
      else if (row.status === "PENDING") acc.pending++;
      else if (row.status === "DEFAULTED") acc.defaulted++;
      else if (row.status === "UPCOMING") acc.upcoming++;
      return acc;
    },
    { paid: 0, pending: 0, defaulted: 0, upcoming: 0 }
  );
}
