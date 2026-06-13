"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types";

const NONE_VALUE = "__none__";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  categories: Category[];
  placeholder?: string;
  id?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  categories,
  placeholder = "Seleccionar...",
  id,
  allowEmpty = false,
  emptyLabel = "Ninguna",
}: CategorySelectProps) {
  const [search, setSearch] = React.useState("");
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleChange = (v: string) => {
    onValueChange(v === NONE_VALUE ? "" : v);
  };

  const displayValue = value === "" && allowEmpty ? NONE_VALUE : value;

  return (
    <Select value={displayValue} onValueChange={handleChange}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="flex items-center border-b border-stone-200 dark:border-stone-700 px-2 py-1.5">
          <Search
            className="h-3.5 w-3.5 text-stone-400 mr-1.5 shrink-0"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar categoría..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
            autoComplete="off"
          />
        </div>
        {allowEmpty && (
          <SelectItem value={NONE_VALUE}>{emptyLabel}</SelectItem>
        )}
        {filtered.length === 0 ? (
          <div className="py-3 px-2 text-sm text-stone-500 dark:text-stone-400 text-center">
            Sin resultados
          </div>
        ) : (
          filtered.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
