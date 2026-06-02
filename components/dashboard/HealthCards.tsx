"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { formatCOP } from "@/lib/currency";
import {
  Home,
  Heart,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecommendation } from "@/lib/dashboard-helpers";

interface HealthCardsProps {
  ruleName: string;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsSpent: number;
  savingsLimit: number;
}

type Status = "healthy" | "warning" | "critical";

function getStatus(percentage: number): Status {
  if (percentage <= 85) return "healthy";
  if (percentage <= 100) return "warning";
  return "critical";
}

const STATUS: Record<
  Status,
  {
    bar: string;
    text: string;
    label: string;
    pill: string;
    emoji: string;
    barTrack: string;
  }
> = {
  healthy: {
    bar: "[&>div]:bg-emerald-500",
    text: "text-emerald-700",
    label: "Saludable",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    emoji: "😊",
    barTrack: "bg-stone-100",
  },
  warning: {
    bar: "[&>div]:bg-amber-500",
    text: "text-amber-700",
    label: "Ajustado",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    emoji: "😐",
    barTrack: "bg-stone-100",
  },
  critical: {
    bar: "[&>div]:bg-rose-500",
    text: "text-rose-700",
    label: "Excedido",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
    emoji: "😟",
    barTrack: "bg-stone-100",
  },
};

interface HealthCardData {
  label: string;
  spent: number;
  limit: number;
  Icon: LucideIcon;
}

function HealthCard({ label, spent, limit, Icon }: HealthCardData) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const status = getStatus(percentage);
  const styles = STATUS[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 relative overflow-hidden"
    >
      <span
        className={cn(
          "absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full",
          status === "healthy" && "bg-emerald-500",
          status === "warning" && "bg-amber-500",
          status === "critical" && "bg-rose-500"
        )}
      />

      <div className="pl-2 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-100 text-stone-600 shrink-0">
              <Icon className="h-3.5 w-3.5" strokeWidth={2.3} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 truncate">
              {label}
            </p>
          </div>
          <span className="text-2xl leading-none shrink-0" aria-hidden>
            {styles.emoji}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-stone-900">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            del límite
          </span>
        </div>

        <Progress
          value={Math.min(percentage, 100)}
          className={cn("h-1.5", styles.barTrack, styles.bar)}
        />

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          <span className={cn("text-[11px] font-bold tabular-nums", styles.text)}>
            {formatCOP(spent)}{" "}
            <span className="text-stone-400 font-medium">de {formatCOP(limit)}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
              "text-[9px] font-bold uppercase tracking-wider",
              styles.pill
            )}
          >
            {status === "healthy" && <CheckCircle2 className="h-2.5 w-2.5" />}
            {status === "warning" && <AlertCircle className="h-2.5 w-2.5" />}
            {status === "critical" && <AlertTriangle className="h-2.5 w-2.5" />}
            {styles.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function HealthCards({
  ruleName,
  needsPct,
  wantsPct,
  savingsPct,
  needsSpent,
  needsLimit,
  wantsSpent,
  wantsLimit,
  savingsSpent,
  savingsLimit,
}: HealthCardsProps) {
  const recommendation = getRecommendation(
    needsPct,
    wantsPct,
    savingsPct,
    needsSpent,
    wantsSpent,
    savingsSpent
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-900" />
            Salud Financiera
          </h2>
          <p className="text-[11px] text-stone-500 font-medium">
            Regla aplicada: <span className="font-bold text-stone-700">{ruleName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <HealthCard
          label="Necesidades"
          spent={needsSpent}
          limit={needsLimit}
          Icon={Home}
        />
        <HealthCard
          label="Deseos"
          spent={wantsSpent}
          limit={wantsLimit}
          Icon={Heart}
        />
        <HealthCard
          label="Ahorro / Deuda"
          spent={savingsSpent}
          limit={savingsLimit}
          Icon={PiggyBank}
        />
      </div>

      <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-4 flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-900 text-white">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.3} />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Recomendación
          </p>
          <p className="text-sm text-stone-700 font-medium leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}
