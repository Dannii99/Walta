"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Sparkles } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface KPICardProps {
  title: string;
  value: number;
  icon: "income" | "expenses" | "available" | "savings";
  subtitle?: string;
}

const variantMap = {
  income: {
    gradient: "from-blue-500 via-blue-600 to-indigo-600",
    softBg: "from-blue-50 via-indigo-50 to-blue-50",
    border: "border-blue-200/60",
    text: "text-blue-700",
    glow: "shadow-blue-500/20",
    ring: "ring-blue-500/20",
    label: "text-blue-900",
    accent: "text-blue-600",
  },
  expenses: {
    gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
    softBg: "from-rose-50 via-pink-50 to-rose-50",
    border: "border-rose-200/60",
    text: "text-rose-700",
    glow: "shadow-rose-500/20",
    ring: "ring-rose-500/20",
    label: "text-rose-900",
    accent: "text-rose-600",
  },
  available: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    softBg: "from-emerald-50 via-teal-50 to-emerald-50",
    border: "border-emerald-200/60",
    text: "text-emerald-700",
    glow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/20",
    label: "text-emerald-900",
    accent: "text-emerald-600",
  },
  savings: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-600",
    softBg: "from-violet-50 via-purple-50 to-fuchsia-50",
    border: "border-violet-200/60",
    text: "text-violet-700",
    glow: "shadow-violet-500/20",
    ring: "ring-violet-500/20",
    label: "text-violet-900",
    accent: "text-violet-600",
  },
} as const;

const iconMap = {
  income: TrendingUp,
  expenses: TrendingDown,
  available: Wallet,
  savings: PiggyBank,
};

const footerLabel = {
  income: "Base del mes",
  expenses: "Equiv. mensual",
  available: "Libre para usar",
  savings: "Ahorro potencial",
} as const;

export function KPICard({ title, value, icon, subtitle }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const styles = variantMap[icon];
  const Icon = iconMap[icon];

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(v),
    });
    return controls.stop;
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border ${styles.border} bg-gradient-to-br ${styles.softBg} shadow-lg ${styles.glow} ring-1 ${styles.ring}`}
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${styles.gradient} opacity-20 blur-2xl`}
      />
      <div
        className={`absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-gradient-to-br ${styles.gradient} opacity-10 blur-xl`}
      />

      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0 flex-1">
            <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wider ${styles.accent} truncate`}>
              {title}
            </p>
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradient} text-white shadow-md ${styles.glow}`}
          >
            <Icon className="h-5 w-5" strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-1">
          <div
            className={`text-3xl md:text-[2rem] font-extrabold tracking-tight tabular-nums bg-gradient-to-br ${styles.gradient} bg-clip-text text-transparent leading-tight`}
          >
            {formatCOP(displayValue)}
          </div>
          {subtitle && (
            <p className={`text-xs font-medium ${styles.text} leading-snug`}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 pt-1">
          <Sparkles className={`h-3 w-3 ${styles.accent}`} />
          <span className={`text-[10px] font-medium uppercase tracking-wider ${styles.accent}`}>
            {footerLabel[icon]}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
