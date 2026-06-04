"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Car, Wallet, Home, CreditCard as CreditCardIcon, CircleDot } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import { loanTypeLabel, loanStatusConfig, loanTypeIconBg } from "@/lib/credit-types";
import type { LoanType, LoanStatus } from "@/lib/credit-types";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  loan: {
    id: string;
    title: string;
    type: string;
    status: string;
    principal: string;
    monthlyPayment: string;
    termMonths: number;
    annualRate: string;
    startDate: Date;
    paymentsCount: number;
  };
  index: number;
}

function TypeIcon({ type }: { type: string }) {
  const map: Record<string, typeof Car> = {
    VEHICLE: Car,
    PERSONAL: Wallet,
    HOUSING: Home,
    OTHER: CreditCardIcon,
  };
  const Icon = map[type] ?? CreditCardIcon;
  return <Icon className="h-4 w-4" strokeWidth={2.2} />;
}

function ProgressBar({
  payments,
  total,
  status,
}: {
  payments: number;
  total: number;
  status: string;
}) {
  const pct = total > 0 ? Math.min(100, (payments / total) * 100) : 0;
  const isDefaulted = status === "DEFAULTED";
  const isPaidOff = status === "PAID_OFF";
  return (
    <div className="space-y-1.5">
      <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            isDefaulted
              ? "bg-rose-500"
              : isPaidOff
              ? "bg-emerald-500"
              : "bg-blue-500"
          )}
        />
      </div>
      <p className="text-[10px] text-stone-500 dark:text-stone-400 tabular-nums">
        {payments} de {total} cuotas
      </p>
    </div>
  );
}

export function CreditCard({ loan, index }: CreditCardProps) {
  const statusConfig = loanStatusConfig(loan.status as LoanStatus);
  const typeLabel = loanTypeLabel(loan.type as LoanType);
  const typeBg = loanTypeIconBg(loan.type as LoanType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/credits/${loan.id}`}
        className="block group rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
      >
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                typeBg
              )}
            >
              <TypeIcon type={loan.type} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {typeLabel}
              </p>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 truncate">
                {loan.title}
              </h3>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border shrink-0",
                statusConfig.badge
              )}
            >
              <CircleDot className="h-3 w-3" />
              {statusConfig.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cuota mensual
              </p>
              <p className="text-sm font-extrabold tabular-nums text-stone-900 dark:text-stone-50">
                {formatCOP(parseFloat(loan.monthlyPayment))}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Capital
              </p>
              <p className="text-sm font-extrabold tabular-nums text-stone-900 dark:text-stone-50">
                {formatCOP(parseFloat(loan.principal))}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Plazo
              </p>
              <p className="text-sm font-bold tabular-nums text-stone-700 dark:text-stone-300">
                {loan.termMonths} meses
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Tasa anual
              </p>
              <p className="text-sm font-bold tabular-nums text-stone-700 dark:text-stone-300">
                {(parseFloat(loan.annualRate) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          <ProgressBar
            payments={loan.paymentsCount}
            total={loan.termMonths}
            status={loan.status}
          />

          <div className="flex items-center justify-end text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Ver detalle
            <ChevronRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
