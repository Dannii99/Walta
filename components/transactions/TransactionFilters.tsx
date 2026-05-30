"use client";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Category, CategoryType } from "@/types";

export interface TransactionFiltersState {
  search: string;
  categoryId: string;
  type: CategoryType | "";
  dateFrom: string;
  dateTo: string;
}

interface TransactionFiltersProps {
  categories: Category[];
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
}

export function TransactionFilters({
  categories,
  filters,
  onChange,
}: TransactionFiltersProps) {
  const update = (partial: Partial<TransactionFiltersState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Descripcin..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categora</Label>
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
          onChange={(e) => update({ type: e.target.value as CategoryType | "" })}
        >
          <option value="">Todos</option>
          <option value="NEEDS">Necesidades</option>
          <option value="WANTS">Deseos</option>
          <option value="SAVINGS">Ahorros</option>
          <option value="DEBT">Deudas</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateFrom">Desde</Label>
        <Input
          id="dateFrom"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update({ dateFrom: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateTo">Hasta</Label>
        <Input
          id="dateTo"
          type="date"
          value={filters.dateTo}
          onChange={(e) => update({ dateTo: e.target.value })}
        />
      </div>
    </div>
  );
}
