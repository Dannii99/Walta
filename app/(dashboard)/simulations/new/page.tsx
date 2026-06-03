import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calculator } from "lucide-react";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getMonthlyEquivalent } from "@/lib/recurrence";
import { SimulatorForm } from "@/components/simulations/SimulatorForm";
import { AvailableMoneyCard } from "@/components/simulations/AvailableMoneyCard";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Simulación | Walta",
  description: "Simula la compra de un vehículo, vivienda o crédito personal y evalúa si cabe en tu presupuesto.",
};

export default async function NewSimulationPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const budgets = await getUserBudgets(userId);
  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/simulations">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Simulaciones
          </Link>
        </Button>
        <div className="rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-6 max-w-2xl">
          <h1 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-2">
            Necesitas un presupuesto activo
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Crea primero tu presupuesto con ingresos y categorías para poder
            simular créditos y compras.
          </p>
          <Button asChild className="mt-4">
            <Link href="/onboarding">Crear presupuesto</Link>
          </Button>
        </div>
      </div>
    );
  }

  const income = parseFloat(budget.income);

  const totalMonthlyExpenses = budget.categories.reduce((sum, cat) => {
    return (
      sum +
      cat.transactions.reduce(
        (s, t) => s + getMonthlyEquivalent(parseFloat(t.amount), t.recurrence),
        0
      )
    );
  }, 0);

  const availableMoney = Math.max(0, income - totalMonthlyExpenses);

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/simulations">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Simulaciones
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 shrink-0">
            <Calculator className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Nueva
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
              Simulación
            </h1>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-medium max-w-2xl">
          Calcula el pago mensual de un préstamo y evalúa si cabe en tu
          presupuesto antes de comprometerte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SimulatorForm availableMoney={availableMoney} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AvailableMoneyCard
            income={income}
            totalMonthlyExpenses={totalMonthlyExpenses}
            availableMoney={availableMoney}
          />
        </div>
      </div>
    </div>
  );
}
