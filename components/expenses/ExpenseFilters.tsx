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
import { CategorySelect } from "@/components/expenses/CategorySelect";
import { RECURRENCE_DESCRIPTIONS } from "@/lib/recurrence";
import { Button } from "@/components/ui/button";
import type { Category, CategoryType, Recurrence } from "@/types";

export interface ExpenseFiltersState {
  search: string;
  categoryId: string;
  type: CategoryType | "";
  recurrence: Recurrence | "";
}

interface ExpenseFiltersProps {
  categories: Category[];
  filters: ExpenseFiltersState;
  onChange: (filters: ExpenseFiltersState) => void;
  onClear: () => void;
  count: number;
  total: number;
  onOpenFilterSheet?: () => void;
}

export const DEFAULT_FILTERS: ExpenseFiltersState = {
  search: "",
  categoryId: "",
  type: "",
  recurrence: "",
};

const NONE_VALUE = "__none__";
const RECURRENCE_ORDER: Recurrence[] = ["MONTHLY", "BIWEEKLY", "ONE_TIME"];

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

export function ExpenseFilters({
  categories,
  filters,
  onChange,
  onClear,
  count,
  total,
  onOpenFilterSheet,
}: ExpenseFiltersProps) {
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);
  const [typePopoverOpen, setTypePopoverOpen] = useState(false);
  const [recurrencePopoverOpen, setRecurrencePopoverOpen] = useState(false);

  const update = (partial: Partial<ExpenseFiltersState>) => {
    onChange({ ...filters, ...partial });
  };

  const hasFilters =
    filters.search !== "" ||
    filters.categoryId !== "" ||
    filters.type !== "" ||
    filters.recurrence !== "";

  const activeFilterCount = [
    filters.search,
    filters.categoryId,
    filters.type,
    filters.recurrence,
  ].filter(Boolean).length;

  const selectedCategory = categories.find((c) => c.id === filters.categoryId);
  const selectedCategoryLabel = selectedCategory?.name ?? "Categoría";
  const selectedTypeLabel = filters.type ? TYPE_LABELS[filters.type] : "Tipo";
  const selectedRecurrenceLabel = filters.recurrence
    ? RECURRENCE_DESCRIPTIONS[filters.recurrence]
    : "Frecuencia";

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
            placeholder="Buscar gasto..."
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
            placeholder="Buscar gasto..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-9 bg-white dark:bg-[#17181c] border-[#e8e8e8] dark:border-[#2a2a2e]"
          />
        </div>

        {/* Category filter chip */}
        <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                filters.categoryId
                  ? "bg-[#26be15]/10 text-[#26be15] border-[#26be15]/20"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              }`}
            >
              {selectedCategoryLabel}
              {filters.categoryId && <Check className="h-3 w-3" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Categoría
              </p>
              <CategorySelect
                value={filters.categoryId}
                onValueChange={(v) => {
                  update({ categoryId: v });
                  setCategoryPopoverOpen(false);
                }}
                categories={categories}
                allowEmpty
                emptyLabel="Todas"
                placeholder="Selecciona..."
              />
            </div>
          </PopoverContent>
        </Popover>

        {/* Type filter chip */}
        <Popover open={typePopoverOpen} onOpenChange={setTypePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                filters.type
                  ? "bg-[#26be15]/10 text-[#26be15] border-[#26be15]/20"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              }`}
            >
              {selectedTypeLabel}
              {filters.type && <Check className="h-3 w-3" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Tipo
              </p>
              <Select
                value={filters.type === "" ? NONE_VALUE : filters.type}
                onValueChange={(v) => {
                  update({ type: v === NONE_VALUE ? "" : (v as CategoryType) });
                  setTypePopoverOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Todos</SelectItem>
                  <SelectItem value="NEEDS">Necesidades</SelectItem>
                  <SelectItem value="WANTS">Deseos</SelectItem>
                  <SelectItem value="SAVINGS">Ahorros</SelectItem>
                  <SelectItem value="DEBT">Deudas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Recurrence filter chip */}
        <Popover open={recurrencePopoverOpen} onOpenChange={setRecurrencePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border ${
                filters.recurrence
                  ? "bg-[#26be15]/10 text-[#26be15] border-[#26be15]/20"
                  : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
              }`}
            >
              {selectedRecurrenceLabel}
              {filters.recurrence && <Check className="h-3 w-3" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0" align="start">
            <div className="p-3 space-y-3">
              <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                Frecuencia
              </p>
              <Select
                value={
                  filters.recurrence === "" ? NONE_VALUE : filters.recurrence
                }
                onValueChange={(v) => {
                  update({
                    recurrence: v === NONE_VALUE ? "" : (v as Recurrence),
                  });
                  setRecurrencePopoverOpen(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE_VALUE}>Todas</SelectItem>
                  {RECURRENCE_ORDER.map((r) => (
                    <SelectItem key={r} value={r}>
                      {RECURRENCE_DESCRIPTIONS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Result count */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-[#737373] dark:text-[#a1a1aa]">
            <span className="font-bold text-[#17181c] dark:text-white">
              {count}
            </span>{" "}
            de{" "}
            <span className="font-bold text-[#17181c] dark:text-white">
              {total}
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
            {count}
          </span>{" "}
          de{" "}
          <span className="font-bold text-[#17181c] dark:text-white">
            {total}
          </span>{" "}
          gastos
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
