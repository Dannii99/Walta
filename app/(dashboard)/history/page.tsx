import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getMonthlySnapshots } from "@/server/queries/budget-queries";
import { MonthlySnapshotCard } from "@/components/history/MonthlySnapshotCard";
import { HistoryChart } from "@/components/history/HistoryChart";
import { CloseMonthButton } from "@/components/history/CloseMonthButton";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { MonthlySnapshot } from "@/types";

export const metadata: Metadata = {
  title: "Historial Mensual | Walta",
  description: "Revisa el historial mensual de tus presupuestos y cierra meses.",
};

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budgets = await getUserBudgets(session.user.id);
  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Historial Mensual</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  const rawSnapshots = await getMonthlySnapshots(budget.id);

  const snapshots: MonthlySnapshot[] = rawSnapshots.map((s) => ({
    ...s,
    categoryBreakdown: (s.categoryBreakdown ?? {}) as Record<string, string>,
  }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historial Mensual</h1>
        <CloseMonthButton budgetId={budget.id} />
      </div>

      {snapshots.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg space-y-4">
          <p className="text-lg">No hay meses cerrados an</p>
          <p className="text-sm max-w-md mx-auto">
            Cierra el mes actual para guardar un snapshot de tu presupuesto.
            Los snapshots te permiten comparar tu progreso a travs del tiempo.
          </p>
          <CloseMonthButton budgetId={budget.id} />
        </div>
      ) : (
        <>
          <HistoryChart snapshots={snapshots} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshots.map((snapshot) => (
              <MonthlySnapshotCard key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
