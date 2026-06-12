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

const KPI_CONFIG = [
  {
    label: "Simulaciones",
    icon: Layers,
    bg: "bg-[#f5f5f5] dark:bg-white/5",
    text: "text-[#737373] dark:text-[#a1a1aa]",
  },
  {
    label: "Suma pagos/mes",
    icon: Wallet,
    bg: "bg-[#617dd5]/10 dark:bg-[#617dd5]/15",
    text: "text-[#617dd5] dark:text-[#617dd5]",
  },
  {
    label: "Viables",
    icon: CheckCircle2,
    bg: "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15",
    text: "text-[#23ad1b] dark:text-[#23ad1b]",
  },
  {
    label: "Arriesgadas",
    icon: AlertTriangle,
    bg: "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15",
    text: "text-[#e54d4d] dark:text-[#e54d4d]",
  },
] as const;

function KpiCard({
  label,
  value,
  icon: Icon,
  bg,
  text,
  index,
  isString = false,
}: {
  label: string;
  value: string | number;
  icon: typeof Layers;
  bg: string;
  text: string;
  index: number;
  isString?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 md:p-5"
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
          className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${bg} ${text}`}
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
  const values: (string | number)[] = [total, formatCOP(sumMonthlyPayments), viableCount, riskyCount];
  const isStrings = [false, true, false, false];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {KPI_CONFIG.map((config, index) => (
        <KpiCard
          key={config.label}
          label={config.label}
          value={values[index]}
          icon={config.icon}
          bg={config.bg}
          text={config.text}
          index={index}
          isString={isStrings[index]}
        />
      ))}
    </div>
  );
}
