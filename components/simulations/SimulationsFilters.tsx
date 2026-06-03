"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TypeFilter = "all" | "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER";
export type VerdictFilter = "all" | "APPROVED" | "WARNING" | "REJECTED";

export interface FilterState {
  search: string;
  type: TypeFilter;
  verdict: VerdictFilter;
}

interface SimulationsFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "VEHICLE", label: "Vehículo" },
  { value: "PERSONAL", label: "Personal" },
  { value: "HOUSING", label: "Vivienda" },
  { value: "OTHER", label: "Otros" },
];

const VERDICT_OPTIONS: { value: VerdictFilter; label: string; color: string }[] = [
  { value: "all", label: "Todos", color: "" },
  { value: "APPROVED", label: "Viables", color: "data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-800 data-[active=true]:border-emerald-200 dark:data-[active=true]:bg-emerald-950/40 dark:data-[active=true]:text-emerald-400 dark:data-[active=true]:border-emerald-900" },
  { value: "WARNING", label: "Advertencia", color: "data-[active=true]:bg-amber-100 data-[active=true]:text-amber-800 data-[active=true]:border-amber-200 dark:data-[active=true]:bg-amber-950/40 dark:data-[active=true]:text-amber-400 dark:data-[active=true]:border-amber-900" },
  { value: "REJECTED", label: "Arriesgadas", color: "data-[active=true]:bg-rose-100 data-[active=true]:text-rose-800 data-[active=true]:border-rose-200 dark:data-[active=true]:bg-rose-950/40 dark:data-[active=true]:text-rose-400 dark:data-[active=true]:border-rose-900" },
];

function FilterChip({
  label,
  active,
  onClick,
  colorClass = "",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  colorClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        active
          ? colorClass || "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
          : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60"
      )}
    >
      {label}
    </button>
  );
}

export function SimulationsFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: SimulationsFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" || filters.type !== "all" || filters.verdict !== "all";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full h-9 pl-9 pr-3 text-sm rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 focus:border-transparent"
          />
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange({ search: "", type: "all", verdict: "all" })}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
        <p className="text-xs text-stone-500 dark:text-stone-400 font-medium ml-auto">
          {filteredCount === totalCount
            ? `${totalCount} ${totalCount === 1 ? "simulación" : "simulaciones"}`
            : `${filteredCount} de ${totalCount}`}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Tipo
        </span>
        {TYPE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.type === opt.value}
            onClick={() => onChange({ ...filters, type: opt.value })}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Veredicto
        </span>
        {VERDICT_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filters.verdict === opt.value}
            onClick={() => onChange({ ...filters, verdict: opt.value })}
            colorClass={opt.color}
          />
        ))}
      </div>
    </div>
  );
}
