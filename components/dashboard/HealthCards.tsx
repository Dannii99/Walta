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
  Trophy,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRecommendation } from "@/lib/dashboard-helpers";
import { computeSavingsHealth, type SavingsHealthStatus } from "@/lib/savings-health";

interface HealthCardsProps {
  ruleName: string;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsRate: number;
  income: number;
  monthlyEquivalentExpenses: number;
  reducedMotion?: boolean;
}

type StyleKey =
  | "healthy"
  | "warning"
  | "critical"
  | "aggressive"
  | "extraordinary"
  | "deficit";

function getSpendingStatus(percentage: number): StyleKey {
  if (percentage <= 85) return "healthy";
  if (percentage <= 100) return "warning";
  return "critical";
}

function savingsStatusToStyleKey(s: SavingsHealthStatus): StyleKey {
  if (s === "deficit" || s === "critical") return "deficit";
  if (s === "warming") return "warning";
  if (s === "healthy") return "healthy";
  if (s === "aggressive") return "aggressive";
  return "extraordinary";
}

const STYLE: Record<
  StyleKey,
  {
    bar: string;
    text: string;
    label: string;
    pill: string;
    emoji: string;
    barTrack: string;
    pillIcon: LucideIcon;
    borderAccent: string;
    ringClass: string;
  }
> = {
  healthy: {
    bar: "[&>div]:bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Saludable",
    pill: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    emoji: "😊",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: CheckCircle2,
    borderAccent: "bg-emerald-500",
    ringClass: "ring-emerald-500/30",
  },
  warning: {
    bar: "[&>div]:bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    label: "Ajustado",
    pill: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    emoji: "😐",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: AlertCircle,
    borderAccent: "bg-amber-500",
    ringClass: "ring-amber-500/30",
  },
  critical: {
    bar: "[&>div]:bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    label: "Excedido",
    pill: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    emoji: "😟",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: AlertTriangle,
    borderAccent: "bg-rose-500",
    ringClass: "ring-rose-500/30",
  },
  aggressive: {
    bar: "[&>div]:bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    label: "Agresivo",
    pill: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    emoji: "💪",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: Trophy,
    borderAccent: "bg-emerald-500",
    ringClass: "ring-emerald-500/30",
  },
  extraordinary: {
    bar: "[&>div]:bg-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    label: "Extraordinario",
    pill: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    emoji: "🌟",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: Sparkles,
    borderAccent: "bg-blue-500",
    ringClass: "ring-blue-500/30",
  },
  deficit: {
    bar: "[&>div]:bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    label: "Déficit",
    pill: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    emoji: "😟",
    barTrack: "bg-stone-100 dark:bg-stone-800",
    pillIcon: AlertTriangle,
    borderAccent: "bg-rose-500",
    ringClass: "ring-rose-500/30",
  },
};

const ICON_TONE: Record<string, { bg: string; text: string }> = {
  Necesidades: { bg: "bg-blue-50/70 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400" },
  Deseos: { bg: "bg-orange-50/70 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400" },
  Ahorro: { bg: "bg-emerald-50/70 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
};

interface HealthCardProps {
  label: string;
  styleKey: StyleKey;
  percentage: number;
  Icon: LucideIcon;
  subline?: React.ReactNode;
  showBarReference?: number;
  showPlusBadge?: boolean;
  reducedMotion?: boolean;
}

function HealthCard({
  label,
  styleKey,
  percentage,
  Icon,
  subline,
  showBarReference,
  showPlusBadge,
  reducedMotion,
}: HealthCardProps) {
  const styles = STYLE[styleKey];
  const PillIcon = styles.pillIcon;
  const barFill = Math.max(0, Math.min(percentage, 100));
  const reference = showBarReference != null
    ? Math.max(0, Math.min(showBarReference, 100))
    : null;

  const iconTone = ICON_TONE[label] ?? { bg: "bg-stone-100 dark:bg-stone-800", text: "text-stone-600 dark:text-stone-300" };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-stone-900/60 border border-[#E8E5E0]/60 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] p-5 sm:p-6 md:p-7 relative overflow-hidden hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-300"
    >
      <span
        className={cn(
          "absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full",
          styles.borderAccent
        )}
      />

      <div className="pl-2 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("flex h-7 w-7 items-center justify-center rounded-md shrink-0", iconTone.bg)}>
              <Icon className={cn("h-3.5 w-3.5", iconTone.text)} strokeWidth={2.3} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 truncate">
              {label}
            </p>
          </div>
          <span className="text-xl sm:text-2xl leading-none shrink-0" aria-hidden>
            {styles.emoji}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
            {percentage.toFixed(0)}%
          </span>
          {showPlusBadge && (
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tabular-nums text-stone-900 dark:text-stone-50">
              +
            </span>
          )}
        </div>

        <div className="relative pt-1">
          <Progress
            value={barFill}
            className={cn("h-1.5", styles.barTrack, styles.bar)}
          />
          {reference != null && (
            <>
              <span
                className="absolute top-0 h-1.5 w-px bg-stone-400 dark:bg-stone-500"
                style={{ left: `${reference}%` }}
                aria-hidden
              />
              <span
                className="absolute -top-3.5 text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 -translate-x-1/2 tabular-nums"
                style={{ left: `${reference}%` }}
              >
                Meta {reference}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          {subline ? (
            <span className={cn("text-[11px] font-medium", styles.text)}>
              {subline}
            </span>
          ) : (
            <span />
          )}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5",
              "text-[9px] font-bold uppercase tracking-wider",
              styles.pill
            )}
          >
            <PillIcon className="h-2.5 w-2.5" />
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
  savingsRate,
  income,
  monthlyEquivalentExpenses,
  reducedMotion,
}: HealthCardsProps) {
  const savingsHealth = computeSavingsHealth(
    income,
    monthlyEquivalentExpenses,
    savingsPct
  );

  const recommendation = getRecommendation(
    needsPct,
    wantsPct,
    savingsPct,
    needsSpent,
    wantsSpent,
    savingsRate
  );

  const needsPercentage = needsLimit > 0 ? (needsSpent / needsLimit) * 100 : 0;
  const wantsPercentage = wantsLimit > 0 ? (wantsSpent / wantsLimit) * 100 : 0;

  const needsSubline = (
    <>
      {formatCOP(needsSpent)}{" "}
      <span className="text-stone-400 dark:text-stone-500 font-medium">
        de {formatCOP(needsLimit)}
      </span>
    </>
  );
  const wantsSubline = (
    <>
      {formatCOP(wantsSpent)}{" "}
      <span className="text-stone-400 dark:text-stone-500 font-medium">
        de {formatCOP(wantsLimit)}
      </span>
    </>
  );
  const savingsSubline = (
    <span className="text-stone-600 dark:text-stone-300">
      Tasa de ahorro real este mes
    </span>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-900 dark:bg-stone-100" />
            Salud Financiera
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            Regla aplicada:{" "}
            <span className="font-bold text-stone-700 dark:text-stone-300">
              {ruleName}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <HealthCard
          label="Necesidades"
          styleKey={getSpendingStatus(needsPercentage)}
          percentage={needsPercentage}
          Icon={Home}
          subline={needsSubline}
          reducedMotion={reducedMotion}
        />
        <HealthCard
          label="Deseos"
          styleKey={getSpendingStatus(wantsPercentage)}
          percentage={wantsPercentage}
          Icon={Heart}
          subline={wantsSubline}
          reducedMotion={reducedMotion}
        />
        <HealthCard
          label="Ahorro"
          styleKey={savingsStatusToStyleKey(savingsHealth.status)}
          percentage={savingsHealth.barFillPct}
          Icon={PiggyBank}
          subline={savingsSubline}
          showBarReference={savingsPct}
          showPlusBadge={savingsHealth.rate > 100}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className="bg-[#F0EDE9]/60 dark:bg-stone-900/60 border border-[#E8E5E0]/60 dark:border-stone-800 rounded-xl p-4 sm:p-5 flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.3} />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Recomendación
          </p>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}
