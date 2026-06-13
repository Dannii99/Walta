import { auth } from "@/lib/auth";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getTimelineEvents } from "@/server/queries/timeline-queries";
import { Timeline } from "@/components/history/Timeline";
import { History } from "lucide-react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { TimelineEvent } from "@/lib/timeline-types";

export const metadata: Metadata = {
  title: "Historial | Walta",
  description:
    "Tu l\u00ednea de tiempo financiera: decisiones, simulaciones, cr\u00e9ditos y pagos en orden cronol\u00f3gico.",
};

interface HistoryPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [budgets, timelinePage] = await Promise.all([
    getUserBudgets(userId),
    getTimelineEvents(userId, { limit: 30 }),
  ]);

  const hasBudget = budgets.length > 0;

  const serializedEvents = timelinePage.events.map((e: TimelineEvent) => ({
    ...e,
    occurredAt: e.occurredAt.toISOString(),
  }));

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#737373] dark:text-[#a1a1aa]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#17181c] dark:text-white">
            Línea de tiempo
          </h1>
        </div>
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa] max-w-2xl">
          Decisiones, simulaciones, créditos y pagos en orden cronológico.
          La historia de tu dinero en Walta.
        </p>
      </div>

      <Timeline
        initialEvents={serializedEvents}
        initialCursor={timelinePage.nextCursor}
        initialHasMore={timelinePage.hasMore}
        initialTotal={timelinePage.total}
        hasBudget={hasBudget}
      />
    </div>
  );
}
