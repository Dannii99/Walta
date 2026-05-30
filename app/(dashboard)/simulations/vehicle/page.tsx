import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { VehicleSimulatorForm } from "@/components/simulations/VehicleSimulatorForm";
import { createSimulation } from "@/server/actions/simulation-actions";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulador de Vehculo | Presupuesto Claro",
  description: "Simula la compra de un vehculo y evala si cabe en tu presupuesto.",
};

export default async function VehicleSimulationPage() {
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
        <h1 className="text-2xl font-bold">Simulador de Vehculo</h1>
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

  async function handleSave(data: {
    title: string;
    inputs: { price: number; downPayment: number; term: number; rate: number };
    result: { monthlyPayment: number; verdict: "APPROVED" | "WARNING" | "REJECTED"; availableAfter: number; totalInterest: number; totalCost: number };
  }) {
    "use server";
    await createSimulation(
      userId,
      "VEHICLE",
      data.title,
      data.inputs,
      data.result
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Simulador de Vehculo</h1>
        <p className="text-muted-foreground mt-1">
          Calcula el pago mensual de un prstamo para vehculo y evala si cabe en tu presupuesto.
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

      <VehicleSimulatorForm
        availableMoney={availableMoney}
        userId={userId}
        onSave={handleSave}
      />
    </div>
  );
}
