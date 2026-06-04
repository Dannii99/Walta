"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { History, type LucideIcon, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HistoryTab {
  id: "timeline" | "snapshots";
  label: string;
  icon: LucideIcon;
  description: string;
}

const HISTORY_TABS: HistoryTab[] = [
  {
    id: "timeline",
    label: "Línea de tiempo",
    icon: History,
    description: "Decisiones, simulaciones, créditos y pagos en orden cronológico.",
  },
  {
    id: "snapshots",
    label: "Snapshots manuales",
    icon: ScrollText,
    description: "Cierres contables antiguos (datos legacy, no se generan nuevos).",
  },
];

interface HistoryTabsProps {
  active: "timeline" | "snapshots";
  className?: string;
}

export function HistoryTabs({ active, className }: HistoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (id: "timeline" | "snapshots") => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === "timeline") {
      params.delete("tab");
    } else {
      params.set("tab", id);
    }
    const qs = params.toString();
    router.push(qs ? `/history?${qs}` : "/history");
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + HISTORY_TABS.length) % HISTORY_TABS.length;
    onChange(HISTORY_TABS[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Vistas de historial"
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60",
        "dark:bg-stone-900/60 dark:border-stone-800",
        "overflow-x-auto scrollbar-none",
        className
      )}
    >
      {HISTORY_TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg",
              "text-xs md:text-sm font-semibold whitespace-nowrap",
              "transition-colors duration-150 outline-none",
              "focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 focus-visible:ring-offset-stone-100 dark:focus-visible:ring-stone-600 dark:focus-visible:ring-offset-stone-900",
              isActive
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-50"
                : "text-stone-600 hover:text-stone-900 hover:bg-white/50 dark:text-stone-400 dark:hover:text-stone-50 dark:hover:bg-stone-800/40"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
