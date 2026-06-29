import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { DashboardEmptyClient } from "@/components/dashboard/DashboardEmptyClient";
import type { Transaction, Category, CategoryType } from "@/types";
import {
  computeHealthStatus,
  formatMonthName,
  formatRuleName,
} from "@/lib/dashboard-helpers";

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

function deriveUserName(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim().length > 0) return name.split(" ")[0];
  if (email && email.includes("@")) return email.split("@")[0];
  return "amigo";
}

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
        recurrence: (tx.recurrence ?? "MONTHLY") as Transaction["recurrence"],
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

  let needsSpent = 0;
  let wantsSpent = 0;
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
      (sum, tx) => sum + tx.amount.toNumber(),
      0
    );
    monthlyEquivalentExpenses += catEquivalent;

    const catType = cat.type.toUpperCase();
    if (catType === "NEEDS") {
      needsSpent += catEquivalent;
    } else if (catType === "WANTS") {
      wantsSpent += catEquivalent;
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
  const savingsCapacity = Math.max(available, 0);
  const savingsRate =
    income > 0
      ? Math.max(((income - monthlyEquivalentExpenses) / income) * 100, -100)
      : 0;

  const isEmpty = income <= 0 && allTransactions.length === 0;
  const healthStatus = computeHealthStatus(income, monthlyEquivalentExpenses, available);
  const expensesPct =
    income > 0 ? ((monthlyEquivalentExpenses / income) * 100).toFixed(0) : "0";

  const monthLabel = formatMonthName();
  const ruleName = formatRuleName(rule);

  const categoriesBreakdown = budget.categories
    .map((cat, i) => {
      const catEquivalent = cat.transactions.reduce(
        (sum, tx) => sum + tx.amount.toNumber(),
        0
      );
      const type = cat.type.toUpperCase() as CategoryType;
      const typePct =
        type === "NEEDS"
          ? needsPct
          : type === "WANTS"
          ? wantsPct
          : type === "SAVINGS"
          ? savingsPct
          : 0;
      const limit = income * (typePct / 100);
      return {
        id: cat.id,
        name: cat.name,
        type,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        spent: catEquivalent,
        limit,
        icon: cat.icon,
      };
    })
    .sort((a, b) => b.spent - a.spent);

  const categories: Category[] = budget.categories.map((cat) => ({
    ...cat,
    type: cat.type.toUpperCase() as CategoryType,
    transactions: [],
  }));

  if (isEmpty) {
    return (
      <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
        <DashboardEmptyClient categories={categories} />
      </div>
    );
  }

  const userName = deriveUserName(session.user.name, session.user.email);

  return (
    <DashboardContent
      userName={userName}
      budgetName={budget.name}
      monthLabel={monthLabel}
      ruleName={ruleName}
      income={income}
      expenses={totalExpenses}
      monthlyEquivalentExpenses={monthlyEquivalentExpenses}
      available={available}
      savingsCapacity={savingsCapacity}
      savingsRate={savingsRate}
      healthStatus={healthStatus}
      expensesPct={expensesPct}
      needsPct={needsPct}
      wantsPct={wantsPct}
      savingsPct={savingsPct}
      needsSpent={needsSpent}
      needsLimit={needsLimit}
      wantsSpent={wantsSpent}
      wantsLimit={wantsLimit}
      donutData={donutData}
      categoriesBreakdown={categoriesBreakdown}
      categories={categories}
    />
  );
}
