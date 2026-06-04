"use client";

import { motion } from "framer-motion";
import { PiggyBank, TrendingDown, StickyNote } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import type { LoanExtraPayment } from "@/types";

interface CreditExtrasListProps {
  extras: LoanExtraPayment[];
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CreditExtrasList({ extras }: CreditExtrasListProps) {
  if (extras.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center">
        <div className="h-10 w-10 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-3">
          <PiggyBank className="h-5 w-5 text-stone-400" />
        </div>
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
          Sin abonos a capital
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
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
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PiggyBank className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Abonos a capital
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {extras.length} {extras.length === 1 ? "abono" : "abonos"} ·{" "}
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {formatCOP(totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-stone-200/80 dark:divide-stone-800">
        {extras.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            className="p-4 md:px-6 hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingDown className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                    {formatDate(e.date)}
                  </p>
                  {e.note && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                      <StickyNote className="h-3 w-3" />
                      {e.note}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-sm font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                +{formatCOP(parseFloat(e.amount))}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
