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
    bar: "[&>div]:bg-[#23ad1b]",
    text: "text-[#23ad1b] dark:text-[#23ad1b]",
    label: "Saludable",
    pill: "bg-[#f0fdf4] text-[#23ad1b] border-[#23ad1b]/20 dark:bg-[#23ad1b]/10 dark:text-[#23ad1b] dark:border-[#23ad1b]/20",
    emoji: "😊",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: CheckCircle2,
    borderAccent: "bg-[#23ad1b]",
    ringClass: "ring-[#23ad1b]/20",
  },
  warning: {
    bar: "[&>div]:bg-[#e7964d]",
    text: "text-[#e7964d] dark:text-[#e7964d]",
    label: "Ajustado",
    pill: "bg-[#fffbeb] text-[#e7964d] border-[#e7964d]/20 dark:bg-[#e7964d]/10 dark:text-[#e7964d] dark:border-[#e7964d]/20",
    emoji: "😐",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: AlertCircle,
    borderAccent: "bg-[#e7964d]",
    ringClass: "ring-[#e7964d]/20",
  },
  critical: {
    bar: "[&>div]:bg-[#e54d4d]",
    text: "text-[#e54d4d] dark:text-[#e54d4d]",
    label: "Excedido",
    pill: "bg-[#fef2f2] text-[#e54d4d] border-[#e54d4d]/20 dark:bg-[#e54d4d]/10 dark:text-[#e54d4d] dark:border-[#e54d4d]/20",
    emoji: "😟",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: AlertTriangle,
    borderAccent: "bg-[#e54d4d]",
    ringClass: "ring-[#e54d4d]/20",
  },
  aggressive: {
    bar: "[&>div]:bg-[#23ad1b]",
    text: "text-[#23ad1b] dark:text-[#23ad1b]",
    label: "Agresivo",
    pill: "bg-[#f0fdf4] text-[#23ad1b] border-[#23ad1b]/20 dark:bg-[#23ad1b]/10 dark:text-[#23ad1b] dark:border-[#23ad1b]/20",
    emoji: "💪",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: Trophy,
    borderAccent: "bg-[#23ad1b]",
    ringClass: "ring-[#23ad1b]/20",
  },
  extraordinary: {
    bar: "[&>div]:bg-[#617dd5]",
    text: "text-[#617dd5] dark:text-[#617dd5]",
    label: "Extraordinario",
    pill: "bg-[#eff6ff] text-[#617dd5] border-[#617dd5]/20 dark:bg-[#617dd5]/10 dark:text-[#617dd5] dark:border-[#617dd5]/20",
    emoji: "🌟",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: Sparkles,
    borderAccent: "bg-[#617dd5]",
    ringClass: "ring-[#617dd5]/20",
  },
  deficit: {
    bar: "[&>div]:bg-[#e54d4d]",
    text: "text-[#e54d4d] dark:text-[#e54d4d]",
    label: "Déficit",
    pill: "bg-[#fef2f2] text-[#e54d4d] border-[#e54d4d]/20 dark:bg-[#e54d4d]/10 dark:text-[#e54d4d] dark:border-[#e54d4d]/20",
    emoji: "😟",
    barTrack: "bg-[#f0f0f0] dark:bg-[#1a1a1e]",
    pillIcon: AlertTriangle,
    borderAccent: "bg-[#e54d4d]",
    ringClass: "ring-[#e54d4d]/20",
  },
};

const ICON_TONE: Record<string, { bg: string; text: string }> = {
  Necesidades: { bg: "bg-[#617dd5]/10", text: "text-[#617dd5]" },
  Deseos: { bg: "bg-[#e7964d]/10", text: "text-[#e7964d]" },
  Ahorro: { bg: "bg-[#23ad1b]/10", text: "text-[#23ad1b]" },
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

  const iconTone = ICON_TONE[label] ?? { bg: "bg-[#f5f5f5]", text: "text-[#737373]" };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 sm:p-6 relative overflow-hidden"
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] truncate">
              {label}
            </p>
          </div>
          <span className="text-xl sm:text-2xl leading-none shrink-0" aria-hidden>
            {styles.emoji}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
            {percentage.toFixed(0)}%
          </span>
          {showPlusBadge && (
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold tabular-nums text-[#17181c] dark:text-white">
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
                className="absolute top-0 h-1.5 w-px bg-[#737373] dark:bg-[#a1a1aa]"
                style={{ left: `${reference}%` }}
                aria-hidden
              />
              <span
                className="absolute -top-3.5 text-[9px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] -translate-x-1/2 tabular-nums"
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
      <span className="text-[#a1a1aa] font-medium">
        de {formatCOP(needsLimit)}
      </span>
    </>
  );
  const wantsSubline = (
    <>
      {formatCOP(wantsSpent)}{" "}
      <span className="text-[#a1a1aa] font-medium">
        de {formatCOP(wantsLimit)}
      </span>
    </>
  );
  const savingsSubline = (
    <span className="text-[#737373] dark:text-[#a1a1aa]">
      Tasa de ahorro real este mes
    </span>
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#26be15]" />
            Salud Financiera
          </h2>
          <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
            Regla aplicada:{" "}
            <span className="font-bold text-[#17181c] dark:text-white">
              {ruleName}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
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

      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#17181c] dark:bg-white text-white dark:text-[#17181c]">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.3} />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Recomendación
          </p>
          <p className="text-xs sm:text-sm text-[#17181c] dark:text-white font-medium leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </section>
  );
}
