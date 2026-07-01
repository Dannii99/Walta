"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getActiveBudgetWithTransactions(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const budget = await prisma.budget.findFirst({
    where: { userId },
    include: {
      categories: {
        include: {
          transactions: {
            orderBy: { date: "desc" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!budget) return null;

return {
    ...budget,
    income: budget.income.toString(),
    categories: budget.categories.map((category) => ({
      ...category,
      plannedAmount: category.plannedAmount ? category.plannedAmount.toString() : null,
      transactions: category.transactions.map((transaction) => ({
        ...transaction,
        amount: transaction.amount.toString(),
      })),
    })),
  };
}
