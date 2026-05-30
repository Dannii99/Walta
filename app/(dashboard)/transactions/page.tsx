import { auth } from "@/lib/auth";
import { getActiveBudgetWithTransactions } from "@/server/queries/transaction-queries";
import { TransactionsClient } from "@/components/transactions/TransactionsClient";
import { redirect } from "next/navigation";
import type { Category, CategoryType, Transaction } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transacciones | Presupuesto Claro",
  description: "Gestiona tus transacciones y categoras.",
};

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budget = await getActiveBudgetWithTransactions(session.user.id);

  if (!budget) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  // Flatten all transactions with category info
  const allTransactions = budget.categories.flatMap((category) =>
    category.transactions.map((transaction) => ({
      ...transaction,
      category: {
        ...category,
        type: category.type as CategoryType,
      } as Category,
    }))
  );

  // Calculate totals by type
  const totalsByType = budget.categories.reduce(
    (acc, category) => {
      const type = category.type as CategoryType;
      const sum = category.transactions.reduce(
        (s, t) => s + parseFloat(t.amount),
        0
      );
      acc[type] = (acc[type] || 0) + sum;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoriesWithType = budget.categories.map((cat) => ({
    ...cat,
    type: cat.type as CategoryType,
  })) as Category[];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transacciones</h1>
      </div>
      <TransactionsClient
        transactions={allTransactions as (Transaction & { category: Category })[]}
        categories={categoriesWithType}
        totalsByType={totalsByType}
      />
    </div>
  );
}
