"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, FilterX, Check } from "lucide-react";
import { loanStatusLabel, loanTypeLabel } from "@/lib/credit-types";
import { LOAN_STATUSES, LOAN_TYPES } from "@/lib/credit-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CreditsFiltersValue {
  query: string;
  status: string;
  type: string;
}

interface CreditsFiltersProps {
  value: CreditsFiltersValue;
  onChange: (value: CreditsFiltersValue) => void;
  total: number;
  filtered: number;
  onOpenFilterSheet?: () => void;
}

const STATUSES = LOAN_STATUSES;
const TYPES = LOAN_TYPES;

export function CreditsFilters({ value, onChange, total, filtered, onOpenFilterSheet }: CreditsFiltersProps) {
  const hasFilters =
    value.query !== "" || value.status !== "all" || value.type !== "all";
  const activeCount = [
    value.query !== "",
    value.status !== "all",
    value.type !== "all",
  ].filter(Boolean).length;

  const clearAll = () => onChange({ query: "", status: "all", type: "all" });

  return (
    <div className="bg-white dark:bg-[#17181c] rounded-2xl p-3 md:p-4 space-y-3">
      {/* Mobile: search + filter button */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Buscar por nombre..."
            className="w-full h-9 pl-9 pr-3 text-sm rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#26be15]/30 focus:border-[#26be15]"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="relative shrink-0 border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c]"
          onClick={onOpenFilterSheet}
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-[#26be15] text-white text-[9px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop: inline filter bar */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            placeholder="Buscar por nombre..."
            className="w-full h-9 pl-9 pr-3 text-sm rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#26be15]/30 focus:border-[#26be15]"
          />
        </div>

        {/* Status filter chips */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mr-1">
          Estado
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...value, status: "all" })}
          data-active={value.status === "all"}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            value.status === "all"
              ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
              : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
          )}
        >
          {value.status === "all" ? "Todos" : "Todos"}
        </button>
        {STATUSES.map((s) => {
          const active = value.status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...value, status: active ? "all" : s })}
              data-active={active}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                active
                  ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              )}
            >
              {active && <Check className="h-3 w-3" />}
              {loanStatusLabel(s)}
            </button>
          );
        })}

        {/* Type filter chips */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mr-1">
          Tipo
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...value, type: "all" })}
          data-active={value.type === "all"}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            value.type === "all"
              ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
              : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
          )}
        >
          {value.type === "all" ? "Todos" : "Todos"}
        </button>
        {TYPES.map((t) => {
          const active = value.type === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...value, type: active ? "all" : t })}
              data-active={active}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                active
                  ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              )}
            >
              {active && <Check className="h-3 w-3" />}
              {loanTypeLabel(t)}
            </button>
          );
        })}

        {/* Result count */}
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
              onClick={clearAll}
              className="text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white h-8 px-2"
            >
              <FilterX className="h-3.5 w-3.5 mr-1.5" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="flex items-center justify-between md:hidden">
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
          Mostrando{" "}
          <span className="font-bold text-[#17181c] dark:text-white">{filtered}</span>{" "}
          de{" "}
          <span className="font-bold text-[#17181c] dark:text-white">{total}</span>{" "}
          créditos
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white h-8 px-2"
          >
            <FilterX className="h-3.5 w-3.5 mr-1.5" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
