"use client";

import { motion } from "framer-motion";
import { Landmark, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface CreditsKPIProps {
  total: number;
  active: number;
  paidOff: number;
  totalMonthlyPayment: number;
  defaulted: number;
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  index,
  isString = false,
}: {
  label: string;
  value: string | number;
  icon: typeof Landmark;
  color: string;
  index: number;
  isString?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl bg-white dark:bg-[#17181c] p-4 md:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] truncate">
            {label}
          </p>
          <p
            className={`text-xl md:text-2xl font-extrabold tracking-tight ${
              isString ? "tabular-nums" : ""
            } text-[#17181c] dark:text-white truncate`}
          >
            {value}
          </p>
        </div>
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
        >
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </div>
      </div>
    </motion.div>
  );
}

export function CreditsKPI({
  total,
  active,
  paidOff,
  totalMonthlyPayment,
  defaulted,
}: CreditsKPIProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <KpiCard
        label="Total"
        value={total}
        icon={Landmark}
        color="bg-[#f5f5f5] text-[#737373] dark:bg-white/5 dark:text-[#a1a1aa]"
        index={0}
      />
      <KpiCard
        label="Cuota mensual"
        value={formatCOP(totalMonthlyPayment)}
        icon={Wallet}
        color="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
        index={1}
        isString
      />
      <KpiCard
        label="Activos"
        value={active}
        icon={CheckCircle2}
        color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        index={2}
      />
      <KpiCard
        label={defaulted > 0 ? "En mora" : "Pagados"}
        value={defaulted > 0 ? defaulted : paidOff}
        icon={defaulted > 0 ? AlertTriangle : CheckCircle2}
        color={
          defaulted > 0
            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        }
        index={3}
      />
    </div>
  );
}
