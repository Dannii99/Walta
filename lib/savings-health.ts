import {
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type SavingsHealthStatus =
  | "deficit"
  | "critical"
  | "warming"
  | "healthy"
  | "aggressive"
  | "extraordinary";

export interface SavingsHealthInfo {
  status: SavingsHealthStatus;
  rate: number;
  barFillPct: number;
  label: string;
  message: string;
  pillClass: string;
  barClass: string;
  textClass: string;
  emoji: string;
  Icon: LucideIcon;
  ringClass: string;
  borderAccentClass: string;
}

interface StyleBundle {
  pillClass: string;
  barClass: string;
  textClass: string;
  ringClass: string;
  borderAccentClass: string;
  Icon: LucideIcon;
  emoji: string;
}

const STYLES: Record<SavingsHealthStatus, StyleBundle> = {
  deficit: {
    pillClass:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    barClass: "[&>div]:bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-400",
    ringClass: "ring-rose-500/30",
    borderAccentClass: "bg-rose-500",
    Icon: AlertTriangle,
    emoji: "😟",
  },
  critical: {
    pillClass:
      "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    barClass: "[&>div]:bg-rose-500",
    textClass: "text-rose-700 dark:text-rose-400",
    ringClass: "ring-rose-500/30",
    borderAccentClass: "bg-rose-500",
    Icon: AlertTriangle,
    emoji: "😟",
  },
  warming: {
    pillClass:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    barClass: "[&>div]:bg-amber-500",
    textClass: "text-amber-700 dark:text-amber-400",
    ringClass: "ring-amber-500/30",
    borderAccentClass: "bg-amber-500",
    Icon: Sparkles,
    emoji: "😐",
  },
  healthy: {
    pillClass:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    barClass: "[&>div]:bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
    ringClass: "ring-emerald-500/30",
    borderAccentClass: "bg-emerald-500",
    Icon: CheckCircle2,
    emoji: "😊",
  },
  aggressive: {
    pillClass:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    barClass: "[&>div]:bg-emerald-500",
    textClass: "text-emerald-700 dark:text-emerald-400",
    ringClass: "ring-emerald-500/30",
    borderAccentClass: "bg-emerald-500",
    Icon: Trophy,
    emoji: "💪",
  },
  extraordinary: {
    pillClass:
      "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    barClass: "[&>div]:bg-blue-500",
    textClass: "text-blue-700 dark:text-blue-400",
    ringClass: "ring-blue-500/30",
    borderAccentClass: "bg-blue-500",
    Icon: Sparkles,
    emoji: "🌟",
  },
};

export function classify(rate: number, ruleTargetPct: number): SavingsHealthStatus {
  if (rate < 0) return "deficit";
  if (rate < 10) return "critical";
  if (rate < ruleTargetPct) return "warming";
  if (rate < 60) return "healthy";
  if (rate <= 100) return "aggressive";
  return "extraordinary";
}

function buildInfo(
  status: SavingsHealthStatus,
  rate: number,
  ruleTargetPct: number
): SavingsHealthInfo {
  const styles = STYLES[status];
  const barFillPct = Math.max(0, Math.min(rate, 100));
  const targetPct = Math.max(0, Math.min(ruleTargetPct, 100));

  const label = (() => {
    switch (status) {
      case "deficit":
        return "Déficit";
      case "critical":
        return "Muy bajo";
      case "warming":
        return "Calentando";
      case "healthy":
        return "Saludable";
      case "aggressive":
        return "Agresivo";
      case "extraordinary":
        return "Extraordinario";
    }
  })();

  const message = (() => {
    switch (status) {
      case "deficit":
        return rate < 0
          ? "Estás gastando más de lo que ingresa. Reprioriza gastos."
          : "Sin ingresos registrados este mes.";
      case "critical":
        return "Tu capacidad de ahorro es muy baja. Revisa gastos en deseos.";
      case "warming":
        return `Casi llegas a tu meta de ${targetPct}% de ahorro. Un pequeño ajuste y lo logras.`;
      case "healthy":
        return "Vas muy bien. Tu tasa de ahorro está en rango saludable.";
      case "aggressive":
        return "Eres un ahorrador agresivo. No descuides tu calidad de vida.";
      case "extraordinary":
        return "Extraordinario. Estás ahorrando más que tus ingresos — ¿ingreso extra o bono?";
    }
  })();

  return {
    status,
    rate,
    barFillPct,
    label,
    message,
    pillClass: styles.pillClass,
    barClass: styles.barClass,
    textClass: styles.textClass,
    ringClass: styles.ringClass,
    borderAccentClass: styles.borderAccentClass,
    emoji: styles.emoji,
    Icon: styles.Icon,
  };
}

export function computeSavingsHealth(
  income: number,
  expenses: number,
  ruleTargetPct: number
): SavingsHealthInfo {
  if (income <= 0) {
    return buildInfo("deficit", 0, ruleTargetPct);
  }
  const rawRate = ((income - expenses) / income) * 100;
  const rate = Math.max(rawRate, -100);
  const status = classify(rate, ruleTargetPct);
  return buildInfo(status, rate, ruleTargetPct);
}
