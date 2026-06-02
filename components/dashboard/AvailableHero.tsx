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

const TONE_TEXT: Record<NonNullable<MiniStatProps["tone"]>, string> = {
  default: "text-stone-900",
  warning: "text-amber-700",
  positive: "text-emerald-700",
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
  }).format(display);

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-4 md:px-5 py-2",
        borderLeft && "border-l border-stone-200/60"
      )}
    >
      <div className="flex items-center gap-1.5 text-stone-500">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-base md:text-xl font-extrabold tabular-nums tracking-tight",
          TONE_TEXT[tone]
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
}

export function AvailableHero({
  available,
  income,
  expenses,
  savingsCapacity,
  expensesPct,
  overBudget,
  onAddExpense,
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
  }).format(displayAvailable);

  const expensesTone = overBudget ? "warning" : "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-6 md:p-8">
        <div className="space-y-2 min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Tu dinero este mes
          </p>
          <p
            className={cn(
              "text-4xl md:text-6xl font-extrabold tracking-tight tabular-nums leading-[1.05]",
              available < 0
                ? "text-rose-700"
                : "bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent"
            )}
          >
            {formatted}
          </p>
          <p className="text-xs md:text-sm text-stone-500 font-medium">
            {overBudget
              ? "Sobre el límite — revisa tus gastos."
              : available < 0
              ? "Estás en déficit este mes."
              : "Lo que puedes usar sin desbalancear el presupuesto."}
          </p>
        </div>
        <Button
          onClick={onAddExpense}
          className="bg-stone-900 text-white hover:bg-stone-800 shadow-sm shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-stone-200/60 bg-stone-50/30">
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
