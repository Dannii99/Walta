"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { getPaymentStatusCounts } from "@/lib/loan-engine";
import type { Loan, AmortizationRow } from "@/types";

interface CreditProgressBarProps {
  loan: Loan;
  schedule: AmortizationRow[];
}

export function CreditProgressBar({ loan, schedule }: CreditProgressBarProps) {
  const principal = parseFloat(loan.principal);
  const counts = getPaymentStatusCounts(schedule);
  const total = schedule.length || 1;

  const paidPct = (counts.paid / total) * 100;
  const paidOffPct = (counts.paidOff / total) * 100;
  const pendingPct = (counts.pending / total) * 100;
  const defaultedPct = (counts.defaulted / total) * 100;
  const upcomingPct = (counts.upcoming / total) * 100;

  const totalPaid = schedule.reduce((sum, row) => {
    if (row.status === "PAID" || row.status === "PAID_OFF") {
      return sum + row.principal + row.extraPayment;
    }
    return sum;
  }, 0);
  const capitalProgress = principal > 0 ? (totalPaid / principal) * 100 : 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#17181c]">
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
            <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
            Progreso del crédito
          </h2>
        </div>

        <div className="space-y-2">
          <div className="flex h-3 w-full rounded-full overflow-hidden bg-[#e8e8e8] dark:bg-[#2a2a2e]">
            {counts.paid > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${paidPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-emerald-500 h-full"
                title={`${counts.paid} pagadas`}
              />
            )}
            {counts.paidOff > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${paidOffPct}%` }}
                transition={{ duration: 0.6, delay: 0.05, ease: "easeOut" }}
                className="bg-slate-300 dark:bg-slate-600 h-full"
                title={`${counts.paidOff} liquidadas (saldo agotado por abonos)`}
              />
            )}
            {counts.pending > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pendingPct}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="bg-amber-500 h-full"
                title={`${counts.pending} pendientes`}
              />
            )}
            {counts.defaulted > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${defaultedPct}%` }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="bg-[#e54d4d] h-full"
                title={`${counts.defaulted} en mora`}
              />
            )}
            {counts.upcoming > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${upcomingPct}%` }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="bg-[#e8e8e8] dark:bg-[#2a2a2e] h-full"
                title={`${counts.upcoming} futuras`}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#737373] dark:text-[#a1a1aa]">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
              {counts.paid} pagadas
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium tabular-nums">
              {counts.pending} pendientes
            </span>
            {counts.defaulted > 0 && (
              <span className="text-[#e54d4d] dark:text-[#e54d4d] font-medium tabular-nums">
                {counts.defaulted} en mora
              </span>
            )}
            <span className="text-[#737373] dark:text-[#a1a1aa] font-medium tabular-nums">
              {counts.upcoming} futuras
            </span>
            {counts.paidOff > 0 && (
              <span className="text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                {counts.paidOff} liquidadas
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-sm">
            <span className="text-[#737373] dark:text-[#a1a1aa] font-medium">
              Capital amortizado
            </span>
            <span className="font-bold tabular-nums text-[#17181c] dark:text-white">
              {capitalProgress.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#e8e8e8] dark:bg-[#2a2a2e] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(capitalProgress, 100)}%` }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-[#617dd5] dark:bg-[#617dd5] rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
