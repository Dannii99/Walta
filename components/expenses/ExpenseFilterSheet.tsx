"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySelect } from "@/components/expenses/CategorySelect";
import { RECURRENCE_DESCRIPTIONS } from "@/lib/recurrence";
import type { Category, CategoryType, Recurrence } from "@/types";

export interface ExpenseFilterSheetState {
  search: string;
  categoryId: string;
  type: CategoryType | "";
  recurrence: Recurrence | "";
}

interface ExpenseFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ExpenseFilterSheetState;
  onChange: (filters: ExpenseFilterSheetState) => void;
  categories: Category[];
}

const NONE_VALUE = "__none__";
const RECURRENCE_ORDER: Recurrence[] = ["MONTHLY", "BIWEEKLY", "ONE_TIME"];

export function ExpenseFilterSheet({
  open,
  onOpenChange,
  filters,
  onChange,
  categories,
}: ExpenseFilterSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasFilters =
    filters.search !== "" ||
    filters.categoryId !== "" ||
    filters.type !== "" ||
    filters.recurrence !== "";

  const update = (partial: Partial<ExpenseFilterSheetState>) => {
    onChange({ ...filters, ...partial });
  };

  const clearAll = () => {
    onChange({ search: "", categoryId: "", type: "", recurrence: "" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden mb-0!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => onOpenChange(false)}
          />

          {/* Sheet */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#17181c] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxHeight: "92dvh", minHeight: "50dvh" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#737373]" />
                <span className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Filtros
                </span>
                {hasFilters && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#26be15] text-white text-[10px] font-bold">
                    {[
                      filters.search,
                      filters.categoryId,
                      filters.type,
                      filters.recurrence,
                    ].filter(Boolean).length}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-5overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Categoría
                </label>
                <CategorySelect
                  value={filters.categoryId}
                  onValueChange={(v) => update({ categoryId: v })}
                  categories={categories}
                  allowEmpty
                  emptyLabel="Todas"
                  placeholder="Todas"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Tipo
                </label>
                <Select
                  value={filters.type === "" ? NONE_VALUE : filters.type}
                  onValueChange={(v) =>
                    update({ type: v === NONE_VALUE ? "" : (v as CategoryType) })
                  }
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

              {/* Recurrence */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Frecuencia
                </label>
                <Select
                  value={
                    filters.recurrence === "" ? NONE_VALUE : filters.recurrence
                  }
                  onValueChange={(v) =>
                    update({
                      recurrence: v === NONE_VALUE ? "" : (v as Recurrence),
                    })
                  }
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

              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="w-full border-[#e8e8e8] text-[#737373] hover:text-[#17181c] dark:border-[#2a2a2e] dark:text-[#a1a1aa] dark:hover:text-white"
                >
                  <FilterX className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 p-4 border-t border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
              <Button
                className="w-full bg-[#26be15] text-white hover:bg-[#23ad1b] font-semibold"
                onClick={() => onOpenChange(false)}
              >
                Listo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
