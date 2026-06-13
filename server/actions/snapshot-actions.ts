"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const closeMonthSchema = z.object({
  budgetId: z.string().min(1),
});

/**
 * Closes the current month for a budget by creating a MonthlySnapshot.
 *
 * Behavior:
 * - Calculates total expenses from all transactions across all categories.
 * - Calculates total savings as income minus expenses (capped at 0).
 * - Stores a category breakdown with totals per category.
 * - Does NOT delete or reset transactions — they remain for historical reference.
 * - Prevents duplicate snapshots for the same month/year (returns existing if found).
 */
export async function closeMonth(budgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = closeMonthSchema.parse({ budgetId });

  const budget = await prisma.budget.findUnique({
    where: { id: parsed.budgetId },
    include: {
      categories: {
        include: {
          transactions: true,
        },
      },
    },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-based
  const currentYear = now.getFullYear();

  // Check if snapshot already exists for this month
  const existing = await prisma.monthlySnapshot.findUnique({
    where: {
      budgetId_month_year: {
        budgetId: parsed.budgetId,
        month: currentMonth,
        year: currentYear,
      },
    },
  });

  if (existing) {
    return {
      ...existing,
      income: existing.income.toString(),
      totalExpenses: existing.totalExpenses.toString(),
      totalSavings: existing.totalSavings.toString(),
    };
  }

  // Calculate totals
  let totalExpenses = 0;
  const categoryBreakdown: Record<string, number> = {};

  for (const category of budget.categories) {
    const categoryTotal = category.transactions.reduce(
      (sum, t) => sum + parseFloat(t.amount.toString()),
      0
    );
    categoryBreakdown[category.name] = categoryTotal;
    totalExpenses += categoryTotal;
  }

  const income = parseFloat(budget.income.toString());
  const totalSavings = Math.max(0, income - totalExpenses);

  const snapshot = await prisma.monthlySnapshot.create({
    data: {
      budgetId: parsed.budgetId,
      month: currentMonth,
      year: currentYear,
      income: income.toString(),
      totalExpenses: totalExpenses.toString(),
      totalSavings: totalSavings.toString(),
      categoryBreakdown,
    },
  });

  revalidatePath("/history");

  return {
    ...snapshot,
    income: snapshot.income.toString(),
    totalExpenses: snapshot.totalExpenses.toString(),
    totalSavings: snapshot.totalSavings.toString(),
  };
}
