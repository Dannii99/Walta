"use client";

import { useState } from "react";
import {
  Search,
  FilterX,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  onClear: () => void;
  totalCount: number;
  filteredCount: number;
  onOpenFilterSheet?: () => void;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  type: "all",
  verdict: "all",
};

const NONE_VALUE = "__none__";

const TYPE_LABELS: Record<TypeFilter, string> = {
  all: "Tipo",
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

const VERDICT_LABELS: Record<VerdictFilter, string> = {
  all: "Veredicto",
  APPROVED: "Viables",
  WARNING: "Advertencia",
  REJECTED: "Arriesgadas",
};

export function SimulationsFilters({
  filters,
  onChange,
  onClear,
  totalCount,
  filteredCount,
  onOpenFilterSheet,
}: SimulationsFiltersProps) {
  const [typePopoverOpen, setTypePopoverOpen] = useState(false);
  const [verdictPopoverOpen, setVerdictPopoverOpen] = useState(false);

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const hasFilters =
    filters.search !== "" || filters.type !== "all" || filters.verdict !== "all";

  const activeFilterCount = [
    filters.search,
    filters.type !== "all" ? filters.type : "",
    filters.verdict !== "all" ? filters.verdict : "",
  ].filter(Boolean).length;

  const selectedTypeLabel = TYPE_LABELS[filters.type];
  const selectedVerdictLabel = VERDICT_LABELS[filters.verdict];

  return (
    <div className="space-y-3">
      {/* Mobile: Search + Filter button */}
      <div className="flex items-center gap-3 md:hidden">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar simulación..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-[#17181c] border-[#e8e8e8] dark:border-[#2a2a2e]"
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
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full bg-[#26be15] text-white text-[9px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop: Inline filter bar */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] pointer-events-none"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar simulación..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-[#17181c] border-[#e8e8e8] dark:border-[#2a2a2e]"
          />
        </div>

        {/* Type filter chip */}
        <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                filters.type !== "all"
                  ? "bg-[#26be15]/10 text-[#26be15] border-[#26be15]/20"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              }`}
            >
              {selectedTypeLabel}
              {filters.type !== "all" && <Check className="h-3 w-3" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Tipo
              </p>
              <Select
                value={filters.type === "all" ? NONE_VALUE : filters.type}
                onValueChange={(v) => {
                  update({ type: v === NONE_VALUE ? "all" : (v as TypeFilter) });
                  setTypePopoverOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Todos</SelectItem>
                  <SelectItem value="VEHICLE">Vehículo</SelectItem>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="HOUSING">Vivienda</SelectItem>
                  <SelectItem value="OTHER">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Verdict filter chip */}
        <Popover open={verdictPopoverOpen} onOpenChange={setVerdictPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                filters.verdict !== "all"
                  ? "bg-[#26be15]/10 text-[#26be15] border-[#26be15]/20"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              }`}
            >
              {selectedVerdictLabel}
              {filters.verdict !== "all" && <Check className="h-3 w-3" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Veredicto
              </p>
              <Select
                value={filters.verdict === "all" ? NONE_VALUE : filters.verdict}
                onValueChange={(v) => {
                  update({
                    verdict: v === NONE_VALUE ? "all" : (v as VerdictFilter),
                  });
                  setVerdictPopoverOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Todos</SelectItem>
                  <SelectItem value="APPROVED">Viables</SelectItem>
                  <SelectItem value="WARNING">Advertencia</SelectItem>
                  <SelectItem value="REJECTED">Arriesgadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Result count */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#737373] dark:text-[#a1a1aa]">
            <span className="font-bold text-[#17181c] dark:text-white">
              {filteredCount}
            </span>{" "}
            de{" "}
            <span className="font-bold text-[#17181c] dark:text-white">
              {totalCount}
            </span>
          </span>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
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
          <span className="font-bold text-[#17181c] dark:text-white">
            {filteredCount}
          </span>{" "}
          de{" "}
          <span className="font-bold text-[#17181c] dark:text-white">
            {totalCount}
          </span>{" "}
          simulaciones
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
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
