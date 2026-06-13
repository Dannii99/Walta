"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Plus, Settings, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "healthy" | "warning" | "critical" | "deficit";
}

const STATUS_CONFIG: Record<
  StatusBadgeProps["status"],
  { label: string; dot: string; pill: string }
> = {
  healthy: {
    label: "Saludable",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  warning: {
    label: "Ajustado",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  critical: {
    label: "Riesgoso",
    dot: "bg-orange-500",
    pill: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900",
  },
  deficit: {
    label: "Déficit",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900",
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const reducedMotion = useReducedMotion();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-bold uppercase tracking-wider",
        cfg.pill
      )}
    >
      <span className="relative inline-flex h-2 w-2">
        {!reducedMotion && (
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              cfg.dot
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            cfg.dot
          )}
        />
      </span>
      {cfg.label}
    </span>
  );
}

interface SaasHeaderProps {
  userName: string;
  monthLabel: string;
  budgetName: string;
  dynamicMessage: string;
  status: "healthy" | "warning" | "critical" | "deficit";
  onAddExpense: () => void;
  icon?: LucideIcon;
  eyebrow?: string;
}

export function SaasHeader({
  userName,
  monthLabel,
  budgetName,
  dynamicMessage,
  status,
  onAddExpense,
  eyebrow = "Tu presupuesto",
  icon: Icon,
}: SaasHeaderProps) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  return (
    <section className="space-y-4">
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-sm">
          {greeting},{" "}
          <span className="font-bold text-stone-900 dark:text-stone-50">
            {userName}
          </span>
        </span>
        <span className="text-stone-300 dark:text-stone-600 hidden sm:inline">·</span>
        <span className="text-stone-500 dark:text-stone-400 font-medium text-xs sm:text-sm hidden sm:inline">
          {monthLabel}
        </span>
        <span className="ml-auto">
          <StatusBadge status={status} />
        </span>
      </div>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {eyebrow}
          </p>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
            {budgetName}
          </h1>
        </div>
        {Icon && (
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300 shrink-0">
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </div>
        )}
      </div>

      <p className="text-sm md:text-[15px] text-stone-600 dark:text-stone-400 font-medium max-w-2xl leading-relaxed">
        {dynamicMessage}
      </p>

      <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1">
        <Button
          onClick={onAddExpense}
          className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar gasto
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#E8E5E0] text-stone-700 hover:bg-[#F0EDE9]/60 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800/60"
        >
          <Link href="/reglas">
            <Settings className="h-4 w-4 mr-1.5" />
            Ajustar presupuesto
          </Link>
        </Button>
      </div>
    </section>
  );
}
