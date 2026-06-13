"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Check, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TIMELINE_EVENT_LABELS_PLURAL,
  TIMELINE_EVENT_TYPES,
  type TimelineEventType,
} from "@/lib/timeline-types";
import { EVENT_VISUAL } from "@/components/history/EventIcon";
import { cn } from "@/lib/utils";

interface TimelineFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Set<TimelineEventType>;
  onChange: (next: Set<TimelineEventType>) => void;
}

export function TimelineFilterSheet({
  open,
  onOpenChange,
  selected,
  onChange,
}: TimelineFilterSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden mb-0!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => onOpenChange(false)}
          />

          {/* Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#17181c] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxHeight: "92dvh", minHeight: "50dvh" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#737373]" />
                <span className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Filtros
                </span>
                {hasFilters && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#26be15] text-white text-[10px] font-bold">
                    {activeCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-5 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {/* Quick actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isAll ? clear : selectAll}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
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
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                      selected.size === 0
                        ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                        : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
                    )}
                  >
                    Ninguno
                  </button>
                )}
              </div>

              {/* Event types */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  Tipos de eventos
                </p>
                <div className="space-y-1">
                  {TIMELINE_EVENT_TYPES.map((t) => {
                    const active = selected.has(t);
                    const visual = EVENT_VISUAL[t];
                    const Icon = visual.icon;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggle(t)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors",
                          active
                            ? cn(
                                "bg-[#f5f5f5] dark:bg-[#2a2a2e] text-[#17181c] dark:text-white",
                                visual.iconBgClass
                              )
                            : "bg-[#fafafa] text-[#737373] dark:bg-[#1a1a1e] dark:text-[#a1a1aa]"
                        )}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                            active
                              ? cn(visual.iconBgClass, visual.iconFgClass)
                              : "bg-[#e8e8e8] dark:bg-[#2a2a2e] text-[#737373] dark:text-[#a1a1aa]"
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2} />
                        </div>
                        <span className="flex-1 text-left">
                          {TIMELINE_EVENT_LABELS_PLURAL[t]}
                        </span>
                        {active && (
                          <Check className="h-4 w-4 text-[#26be15] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isAll && (
                <Button
                  variant="outline"
                  onClick={clear}
                  className="w-full border-[#e8e8e8] text-[#737373] hover:text-[#17181c] dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:text-white"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 p-4 border-t border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
              <Button
                className="w-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
                onClick={() => onOpenChange(false)}
              >
                Listo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
