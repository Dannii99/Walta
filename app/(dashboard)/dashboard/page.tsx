import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Transaction, Category, CategoryType } from "@/types";
import { getMonthlyEquivalent } from "@/lib/recurrence";

const CATEGORY_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budget = await prisma.budget.findFirst({
    where: { userId: session.user.id },
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

  if (!budget) {
    redirect("/onboarding");
  }

  const income = budget.income.toNumber();

  const allTransactions: (Transaction & { category?: Category })[] = [];
  budget.categories.forEach((cat) => {
    cat.transactions.forEach((tx) => {
      allTransactions.push({
        ...tx,
        amount: tx.amount.toString(),
        category: {
          ...cat,
          type: cat.type.toUpperCase() as CategoryType,
          transactions: [],
        },
      });
    });
  });

  const rule = budget.rule as { needs: number; wants: number; savings: number } | null;
  const needsPct = rule?.needs ?? 50;
  const wantsPct = rule?.wants ?? 30;
  const savingsPct = rule?.savings ?? 20;

  const needsLimit = income * (needsPct / 100);
  const wantsLimit = income * (wantsPct / 100);
  const savingsLimit = income * (savingsPct / 100);

  let needsSpent = 0;
  let wantsSpent = 0;
  let savingsSpent = 0;
  let totalExpenses = 0;
  let monthlyEquivalentExpenses = 0;

  const donutMap = new Map<string, number>();

  budget.categories.forEach((cat) => {
    const catSpent = cat.transactions.reduce(
      (sum, tx) => sum + tx.amount.toNumber(),
      0
    );
    totalExpenses += catSpent;

    const catEquivalent = cat.transactions.reduce(
      (sum, tx) =>
        sum + getMonthlyEquivalent(tx.amount.toNumber(), tx.recurrence),
      0
    );
    monthlyEquivalentExpenses += catEquivalent;

    const catType = cat.type.toUpperCase();
    if (catType === "NEEDS") {
      needsSpent += catEquivalent;
    } else if (catType === "WANTS") {
      wantsSpent += catEquivalent;
    } else if (catType === "SAVINGS" || catType === "DEBT") {
      savingsSpent += catEquivalent;
    }

    if (catEquivalent > 0) {
      donutMap.set(cat.name, catEquivalent);
    }
  });

  const donutData = Array.from(donutMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const available = income - monthlyEquivalentExpenses;

  const categoriesBreakdown = budget.categories
    .map((cat, i) => {
      const catEquivalent = cat.transactions.reduce(
        (sum, tx) =>
          sum + getMonthlyEquivalent(tx.amount.toNumber(), tx.recurrence),
        0
      );
      const type = cat.type.toUpperCase() as CategoryType;
      const pct = (() => {
        if (type === "NEEDS") return needsPct;
        if (type === "WANTS") return wantsPct;
        if (type === "SAVINGS") return savingsPct;
        return 0;
      })();
      const limit = income * (pct / 100);
      return {
        id: cat.id,
        name: cat.name,
        type,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        spent: catEquivalent,
        limit,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const categories: Category[] = budget.categories.map((cat) => ({
    ...cat,
    type: cat.type.toUpperCase() as CategoryType,
    transactions: [],
  }));

  return (
    <DashboardContent
      budgetName={budget.name}
      income={income}
      expenses={totalExpenses}
      monthlyEquivalentExpenses={monthlyEquivalentExpenses}
      available={available}
      needsSpent={needsSpent}
      needsLimit={needsLimit}
      wantsSpent={wantsSpent}
      wantsLimit={wantsLimit}
      savingsSpent={savingsSpent}
      savingsLimit={savingsLimit}
      donutData={donutData}
      categoriesBreakdown={categoriesBreakdown}
      categories={categories}
    />
  );
}
