"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserLoans(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const loans = await prisma.loan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { payments: true, extraPayments: true },
      },
    },
  });

  return loans.map((loan) => ({
    ...loan,
    principal: loan.principal.toString(),
    downPayment: loan.downPayment.toString(),
    annualRate: loan.annualRate.toString(),
    monthlyPayment: loan.monthlyPayment.toString(),
    totalInterest: loan.totalInterest.toString(),
    totalCost: loan.totalCost.toString(),
    fees: (loan as unknown as { fees?: unknown }).fees as import("@/types").FeeItem[] | undefined,
    paymentsCount: loan._count.payments,
    extrasCount: loan._count.extraPayments,
  }));
}

export async function getLoanById(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { paidDate: "desc" } },
      extraPayments: { orderBy: { date: "desc" } },
    },
  });

  if (!loan || loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return {
    ...loan,
    principal: loan.principal.toString(),
    downPayment: loan.downPayment.toString(),
    annualRate: loan.annualRate.toString(),
    monthlyPayment: loan.monthlyPayment.toString(),
    totalInterest: loan.totalInterest.toString(),
    totalCost: loan.totalCost.toString(),
    fees: (loan as unknown as { fees?: unknown }).fees as import("@/types").FeeItem[] | undefined,
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
  };
}
