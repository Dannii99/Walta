"use client";

import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
          <Select
            id="category"
            value={filters.categoryId}
            onChange={(e) => update({ categoryId: e.target.value })}
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            id="type"
            value={filters.type}
            onChange={(e) =>
              update({ type: e.target.value as CategoryType | "" })
            }
          >
            <option value="">Todos</option>
            <option value="NEEDS">Necesidades</option>
            <option value="WANTS">Deseos</option>
            <option value="SAVINGS">Ahorros</option>
            <option value="DEBT">Deudas</option>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recurrence">Frecuencia</Label>
          <Select
            id="recurrence"
            value={filters.recurrence}
            onChange={(e) =>
              update({ recurrence: e.target.value as Recurrence | "" })
            }
          >
            <option value="">Todas</option>
            {RECURRENCE_ORDER.map((r) => (
              <option key={r} value={r}>
                {RECURRENCE_DESCRIPTIONS[r]}
              </option>
            ))}
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
