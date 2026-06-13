"use client";

import { motion } from "framer-motion";
import { PiggyBank, TrendingDown, StickyNote, Pencil, Trash2 } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import type { LoanExtraPayment } from "@/types";

interface CreditExtrasListProps {
  extras: LoanExtraPayment[];
  onEdit?: (extra: LoanExtraPayment) => void;
  onDelete?: (extra: LoanExtraPayment) => void;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CreditExtrasList({ extras, onEdit, onDelete }: CreditExtrasListProps) {
  if (extras.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] p-12 text-center">
        <div className="h-10 w-10 rounded-xl bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
          <PiggyBank className="h-5 w-5 text-[#a1a1aa]" />
        </div>
        <p className="text-sm font-semibold text-[#17181c] dark:text-white">
          Sin abonos a capital
        </p>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-1">
          Los abonos extraordinarios reducirán tu plazo o cuota.
        </p>
      </div>
    );
  }

  const totalAmount = extras.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0
  );

  return (
    <div className="rounded-2xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-[#e8e8e8] dark:border-[#2a2a2e] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PiggyBank className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
              Abonos a capital
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
              {extras.length} {extras.length === 1 ? "abono" : "abonos"} ·{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {formatCOP(totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#e8e8e8] dark:divide-[#2a2a2e]">
        {extras.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            className="p-4 md:px-6 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1e]/80 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingDown className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#17181c] dark:text-white">
                    {formatDate(e.date)}
                  </p>
                  {e.note && (
                    <p className="text-xs text-[#737373] dark:text-[#a1a1aa] flex items-center gap-1 mt-0.5">
                      <StickyNote className="h-3 w-3" />
                      {e.note}
                    </p>
                  )}
                  {e.recalculationMode === "REDUCE_PAYMENT" && (
                    <p className="text-[10px] font-semibold mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">
                      Reduce cuota
                      {e.newTermMonths != null && ` · ${e.newTermMonths}m`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                  +{formatCOP(parseFloat(e.amount))}
                </span>
                {(onEdit || onDelete) && (
                  <div className="flex items-center gap-1 ml-1">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(e)}
                        aria-label={`Editar abono de ${formatCOP(parseFloat(e.amount))}`}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-white/5 hover:text-[#17181c] dark:hover:text-white transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(e)}
                        aria-label={`Eliminar abono de ${formatCOP(parseFloat(e.amount))}`}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
