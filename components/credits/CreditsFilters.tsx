"use client";

import { Search } from "lucide-react";
import { loanStatusLabel, loanTypeLabel } from "@/lib/credit-types";
import { LOAN_STATUSES, LOAN_TYPES } from "@/lib/credit-types";
import { cn } from "@/lib/utils";

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
}

const STATUSES = LOAN_STATUSES;
const TYPES = LOAN_TYPES;

export function CreditsFilters({ value, onChange, total, filtered }: CreditsFiltersProps) {
  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-3 md:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Buscar por nombre..."
          className="w-full h-9 pl-9 pr-3 text-sm rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
          Estado
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...value, status: "all" })}
          data-active={value.status === "all"}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            value.status === "all"
              ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
              : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
          )}
        >
          Todos
        </button>
        {STATUSES.map((s) => {
          const active = value.status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ ...value, status: s })}
              data-active={active}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                active
                  ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
              )}
            >
              {loanStatusLabel(s)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
          Tipo
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...value, type: "all" })}
          data-active={value.type === "all"}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
            value.type === "all"
              ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
              : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
          )}
        >
          Todos
        </button>
        {TYPES.map((t) => {
          const active = value.type === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...value, type: t })}
              data-active={active}
              className={cn(
                "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                active
                  ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                  : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
              )}
            >
              {loanTypeLabel(t)}
            </button>
          );
        })}
      </div>

      {(value.query !== "" || value.status !== "all" || value.type !== "all") && (
        <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
          Mostrando {filtered} de {total} créditos
        </p>
      )}
    </div>
  );
}
