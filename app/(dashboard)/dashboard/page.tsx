import { auth } from "@/lib/auth";
import { getActiveBudgetWithTransactions } from "@/server/queries/transaction-queries";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Presupuesto Claro",
  description: "Resumen general de tu presupuesto personal.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budget = await getActiveBudgetWithTransactions(session.user.id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Bienvenido a Presupuesto Claro
      </p>
      {budget && (
        <p className="mt-4 text-sm text-muted-foreground">
          Presupuesto activo: {budget.name} — Ingresos: ${parseFloat(budget.income).toLocaleString("es-CO")}
        </p>
      )}
    </div>
  );
}
