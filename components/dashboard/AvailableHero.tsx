"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { TrendingUp, Wallet, PiggyBank, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MiniStatProps {
  label: string;
  value: number;
  icon: LucideIcon;
  borderLeft?: boolean;
  tone?: "default" | "warning" | "positive";
  isFirst?: boolean;
}

const TONE_STYLES: Record<NonNullable<MiniStatProps["tone"]>, { text: string; bg: string }> = {
  default: { text: "text-stone-700 dark:text-stone-300", bg: "bg-stone-100 dark:bg-stone-800" },
  warning: { text: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50/70 dark:bg-rose-950/30" },
  positive: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50/70 dark:bg-emerald-950/30" },
};

function MiniStat({ label, value, icon: Icon, borderLeft = false, tone = "default" }: MiniStatProps) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.0,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(display);

  const styles = TONE_STYLES[tone];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 px-3 md:px-4 py-2.5 md:py-3",
        borderLeft && "border-l border-[#E8E5E0]/60 dark:border-stone-800"
      )}
    >
      <div className="flex items-center gap-1.5">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md", styles.bg)}>
          <Icon className={cn("h-3.5 w-3.5", styles.text)} strokeWidth={2.2} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-sm sm:text-base md:text-xl font-extrabold tabular-nums tracking-tight",
          styles.text
        )}
      >
        {formatted}
      </p>
    </div>
  );
}

interface AvailableHeroProps {
  available: number;
  income: number;
  expenses: number;
  savingsCapacity: number;
  expensesPct: number;
  overBudget: boolean;
  onAddExpense: () => void;
  reducedMotion?: boolean;
}

export function AvailableHero({
  available,
  income,
  expenses,
  savingsCapacity,
  expensesPct,
  overBudget,
  onAddExpense,
  reducedMotion,
}: AvailableHeroProps) {
  const [displayAvailable, setDisplayAvailable] = useState(0);
  useEffect(() => {
    const controls = animate(0, available, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayAvailable(v),
    });
    return controls.stop;
  }, [available]);

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayAvailable);

  const expensesTone = overBudget ? "warning" : "default";

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-stone-900/60 border border-[#E8E5E0]/60 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 md:p-8">
        <div className="space-y-2 min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Tu dinero este mes
          </p>
          <p
            className={cn(
              "text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight tabular-nums leading-[1.05]",
              available < 0
                ? "text-rose-700 dark:text-rose-400"
                : "bg-gradient-to-br from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent"
            )}
          >
            {formatted}
          </p>
          <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-medium">
            {overBudget
              ? "Sobre el límite — revisa tus gastos."
              : available < 0
              ? "Estás en déficit este mes."
              : "Lo que puedes usar sin desbalancear el presupuesto."}
          </p>
        </div>
        <Button
          onClick={onAddExpense}
          className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm shrink-0 h-11 sm:h-10 text-sm sm:text-base px-5 sm:px-4"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-[#E8E5E0]/60 dark:border-stone-800 bg-[#F0EDE9]/50 dark:bg-stone-900/40">
        <MiniStat
          label="Ingreso"
          value={income}
          icon={TrendingUp}
          isFirst
        />
        <MiniStat
          label={`Gastos · ${expensesPct}%`}
          value={expenses}
          icon={Wallet}
          borderLeft
          tone={expensesTone}
        />
        <MiniStat
          label="Capacidad de ahorro"
          value={savingsCapacity}
          icon={PiggyBank}
          borderLeft
          tone={savingsCapacity > 0 ? "positive" : "default"}
        />
      </div>
    </motion.div>
  );
}
