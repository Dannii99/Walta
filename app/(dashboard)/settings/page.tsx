import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { RuleEditor } from "@/components/settings/RuleEditor";
import { CategoryManager } from "@/components/settings/CategoryManager";
import { redirect } from "next/navigation";
import type { BudgetRule, Category } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Walta",
  description: "Configura las reglas de tu presupuesto y preferencias.",
};

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budgets = await getUserBudgets(session.user.id);
  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  const categories = budget.categories as unknown as CategoryWithCount[];

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Configuración</h1>
      <RuleEditor
        budgetId={budget.id}
        currentRule={budget.rule as unknown as BudgetRule}
        income={budget.income}
      />
      <CategoryManager budgetId={budget.id} categories={categories} />
    </div>
  );
}
