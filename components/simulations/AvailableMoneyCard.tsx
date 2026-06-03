"use client";

import { Wallet, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP } from "@/lib/currency";

interface AvailableMoneyCardProps {
  income: number;
  totalMonthlyExpenses: number;
  availableMoney: number;
}

export function AvailableMoneyCard({
  income,
  totalMonthlyExpenses,
  availableMoney,
}: AvailableMoneyCardProps) {
  const recommendedMax = availableMoney * 0.3;
  const isLow = availableMoney <= 0;
  const expenseRatio = income > 0 ? (totalMonthlyExpenses / income) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 md:p-6"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-200/40 to-teal-200/40 dark:from-emerald-900/20 dark:to-teal-900/20 blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Dinero disponible
            </p>
            <p className="text-[10px] text-stone-400 dark:text-stone-500">
              Después de tus gastos recurrentes
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
            {formatCOP(availableMoney)}
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
            para comprometer en nuevas deudas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/80 dark:border-stone-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Ingreso
            </p>
            <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatCOP(income)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Gastos recurrentes
            </p>
            <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatCOP(totalMonthlyExpenses)}
            </p>
            {expenseRatio > 0 && (
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                {expenseRatio.toFixed(0)}% del ingreso
              </p>
            )}
          </div>
        </div>

        {!isLow && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Recomendado
              </p>
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                Cuota máxima sugerida:{" "}
                <span className="font-bold tabular-nums">
                  {formatCOP(recommendedMax)}
                </span>{" "}
                (30% del disponible)
              </p>
            </div>
          </div>
        )}

        {isLow && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <AlertCircle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                Tus gastos recurrentes igualan o superan tu ingreso. Considera
                revisar tu presupuesto antes de tomar nueva deuda.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Sparkles className="h-3 w-3" />
          <span>Análisis IA al guardar</span>
        </div>
      </div>
    </motion.div>
  );
}
