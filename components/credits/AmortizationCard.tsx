"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, Calendar } from "lucide-react";
import { getDaysOverdue } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { AmortizationRow } from "@/types";

interface AmortizationCardProps {
  row: AmortizationRow;
  onMarkPaid?: (month: number) => void;
}

const BADGE: Record<string, string> = {
  PAID: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  PAID_OFF: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  PENDING: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  DEFAULTED: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  UPCOMING: "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700",
};

const LABEL: Record<string, string> = {
  PAID: "Pagado",
  PAID_OFF: "Liquidado",
  PENDING: "Pendiente",
  DEFAULTED: "En mora",
  UPCOMING: "Próximo",
};

export function AmortizationCard({ row, onMarkPaid }: AmortizationCardProps) {
  const daysOverdue =
    row.status === "PENDING" || row.status === "DEFAULTED"
      ? getDaysOverdue(row.date)
      : 0;

  const canMarkPaid =
    onMarkPaid && (row.status === "PENDING" || row.status === "DEFAULTED");

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-2xl bg-white dark:bg-[#17181c] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 space-y-3",
        row.status === "DEFAULTED" && "border-l-2 border-[#e54d4d]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#17181c] dark:text-white tabular-nums">
            Mes {row.month}
          </span>
          {row.paymentPhase !== undefined && row.paymentPhase > 1 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              Fase {row.paymentPhase}
            </span>
          )}
        </div>
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
            BADGE[row.status]
          )}
        >
          {LABEL[row.status]}
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#a1a1aa]">
        <Calendar className="h-3 w-3" />
        {row.date.toLocaleDateString("es-CO", {
          month: "short",
          year: "numeric",
        })}
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
            Cuota
          </p>
          <p className="text-sm font-bold text-[#17181c] dark:text-white tabular-nums">
            {formatCOP(row.totalPayment)}
          </p>
          {row.monthlyFee > 0 && (
            <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] tabular-nums">
              + {formatCOP(row.monthlyFee)} cargos
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
            Saldo
          </p>
          <p className="text-sm font-bold text-[#17181c] dark:text-white tabular-nums">
            {formatCOP(row.balance)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
            Interés
          </p>
          <p className="text-sm font-medium text-[#e54d4d] tabular-nums">
            {formatCOP(row.interest)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
            Capital
          </p>
          <p className="text-sm font-medium text-[#23ad1b] tabular-nums">
            {formatCOP(row.principal)}
          </p>
        </div>
      </div>

      {row.extraPayment > 0 && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Abono: +{formatCOP(row.extraPayment)}
          </span>
        </div>
      )}

      {/* Overdue + Action */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {daysOverdue > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            {daysOverdue} días de mora
          </div>
        )}
        {!daysOverdue && <div />}
        {canMarkPaid && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMarkPaid(row.month)}
            className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
          >
            <Check className="h-3 w-3" />
            Pagar
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
