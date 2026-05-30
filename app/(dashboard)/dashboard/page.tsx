import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { Transaction, Category, CategoryType } from "@/types";

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

  // Collect all transactions sorted by date desc
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
  allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate spending by category type
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

  const donutMap = new Map<string, number>();

  budget.categories.forEach((cat) => {
    const catSpent = cat.transactions.reduce(
      (sum, tx) => sum + tx.amount.toNumber(),
      0
    );
    totalExpenses += catSpent;

    if (cat.type === "needs") needsSpent += catSpent;
    else if (cat.type === "wants") wantsSpent += catSpent;
    else if (cat.type === "savings") savingsSpent += catSpent;

    if (catSpent > 0) {
      donutMap.set(cat.name, catSpent);
    }
  });

  const donutData = Array.from(donutMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const available = income - totalExpenses;
  const recentTransactions = allTransactions.slice(0, 5);

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
      available={available}
      needsSpent={needsSpent}
      needsLimit={needsLimit}
      wantsSpent={wantsSpent}
      wantsLimit={wantsLimit}
      savingsSpent={savingsSpent}
      savingsLimit={savingsLimit}
      donutData={donutData}
      recentTransactions={recentTransactions}
      categories={categories}
    />
  );
}
