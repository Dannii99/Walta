"use client";

import {
  TIMELINE_EVENT_LABELS_PLURAL,
  TIMELINE_EVENT_TYPES,
  type TimelineEventType,
} from "@/lib/timeline-types";
import { EVENT_VISUAL } from "@/components/history/EventIcon";
import { cn } from "@/lib/utils";

interface TimelineFiltersProps {
  selected: Set<TimelineEventType>;
  onChange: (next: Set<TimelineEventType>) => void;
  total: number;
  filtered: number;
}

export function TimelineFilters({
  selected,
  onChange,
  total,
  filtered,
}: TimelineFiltersProps) {
  const isAll = selected.size === TIMELINE_EVENT_TYPES.length;

  const toggle = (type: TimelineEventType) => {
    const next = new Set(selected);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    if (next.size === TIMELINE_EVENT_TYPES.length) {
      onChange(new Set(TIMELINE_EVENT_TYPES));
    } else {
      onChange(next);
    }
  };

  const selectAll = () => onChange(new Set(TIMELINE_EVENT_TYPES));
  const clear = () => onChange(new Set());

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 md:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
          Tipos
        </span>
        <button
          type="button"
          onClick={isAll ? clear : selectAll}
          data-active={isAll}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            isAll
              ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
              : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
          )}
        >
          {isAll ? "Todos" : "Seleccionar todos"}
        </button>
        {!isAll && (
          <button
            type="button"
            onClick={clear}
            data-active={selected.size === 0}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
              selected.size === 0
                ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
            )}
          >
            Ninguno
          </button>
        )}
        {TIMELINE_EVENT_TYPES.map((t) => {
          const active = selected.has(t);
          const visual = EVENT_VISUAL[t];
          const Icon = visual.icon;
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              data-active={active}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                active
                  ? cn(
                      "border-transparent text-stone-900 dark:text-stone-50",
                      visual.iconBgClass
                    )
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
              )}
            >
              <Icon className="h-3 w-3" strokeWidth={2.4} />
              {TIMELINE_EVENT_LABELS_PLURAL[t]}
            </button>
          );
        })}
      </div>

      {!isAll && (
        <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
          Mostrando {filtered} de {total} eventos
        </p>
      )}
    </div>
  );
}
