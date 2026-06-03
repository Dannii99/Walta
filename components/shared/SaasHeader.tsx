"use client";

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
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  warning: {
    label: "Ajustado",
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  critical: {
    label: "Riesgoso",
    dot: "bg-orange-500",
    pill: "bg-orange-50 text-orange-700 border-orange-200",
  },
  deficit: {
    label: "Déficit",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[10px] font-bold uppercase tracking-wider",
        cfg.pill
      )}
    >
      <span className="relative inline-flex h-2 w-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            cfg.dot
          )}
        />
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
    <section className="space-y-3">
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs">
        <span className="text-stone-500 font-medium">
          {greeting}, <span className="font-bold text-stone-900">{userName}</span>
        </span>
        <span className="text-stone-300">·</span>
        <span className="text-stone-500 font-medium">{monthLabel}</span>
        <span className="ml-auto">
          <StatusBadge status={status} />
        </span>
      </div>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            {eyebrow}
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
            {budgetName}
          </h1>
        </div>
        {Icon && (
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600 shrink-0">
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </div>
        )}
      </div>

      <p className="text-sm md:text-[15px] text-stone-600 font-medium max-w-2xl leading-relaxed">
        {dynamicMessage}
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button
          onClick={onAddExpense}
          className="bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar gasto
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-stone-300 text-stone-700 hover:bg-stone-50"
        >
          <Link href="/settings">
            <Settings className="h-4 w-4 mr-1.5" />
            Ajustar presupuesto
          </Link>
        </Button>
      </div>
    </section>
  );
}
