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
      className="relative overflow-hidden bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-[#26be15]/20 to-[#617dd5]/20 dark:from-[#26be15]/10 dark:to-[#617dd5]/10 blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#26be15]/10 text-[#26be15] flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
              Dinero disponible
            </p>
            <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa]">
              Después de tus gastos recurrentes
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
            {formatCOP(availableMoney)}
          </p>
          <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
            para comprometer en nuevas deudas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
              Ingreso
            </p>
            <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
              {formatCOP(income)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
              Gastos recurrentes
            </p>
            <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
              {formatCOP(totalMonthlyExpenses)}
            </p>
            {expenseRatio > 0 && (
              <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] font-medium">
                {expenseRatio.toFixed(0)}% del ingreso
              </p>
            )}
          </div>
        </div>

        {!isLow && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#23ad1b]/10 dark:bg-[#23ad1b]/10 border border-[#23ad1b]/20 dark:border-[#23ad1b]/20">
            <TrendingUp className="h-3.5 w-3.5 text-[#23ad1b] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#23ad1b]">
                Recomendado
              </p>
              <p className="text-xs text-[#17181c] dark:text-white leading-relaxed">
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
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#e7964d]/10 dark:bg-[#e7964d]/10 border border-[#e7964d]/20 dark:border-[#e7964d]/20">
            <AlertCircle className="h-3.5 w-3.5 text-[#e7964d] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#17181c] dark:text-white leading-relaxed">
                Tus gastos recurrentes igualan o superan tu ingreso. Considera
                revisar tu presupuesto antes de tomar nueva deuda.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#617dd5] dark:text-[#617dd5]">
          <Sparkles className="h-3 w-3" />
          <span>Análisis IA al guardar</span>
        </div>
      </div>
    </motion.div>
  );
}
