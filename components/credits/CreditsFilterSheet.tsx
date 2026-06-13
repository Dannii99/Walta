"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Check, FilterX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loanStatusLabel, loanTypeLabel } from "@/lib/credit-types";
import { LOAN_STATUSES, LOAN_TYPES } from "@/lib/credit-types";
import { cn } from "@/lib/utils";

export interface CreditsFilterSheetState {
  query: string;
  status: string;
  type: string;
}

interface CreditsFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: CreditsFilterSheetState;
  onChange: (filters: CreditsFilterSheetState) => void;
}

const STATUSES = LOAN_STATUSES;
const TYPES = LOAN_TYPES;

export function CreditsFilterSheet({
  open,
  onOpenChange,
  filters,
  onChange,
}: CreditsFilterSheetProps) {
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
    filters.query !== "" || filters.status !== "all" || filters.type !== "all";
  const activeCount = [
    filters.query !== "",
    filters.status !== "all",
    filters.type !== "all",
  ].filter(Boolean).length;

  const update = (partial: Partial<CreditsFilterSheetState>) => {
    onChange({ ...filters, ...partial });
  };

  const clearAll = () => {
    onChange({ query: "", status: "all", type: "all" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
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
            style={{ maxHeight: "92dvh", minHeight: "40dvh" }}
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
                    {activeCount}
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
            <div className="p-4 space-y-5 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] pointer-events-none" />
                  <input
                    type="text"
                    value={filters.query}
                    onChange={(e) => update({ query: e.target.value })}
                    placeholder="Buscar por nombre..."
                    className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-[#26be15]/30 focus:border-[#26be15]"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  Estado
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => update({ status: "all" })}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                      filters.status === "all"
                        ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                        : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
                    )}
                  >
                    Todos
                  </button>
                  {STATUSES.map((s) => {
                    const active = filters.status === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => update({ status: active ? "all" : s })}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                          active
                            ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                            : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {loanStatusLabel(s)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#737373] uppercase tracking-wider">
                  Tipo
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => update({ type: "all" })}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                      filters.type === "all"
                        ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                        : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
                    )}
                  >
                    Todos
                  </button>
                  {TYPES.map((t) => {
                    const active = filters.type === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => update({ type: active ? "all" : t })}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors",
                          active
                            ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                            : "bg-[#fafafa] text-[#737373] border-[#e8e8e8] dark:bg-[#1a1a1e] dark:text-[#a1a1aa] dark:border-[#2a2a2e]"
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {loanTypeLabel(t)}
                      </button>
                    );
                  })}
                </div>
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
