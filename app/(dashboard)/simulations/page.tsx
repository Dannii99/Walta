import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserSimulations, getSimulationStats } from "@/server/queries/simulation-queries";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { SimulationsClient } from "@/components/simulations/SimulationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulaciones | Walta",
  description: "Simula decisiones financieras importantes como vehículos, vivienda o créditos personales.",
};

export default async function SimulationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const simulations = await getUserSimulations(userId);
  const stats = await getSimulationStats(userId);
  const budgets = await getUserBudgets(userId);
  const hasBudget = budgets.length > 0;

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
      <SimulationsClient
        simulations={simulations}
        stats={stats}
        hasBudget={hasBudget}
      />
    </div>
  );
}
