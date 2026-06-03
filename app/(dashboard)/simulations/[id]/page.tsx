import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getSimulationById } from "@/server/queries/simulation-queries";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getMonthlyEquivalent } from "@/lib/recurrence";
import { SimulationDetailClient } from "@/components/simulations/SimulationDetailClient";
import {
  parseSimulationInputs,
  parseSimulationResult,
} from "@/lib/simulation-types";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Simulación | Walta" };

  const sim = await getSimulationById(id);
  return {
    title: sim ? `${sim.title} | Walta` : "Simulación | Walta",
    description: "Detalle y análisis inteligente de tu simulación financiera.",
  };
}

export default async function SimulationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const simulation = await getSimulationById(id);
  if (!simulation) {
    notFound();
  }

  const inputs = parseSimulationInputs(simulation.inputs);
  const result = parseSimulationResult(simulation.result);

  const budgets = await getUserBudgets(session.user.id);
  const budget = budgets[0] ?? null;
  const income = budget ? parseFloat(budget.income) : 0;
  const totalMonthly = budget
    ? budget.categories.reduce((sum, cat) => {
        return sum +
          cat.transactions.reduce(
            (s, t) => s + getMonthlyEquivalent(parseFloat(t.amount), t.recurrence),
            0
          );
      }, 0)
    : 0;
  const availableMoney = Math.max(0, income - totalMonthly);

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
      <SimulationDetailClient
        simulation={{
          id: simulation.id,
          type: simulation.type,
          title: simulation.title,
          createdAt: simulation.createdAt.toISOString(),
        }}
        inputs={inputs}
        result={result}
        availableMoney={availableMoney}
      />
    </div>
  );
}
