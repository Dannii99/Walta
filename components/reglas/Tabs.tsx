"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Secciones de reglas"
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl",
        "bg-[#f5f5f5]/80 dark:bg-white/5",
        "overflow-x-auto scrollbar-none",
        className
      )}
    >
      {tabs.map((tab, index) => {
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
              "focus-visible:ring-2 focus-visible:ring-[#617dd5]/40 focus-visible:ring-offset-1",
              isActive
                ? "bg-[#17181c] text-white shadow-sm dark:bg-white dark:text-[#17181c]"
                : "text-[#737373] hover:text-[#17181c] hover:bg-white/60 dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-white/10"
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
