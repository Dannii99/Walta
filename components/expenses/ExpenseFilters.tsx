"use client";

import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/expenses/CategorySelect";
import { RECURRENCE_DESCRIPTIONS } from "@/lib/recurrence";
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
}

const DEFAULT_FILTERS: ExpenseFiltersState = {
  search: "",
  categoryId: "",
  type: "",
  recurrence: "",
};

const NONE_VALUE = "__none__";
const RECURRENCE_ORDER: Recurrence[] = ["MONTHLY", "BIWEEKLY", "ONE_TIME"];

export function ExpenseFilters({
  categories,
  filters,
  onChange,
  onClear,
  count,
  total,
}: ExpenseFiltersProps) {
  const update = (partial: Partial<ExpenseFiltersState>) => {
    onChange({ ...filters, ...partial });
  };

  const hasFilters =
    filters.search !== "" ||
    filters.categoryId !== "" ||
    filters.type !== "" ||
    filters.recurrence !== "";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-stone-200/80 dark:border-stone-800 rounded-2xl bg-card">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="search"
              placeholder="Descripción..."
              value={filters.search}
              onChange={(e) => update({ search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <CategorySelect
            id="category"
            value={filters.categoryId}
            onValueChange={(v) => update({ categoryId: v })}
            categories={categories}
            allowEmpty
            emptyLabel="Todas"
            placeholder="Todas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={filters.type === "" ? NONE_VALUE : filters.type}
            onValueChange={(v) =>
              update({ type: v === NONE_VALUE ? "" : (v as CategoryType) })
            }
          >
            <SelectTrigger id="type">
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

        <div className="space-y-2">
          <Label htmlFor="recurrence">Frecuencia</Label>
          <Select
            value={filters.recurrence === "" ? NONE_VALUE : filters.recurrence}
            onValueChange={(v) =>
              update({ recurrence: v === NONE_VALUE ? "" : (v as Recurrence) })
            }
          >
            <SelectTrigger id="recurrence">
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
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Mostrando{" "}
          <span className="font-bold text-stone-700 dark:text-stone-200">
            {count}
          </span>{" "}
          de{" "}
          <span className="font-bold text-stone-700 dark:text-stone-200">
            {total}
          </span>{" "}
          gastos
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            <FilterX className="h-3.5 w-3.5 mr-1.5" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_FILTERS };
