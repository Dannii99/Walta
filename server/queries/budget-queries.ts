"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserBudgets(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      categories: {
        include: {
          _count: {
            select: { transactions: true },
          },
          transactions: {
            orderBy: { date: "desc" },
            take: 10,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return budgets.map((budget) => ({
    ...budget,
    income: budget.income.toString(),
    categories: budget.categories.map((category) => ({
      ...category,
      transactions: category.transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
      })),
    })),
  }));
}

export async function getBudgetById(budgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    include: {
      categories: {
        include: {
          transactions: {
            orderBy: { date: "desc" },
          },
        },
      },
    },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return {
    ...budget,
    income: budget.income.toString(),
    categories: budget.categories.map((category) => ({
      ...category,
      transactions: category.transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
      })),
    })),
  };
}

export async function getMonthlySnapshots(budgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    select: { userId: true },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const snapshots = await prisma.monthlySnapshot.findMany({
    where: { budgetId },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  return snapshots.map((snapshot) => ({
    ...snapshot,
    income: snapshot.income.toString(),
    totalExpenses: snapshot.totalExpenses.toString(),
    totalSavings: snapshot.totalSavings.toString(),
  }));
}
