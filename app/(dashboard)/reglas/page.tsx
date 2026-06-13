import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { ReglasClient } from "@/components/reglas/ReglasClient";
import { redirect } from "next/navigation";
import type { BudgetRule, Category } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reglas | Walta",
  description:
    "Configura las reglas de tu presupuesto y gestiona tus categorías.",
};

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

export default async function ReglasPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budgets = await getUserBudgets(session.user.id);
  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Reglas
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
            No tienes un presupuesto activo. Completa el onboarding primero.
          </p>
        </div>
      </div>
    );
  }

  const categories = budget.categories as unknown as CategoryWithCount[];
  const currentIncome = parseFloat(budget.income);

  return (
    <ReglasClient
      budgetId={budget.id}
      currentIncome={Number.isFinite(currentIncome) ? currentIncome : 0}
      currentRule={budget.rule as unknown as BudgetRule}
      categories={categories}
    />
  );
}
