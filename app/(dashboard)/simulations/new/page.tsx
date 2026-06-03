import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { SimulatorForm } from "@/components/simulations/SimulatorForm";
import { redirect } from "next/navigation";
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
      <div className="p-8">
        <h1 className="text-2xl font-bold">Nueva Simulación</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  const income = parseFloat(budget.income);
  const totalExpenses = budget.categories.reduce(
    (sum, cat) =>
      sum + cat.transactions.reduce((s, t) => s + parseFloat(t.amount), 0),
    0
  );
  const availableMoney = Math.max(0, income - totalExpenses);

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Nueva Simulación</h1>
        <p className="text-muted-foreground mt-1">
          Calcula el pago mensual de un préstamo y evalúa si cabe en tu presupuesto.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-card text-sm">
        <p className="text-muted-foreground">
          Tu dinero disponible mensual estimado:{" "}
          <span className="font-semibold text-foreground">
            ${availableMoney.toLocaleString("es-CO")} COP
          </span>
        </p>
      </div>

      <SimulatorForm availableMoney={availableMoney} />
    </div>
  );
}
