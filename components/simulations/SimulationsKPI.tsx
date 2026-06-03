"use client";

import { motion } from "framer-motion";
import { Layers, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface SimulationsKPIProps {
  total: number;
  sumMonthlyPayments: number;
  viableCount: number;
  riskyCount: number;
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
  icon: typeof Layers;
  color: string;
  index: number;
  isString?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 md:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
            {label}
          </p>
          <p
            className={`text-xl md:text-2xl font-extrabold tracking-tight ${
              isString ? "tabular-nums" : ""
            } text-stone-900 dark:text-stone-50 truncate`}
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

export function SimulationsKPI({
  total,
  sumMonthlyPayments,
  viableCount,
  riskyCount,
}: SimulationsKPIProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <KpiCard
        label="Simulaciones"
        value={total}
        icon={Layers}
        color="bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
        index={0}
      />
      <KpiCard
        label="Suma pagos/mes"
        value={formatCOP(sumMonthlyPayments)}
        icon={Wallet}
        color="bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
        index={1}
        isString
      />
      <KpiCard
        label="Viables"
        value={viableCount}
        icon={CheckCircle2}
        color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        index={2}
      />
      <KpiCard
        label="Arriesgadas"
        value={riskyCount}
        icon={AlertTriangle}
        color="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
        index={3}
      />
    </div>
  );
}
