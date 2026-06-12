import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getMonthlySnapshots } from "@/server/queries/budget-queries";
import { getTimelineEvents } from "@/server/queries/timeline-queries";
import { HistoryTabs } from "@/components/history/Tabs";
import { Timeline } from "@/components/history/Timeline";
import { SnapshotsLegacy } from "@/components/history/SnapshotsLegacy";
import { History, ScrollText } from "lucide-react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { MonthlySnapshot } from "@/types";
import type { TimelineEvent } from "@/lib/timeline-types";

export const metadata: Metadata = {
  title: "Historial | Walta",
  description:
    "Tu línea de tiempo financiera: decisiones, simulaciones, créditos y pagos en orden cronológico.",
};

const VALID_TABS = new Set(["timeline", "snapshots"]);

type TabId = "timeline" | "snapshots";

interface HistoryPageProps {
  searchParams: Promise<{ tab?: string }>;
}

function parseTab(raw: string | undefined): TabId {
  if (raw && VALID_TABS.has(raw)) {
    return raw as TabId;
  }
  return "timeline";
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const { tab } = await searchParams;
  const activeTab = parseTab(tab);

  const [budgets, timelinePage] = await Promise.all([
    getUserBudgets(userId),
    getTimelineEvents(userId, { limit: 30 }),
  ]);

  const budget = budgets[0] ?? null;
  const hasBudget = budgets.length > 0;

  const serializedEvents = timelinePage.events.map((e: TimelineEvent) => ({
    ...e,
    occurredAt: e.occurredAt.toISOString(),
  }));

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {activeTab === "timeline" ? (
              <History className="h-5 w-5 text-stone-500 dark:text-stone-400" />
            ) : (
              <ScrollText className="h-5 w-5 text-stone-500 dark:text-stone-400" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-50">
              {activeTab === "timeline" ? "Línea de tiempo" : "Snapshots manuales"}
            </h1>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
            {activeTab === "timeline"
              ? "Decisiones, simulaciones, créditos y pagos en orden cronológico. La historia de tu dinero en Walta."
              : "Cierres contables antiguos. Los nuevos eventos se registran en la pestaña anterior."}
          </p>
        </div>
        <HistoryTabs active={activeTab} />
      </div>

      {activeTab === "timeline" ? (
        <Timeline
          initialEvents={serializedEvents}
          initialCursor={timelinePage.nextCursor}
          initialHasMore={timelinePage.hasMore}
          initialTotal={timelinePage.total}
          hasBudget={hasBudget}
        />
      ) : budget ? (
        <SnapshotsTab budgetId={budget.id} />
      ) : (
        <div className="text-center py-12 text-stone-500 dark:text-stone-400 text-sm">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </div>
      )}
    </div>
  );
}

async function SnapshotsTab({ budgetId }: { budgetId: string }) {
  const rawSnapshots = await getMonthlySnapshots(budgetId);
  const snapshots: MonthlySnapshot[] = rawSnapshots.map((s) => ({
    ...s,
    categoryBreakdown: (s.categoryBreakdown ?? {}) as Record<string, string>,
  }));
  return <SnapshotsLegacy snapshots={snapshots} />;
}
