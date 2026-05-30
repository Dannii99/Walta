import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { RuleEditor } from "@/components/settings/RuleEditor";
import { redirect } from "next/navigation";
import type { BudgetRule } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuracin | Presupuesto Claro",
  description: "Configura las reglas de tu presupuesto y preferencias.",
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
        <h1 className="text-2xl font-bold">Configuracin</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Configuracin</h1>
      <RuleEditor
        budgetId={budget.id}
        currentRule={budget.rule as unknown as BudgetRule}
        income={budget.income}
      />
    </div>
  );
}
