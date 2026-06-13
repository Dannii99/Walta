"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, type LucideIcon } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface KPICardProps {
  title: string;
  value: number;
  icon: "income" | "expenses" | "available" | "savings";
  subtitle?: string;
}

const ACCENT: Record<KPICardProps["icon"], string> = {
  income: "bg-blue-50 text-blue-700",
  expenses: "bg-rose-50 text-rose-700",
  available: "bg-emerald-50 text-emerald-700",
  savings: "bg-violet-50 text-violet-700",
};

const iconMap: Record<KPICardProps["icon"], LucideIcon> = {
  income: TrendingUp,
  expenses: TrendingDown,
  available: Wallet,
  savings: PiggyBank,
};

export function KPICard({ title, value, icon, subtitle }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const Icon = iconMap[icon];
  const accent = ACCENT[icon];

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.0,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(v),
    });
    return controls.stop;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 truncate">
          {title}
        </p>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${accent}`}>
          <Icon className="h-4 w-4" strokeWidth={2.3} />
        </div>
      </div>

      <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-stone-900">
        {formatCOP(displayValue)}
      </p>

      {subtitle && (
        <p className="text-[11px] text-stone-500 font-medium leading-snug">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
