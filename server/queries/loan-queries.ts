import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getEffectiveMonthlyPayment } from "@/lib/loan-fees";
import type { Loan, LoanPayment, LoanExtraPayment, FeeItem } from "@/types";

export interface LoanListItem
  extends Omit<Loan, "principal" | "downPayment" | "annualRate" | "monthlyPayment" | "totalInterest" | "totalCost" | "payments" | "extraPayments"> {
  principal: string;
  downPayment: string;
  annualRate: string;
  monthlyPayment: string;
  totalInterest: string;
  totalCost: string;
  fees: FeeItem[];
  paymentsCount: number;
  extrasCount: number;
}

export interface LoanDetail
  extends Omit<Loan, "principal" | "downPayment" | "annualRate" | "monthlyPayment" | "totalInterest" | "totalCost" | "payments" | "extraPayments"> {
  principal: string;
  downPayment: string;
  annualRate: string;
  monthlyPayment: string;
  totalInterest: string;
  totalCost: string;
  fees: FeeItem[];
  payments: (Omit<LoanPayment, "amount" | "principalPaid" | "interestPaid"> & {
    amount: string;
    principalPaid: string;
    interestPaid: string;
  })[];
  extraPayments: (Omit<LoanExtraPayment, "amount"> & { amount: string })[];
}

export interface LoanStats {
  total: number;
  active: number;
  paidOff: number;
  defaulted: number;
  totalPrincipal: number;
  totalRemaining: number;
  totalMonthlyPayment: number;
  totalPaid: number;
}

export interface ActiveLoanContext {
  id: string;
  title: string;
  type: string;
  monthlyPayment: number;
  remainingBalance: number;
  termMonths: number;
  paidInstallments: number;
  status: string;
}

function serializeLoan(loan: Record<string, unknown>) {
  const rawFees = (loan as unknown as {
    fees?: Array<{
      id: string;
      name: string;
      amount: { toString(): string } | number | string;
      type: string;
    }>;
  }).fees ?? [];
  return {
    ...loan,
    principal: (loan.principal as { toString(): string }).toString(),
    downPayment: (loan.downPayment as { toString(): string }).toString(),
    annualRate: (loan.annualRate as { toString(): string }).toString(),
    monthlyPayment: (loan.monthlyPayment as { toString(): string }).toString(),
    totalInterest: (loan.totalInterest as { toString(): string }).toString(),
    totalCost: (loan.totalCost as { toString(): string }).toString(),
    fees: rawFees.map((f) => ({
      id: f.id,
      name: f.name,
      amount: Number(f.amount),
      type: f.type,
    })) as FeeItem[],
  };
}

export async function getUserLoans(userId: string): Promise<LoanListItem[]> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return [];
  }

  const loans = await prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { payments: true, extraPayments: true },
      },
      fees: { where: { type: "monthly" } },
    },
  });

  return loans.map((loan) => {
    const base = serializeLoan(loan as unknown as Record<string, unknown>);
    return {
      ...base,
      paymentsCount: loan._count.payments,
      extrasCount: loan._count.extraPayments,
    } as unknown as LoanListItem;
  });
}

export async function getLoanById(id: string): Promise<LoanDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { paidDate: "desc" } },
      extraPayments: { orderBy: { date: "desc" } },
      fees: { where: { type: "monthly" } },
    },
  });

  if (!loan || loan.userId !== session.user.id) {
    return null;
  }

  const base = serializeLoan(loan as unknown as Record<string, unknown>);

  return {
    ...base,
    payments: loan.payments.map((p) => ({
      ...p,
      amount: p.amount.toString(),
      principalPaid: p.principalPaid.toString(),
      interestPaid: p.interestPaid.toString(),
    })),
    extraPayments: loan.extraPayments.map((e) => ({
      ...e,
      amount: e.amount.toString(),
    })),
  } as unknown as LoanDetail;
}

export async function getLoanStats(userId: string): Promise<LoanStats> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return {
      total: 0,
      active: 0,
      paidOff: 0,
      defaulted: 0,
      totalPrincipal: 0,
      totalRemaining: 0,
      totalMonthlyPayment: 0,
      totalPaid: 0,
    };
  }

  const loans = await prisma.loan.findMany({
    where: { userId },
    include: {
      fees: { where: { type: "monthly" } },
    },
  });

  let totalPrincipal = 0;
  let totalRemaining = 0;
  let totalMonthlyPayment = 0;
  let totalPaid = 0;
  let active = 0;
  let paidOff = 0;
  let defaulted = 0;

  for (const loan of loans) {
    const principal = Number(loan.principal);

    const paidAgg = await prisma.loanPayment.aggregate({
      where: { loanId: loan.id },
      _sum: { principalPaid: true },
    });
    const paid = Number(paidAgg._sum.principalPaid ?? 0);
    const remaining = Math.max(0, principal - paid);

    totalPrincipal += principal;
    totalRemaining += remaining;
    totalMonthlyPayment += getEffectiveMonthlyPayment(loan);
    totalPaid += paid;
    if (loan.status === "ACTIVE") active++;
    else if (loan.status === "PAID_OFF") paidOff++;
    else if (loan.status === "DEFAULTED") defaulted++;
  }

  return {
    total: loans.length,
    active,
    paidOff,
    defaulted,
    totalPrincipal,
    totalRemaining,
    totalMonthlyPayment,
    totalPaid,
  };
}

export interface ActiveLoanCapacity {
  count: number;
  totalMonthly: number;
}

export async function getActiveLoanCapacity(
  userId: string
): Promise<ActiveLoanCapacity> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return { count: 0, totalMonthly: 0 };
  }

  const loans = await prisma.loan.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      fees: { where: { type: "monthly" } },
    },
  });

  return {
    count: loans.length,
    totalMonthly: loans.reduce(
      (sum, loan) => sum + getEffectiveMonthlyPayment(loan),
      0
    ),
  };
}

export async function getActiveLoansForAI(userId: string): Promise<ActiveLoanContext[]> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return [];
  }

  const loans = await prisma.loan.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      _count: { select: { payments: true } },
      fees: { where: { type: "monthly" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return loans.map((loan) => {
    const principal = Number(loan.principal);
    const paidCount = loan._count.payments;
    const monthlyPayment = getEffectiveMonthlyPayment(loan);
    const estimatedPaid = paidCount * monthlyPayment;
    const remainingBalance = Math.max(0, principal - estimatedPaid);
    return {
      id: loan.id,
      title: loan.title,
      type: loan.type,
      monthlyPayment,
      remainingBalance,
      termMonths: loan.termMonths,
      paidInstallments: paidCount,
      status: loan.status,
    };
  });
}
