"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryIconComponent } from "@/lib/category-icons";
import { getCategoryIconName } from "@/lib/dashboard-helpers";
import type { Category, CategoryType } from "@/types";

const NONE_VALUE = "__none__";

const TYPE_TINTS: Record<CategoryType, string> = {
  NEEDS: "bg-[#26be15]/10 dark:bg-[#26be15]/20",
  WANTS: "bg-[#e7964d]/10 dark:bg-[#e7964d]/20",
  SAVINGS: "bg-[#617dd5]/10 dark:bg-[#617dd5]/20",
  DEBT: "bg-[#9333ea]/10 dark:bg-[#9333ea]/20",
};

const TYPE_FG: Record<CategoryType, string> = {
  NEEDS: "text-[#26be15] dark:text-[#4ade80]",
  WANTS: "text-[#e7964d] dark:text-[#fb923c]",
  SAVINGS: "text-[#617dd5] dark:text-[#60a5fa]",
  DEBT: "text-[#9333ea] dark:text-[#c084fc]",
};

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
  const layoutId = `cat-check-${id ?? "default"}`;
  const showSearch = categories.length > 8;
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const handleSelect = (v: string) => {
    onValueChange(v === NONE_VALUE ? "" : v);
  };

  const isSelected = (v: string) => value === v;

  return (
    <div
      role="radiogroup"
      aria-label={placeholder}
      id={id}
      className="space-y-2.5"
    >
      {showSearch && (
        <div className="flex items-center gap-1.5 rounded-lg border border-[#e8e8e8] bg-[#fafafa] px-2.5 py-1.5 dark:border-[#2a2a2e] dark:bg-[#1a1a1e]">
          <Search className="h-3.5 w-3.5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar categoría..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#737373] dark:placeholder:text-[#a1a1aa]"
            autoComplete="off"
            aria-label="Buscar categoría"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpiar búsqueda"
              className="shrink-0 text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="grid max-h-[260px] grid-cols-3 gap-2 overflow-y-auto pr-0.5 sm:grid-cols-4">
        {allowEmpty && (
          <CategoryTile
            key={NONE_VALUE}
            label={emptyLabel}
            selected={value === ""}
            onSelect={() => handleSelect(NONE_VALUE)}
            layoutId={layoutId}
            isNone
          />
        )}

        {filtered.length === 0 && !allowEmpty ? (
          <div className="col-span-full py-6 text-center text-sm text-[#737373] dark:text-[#a1a1aa]">
            Sin resultados
          </div>
        ) : (
          filtered.map((cat) => {
            const iconName = cat.icon ?? getCategoryIconName(cat.name);
            const Icon = getCategoryIconComponent(iconName);
            const type = cat.type as CategoryType;
            const selected = isSelected(cat.id);
            return (
              <CategoryTile
                key={cat.id}
                label={cat.name}
                selected={selected}
                onSelect={() => handleSelect(cat.id)}
                layoutId={layoutId}
                icon={<Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />}
                iconTint={TYPE_TINTS[type]}
                iconFg={TYPE_FG[type]}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

interface CategoryTileProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  layoutId: string;
  isNone?: boolean;
  icon?: React.ReactNode;
  iconTint?: string;
  iconFg?: string;
}

function CategoryTile({
  label,
  selected,
  onSelect,
  layoutId,
  isNone = false,
  icon,
  iconTint,
  iconFg,
}: CategoryTileProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex min-h-[78px] flex-col items-center justify-center gap-1.5 rounded-xl border p-2 text-center transition-colors",
        selected
          ? "border-[#26be15] bg-[#26be15]/[0.06] dark:border-[#26be15] dark:bg-[#26be15]/10"
          : "border-[#e8e8e8] bg-white hover:border-[#d4d4d4] dark:border-[#2a2a2e] dark:bg-[#1a1a1e] dark:hover:border-[#3a3a3e]",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full",
          isNone
            ? "bg-[#737373]/10 text-[#737373] dark:bg-[#737373]/20 dark:text-[#a1a1aa]"
            : iconTint,
        )}
      >
        {isNone ? (
          <X className="h-4 w-4" strokeWidth={2.4} />
        ) : (
          <span className={iconFg}>{icon}</span>
        )}
      </span>

      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-[#17181c] dark:text-white">
        {label}
      </span>

      {selected && (
        <motion.span
          layoutId={layoutId}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#26be15] text-white shadow-sm ring-2 ring-white dark:ring-[#1a1a1e]"
        >
          <Check className="h-3 w-3" strokeWidth={3.5} />
        </motion.span>
      )}
    </motion.button>
  );
}