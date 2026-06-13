"use client";

import {
  TIMELINE_EVENT_LABELS_PLURAL,
  TIMELINE_EVENT_TYPES,
  type TimelineEventType,
} from "@/lib/timeline-types";
import { EVENT_VISUAL } from "@/components/history/EventIcon";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, Check, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineFiltersProps {
  selected: Set<TimelineEventType>;
  onChange: (next: Set<TimelineEventType>) => void;
  total: number;
  filtered: number;
  onOpenFilterSheet?: () => void;
}

export function TimelineFilters({
  selected,
  onChange,
  total,
  filtered,
  onOpenFilterSheet,
}: TimelineFiltersProps) {
  const isAll = selected.size === TIMELINE_EVENT_TYPES.length;
  const hasFilters = !isAll;
  const activeCount = selected.size;

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
    <div className="bg-white dark:bg-[#17181c] rounded-2xl p-3 md:p-4 space-y-3">
      {/* Mobile: filter button */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="relative border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#737373] dark:text-[#a1a1aa]"
            onClick={onOpenFilterSheet}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1.5" />
            Filtrar
            {hasFilters && (
              <span className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-[#26be15] text-white text-[9px] font-bold flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </Button>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white h-8 px-2"
            >
              <FilterX className="h-3.5 w-3.5 mr-1.5" />
              Limpiar
            </Button>
          )}
        </div>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
          <span className="font-bold text-[#17181c] dark:text-white">{filtered}</span>{" "}
          de{" "}
          <span className="font-bold text-[#17181c] dark:text-white">{total}</span>
        </p>
      </div>

      {/* Desktop: inline filter chips */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mr-1">
          Tipos
        </span>
        <button
          type="button"
          onClick={isAll ? clear : selectAll}
          data-active={isAll}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            isAll
              ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
              : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
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
                ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
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
                      "border-transparent text-[#17181c] dark:text-white",
                      visual.iconBgClass
                    )
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              )}
            >
              <Icon className="h-3 w-3" strokeWidth={2.4} />
              {TIMELINE_EVENT_LABELS_PLURAL[t]}
              {active && (
                <Check className="h-3 w-3 text-[#26be15]" />
              )}
            </button>
          );
        })}

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#737373] dark:text-[#a1a1aa]">
            <span className="font-bold text-[#17181c] dark:text-white">{filtered}</span>{" "}
            de{" "}
            <span className="font-bold text-[#17181c] dark:text-white">{total}</span>
          </span>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white h-8 px-2"
            >
              <FilterX className="h-3.5 w-3.5 mr-1.5" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {!isAll && (
        <p className="hidden md:block text-xs text-[#737373] dark:text-[#a1a1aa] tabular-nums">
          Mostrando {filtered} de {total} eventos
        </p>
      )}
    </div>
  );
}
