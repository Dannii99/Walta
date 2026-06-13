"use client";

import { motion } from "framer-motion";
import { Receipt, CheckCircle2 } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import type { LoanPayment } from "@/types";

interface CreditPaymentsListProps {
  payments: LoanPayment[];
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CreditPaymentsList({ payments }: CreditPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] p-12 text-center">
        <div className="h-10 w-10 rounded-xl bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
          <Receipt className="h-5 w-5 text-[#a1a1aa]" />
        </div>
        <p className="text-sm font-semibold text-[#17181c] dark:text-white">
          Sin pagos registrados
        </p>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-1">
          Cuando registres un pago aparecerá aquí.
        </p>
      </div>
    );
  }

  const totalAmount = payments.reduce(
    (sum, p) => sum + parseFloat(p.amount),
    0
  );

  return (
    <div className="rounded-2xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-[#e8e8e8] dark:border-[#2a2a2e] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Receipt className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
              Pagos realizados
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
              {payments.length} {payments.length === 1 ? "pago" : "pagos"} ·{" "}
              <span className="font-semibold text-[#17181c] dark:text-white tabular-nums">
                {formatCOP(totalAmount)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#e8e8e8] dark:divide-[#2a2a2e]">
        {payments.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02 }}
            className="p-4 md:px-6 flex items-center justify-between gap-3 hover:bg-[#fafafa] dark:hover:bg-[#1a1a1e]/80 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#17181c] dark:text-white">
                  {formatDate(p.paidDate)}
                </p>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] tabular-nums">
                  Capital {formatCOP(parseFloat(p.principalPaid))} · Interés{" "}
                  {formatCOP(parseFloat(p.interestPaid))}
                </p>
              </div>
            </div>
            <span className="text-sm font-extrabold tabular-nums text-[#17181c] dark:text-white">
              {formatCOP(parseFloat(p.amount))}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
