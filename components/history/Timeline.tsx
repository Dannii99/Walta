"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineEvent } from "@/components/history/TimelineEvent";
import { TimelineFilters } from "@/components/history/TimelineFilters";
import { TimelineFilterSheet } from "@/components/history/TimelineFilterSheet";
import { TimelineEmpty } from "@/components/history/TimelineEmpty";
import { TIMELINE_EVENT_TYPES, type TimelineEventType } from "@/lib/timeline-types";
import type { TimelineEvent as TimelineEventModel, TimelineCursor } from "@/types";
import { loadMoreTimelineAction } from "@/server/actions/timeline-actions";

interface TimelineProps {
  initialEvents: SerializedTimelineEvent[];
  initialCursor: TimelineCursor | null;
  initialHasMore: boolean;
  initialTotal: number;
  hasBudget: boolean;
}

type SerializedTimelineEvent = Omit<TimelineEventModel, "occurredAt"> & {
  occurredAt: string;
};

const monthHeaderFormatter = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

function monthKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const raw = monthHeaderFormatter.format(date);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function rehydrate(event: SerializedTimelineEvent): TimelineEventModel {
  return {
    ...event,
    occurredAt: new Date(event.occurredAt),
  } as TimelineEventModel;
}

export function Timeline({
  initialEvents,
  initialCursor,
  initialHasMore,
  initialTotal,
  hasBudget,
}: TimelineProps) {
  const [events, setEvents] = useState<SerializedTimelineEvent[]>(initialEvents);
  const [cursor, setCursor] = useState<TimelineCursor | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [selected, setSelected] = useState<Set<TimelineEventType>>(
    () => new Set(TIMELINE_EVENT_TYPES)
  );
  const [isPending, startTransition] = useTransition();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    if (selected.size === TIMELINE_EVENT_TYPES.length) return events;
    return events.filter((e) => selected.has(e.type));
  }, [events, selected]);

  const grouped = useMemo(() => {
    const map = new Map<string, SerializedTimelineEvent[]>();
    for (const e of filteredEvents) {
      const key = monthKey(e.occurredAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredEvents]);

  const handleLoadMore = useCallback(() => {
    if (!cursor || isPending) return;
    setLoadError(null);
    startTransition(async () => {
      try {
        const result = await loadMoreTimelineAction({
          cursor: cursor as unknown as { occurredAt: string; id: string },
          types: Array.from(selected),
        });
        setEvents((prev) => [...prev, ...(result.events as SerializedTimelineEvent[])]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
        setTotal(result.total);
      } catch (err) {
        console.error("Failed to load more events", err);
        setLoadError("No se pudieron cargar más eventos.");
      }
    });
  }, [cursor, selected, isPending]);

  const handleFilterChange = useCallback(
    (next: Set<TimelineEventType>) => {
      setSelected(next);
      setLoadError(null);
      startTransition(async () => {
        try {
          const result = await loadMoreTimelineAction({
            cursor: null,
            types: Array.from(next),
          });
          setEvents(result.events as SerializedTimelineEvent[]);
          setCursor(result.nextCursor);
          setHasMore(result.hasMore);
          setTotal(result.total);
        } catch (err) {
          console.error("Failed to apply filter", err);
          setLoadError("No se pudo aplicar el filtro.");
        }
      });
    },
    []
  );

  if (initialTotal === 0 && events.length === 0) {
    return (
      <div className="space-y-4">
        <TimelineEmpty hasBudget={hasBudget} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <TimelineFilters
        selected={selected}
        onChange={handleFilterChange}
        total={total}
        filtered={filteredEvents.length}
        onOpenFilterSheet={() => setSheetOpen(true)}
      />

      <TimelineFilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selected={selected}
        onChange={handleFilterChange}
      />

      {grouped.length === 0 ? (
        <div className="text-center py-10 text-sm text-[#737373] dark:text-[#a1a1aa]">
          Ningún evento coincide con los filtros seleccionados.
        </div>
      ) : (
        <div className="space-y-7">
          {grouped.map(([key, monthEvents]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] pl-1">
                {monthLabel(monthEvents[0].occurredAt)}
              </h3>
              <ul className="space-y-0 list-none">
                <AnimatePresence initial={false}>
                  {monthEvents.map((rawEvent, idx) => {
                    const event = rehydrate(rawEvent);
                    const isLastInMonth = idx === monthEvents.length - 1;
                    return (
                      <TimelineEvent
                        key={event.id}
                        event={event}
                        isLast={isLastInMonth}
                      />
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isPending}
            className="border-[#e8e8e8] dark:border-[#2a2a2e] text-[#17181c] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e]"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              "Cargar más"
            )}
          </Button>
        </div>
      )}

      {loadError && (
        <p className="text-center text-xs text-[#e54d4d] dark:text-[#e54d4d]">
          {loadError}
        </p>
      )}

      {!hasMore && filteredEvents.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-[#737373] dark:text-[#a1a1aa] pt-2"
        >
          Has llegado al final de tu línea de tiempo.
        </motion.p>
      )}
    </div>
  );
}
