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
  Sparkles,
  TrendingUp,
} from "lucide-react";
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

function getEmoji(status: Status): string {
  if (status === "healthy") return "😊";
  if (status === "warning") return "😐";
  return "😟";
}

const statusStyles: Record<
  Status,
  {
    gradient: string;
    softBg: string;
    border: string;
    ring: string;
    bar: string;
    text: string;
    label: string;
    shadow: string;
  }
> = {
  healthy: {
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    softBg: "from-emerald-50 via-green-50 to-teal-50",
    border: "border-emerald-300/60",
    ring: "ring-emerald-500/20",
    bar: "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500",
    text: "text-emerald-700",
    label: "text-emerald-800",
    shadow: "shadow-emerald-500/20",
  },
  warning: {
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    softBg: "from-amber-50 via-orange-50 to-yellow-50",
    border: "border-amber-300/60",
    ring: "ring-amber-500/20",
    bar: "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500",
    text: "text-amber-700",
    label: "text-amber-800",
    shadow: "shadow-amber-500/20",
  },
  critical: {
    gradient: "from-rose-500 via-red-500 to-pink-500",
    softBg: "from-rose-50 via-red-50 to-pink-50",
    border: "border-rose-300/60",
    ring: "ring-rose-500/20",
    bar: "[&>div]:bg-gradient-to-r [&>div]:from-rose-500 [&>div]:to-pink-500",
    text: "text-rose-700",
    label: "text-rose-800",
    shadow: "shadow-rose-500/20",
  },
};

const statusLabel: Record<Status, string> = {
  healthy: "Saludable",
  warning: "Ajustado",
  critical: "Excedido",
};

const StatusIcon = ({ status }: { status: Status }) => {
  if (status === "healthy") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "warning") return <AlertCircle className="h-3.5 w-3.5" />;
  return <AlertTriangle className="h-3.5 w-3.5" />;
};

interface HealthCardData {
  label: string;
  spent: number;
  limit: number;
  Icon: typeof Home;
}

function HealthCard({ label, spent, limit, Icon }: HealthCardData) {
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const status = getStatus(percentage);
  const styles = statusStyles[status];
  const emoji = getEmoji(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border-2 ${styles.border} bg-gradient-to-br ${styles.softBg} shadow-xl ${styles.shadow} ring-1 ${styles.ring}`}
    >
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${styles.gradient} opacity-15 blur-2xl`}
      />

      <div className="relative p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${styles.gradient} text-white shadow-md shrink-0`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider ${styles.label} truncate`}>
              {label}
            </p>
          </div>
          <div className="text-3xl leading-none filter drop-shadow-md shrink-0" aria-hidden>
            {emoji}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-extrabold tracking-tight tabular-nums bg-gradient-to-br ${styles.gradient} bg-clip-text text-transparent`}
          >
            {percentage.toFixed(0)}%
          </span>
          <span className={`text-xs font-medium ${styles.text}`}>del límite</span>
        </div>

        <Progress
          value={Math.min(percentage, 100)}
          className={`h-2.5 ${styles.bar}`}
        />

        <div className="flex items-center justify-between text-xs gap-2 flex-wrap">
          <span className={`font-medium ${styles.text} tabular-nums`}>
            {formatCOP(spent)}{" "}
            <span className="opacity-60">de {formatCOP(limit)}</span>
          </span>
          <span
            className={`flex items-center gap-1 font-bold uppercase tracking-wider ${styles.label} shrink-0`}
          >
            <StatusIcon status={status} />
            {statusLabel[status]}
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="space-y-0.5">
          <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
            Salud Financiera
          </h2>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Regla aplicada: <span className="font-bold text-foreground/80">{ruleName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/40 p-3.5 md:p-4 shadow-sm ring-1 ring-black/5"
      >
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-2xl" />
        <div className="relative flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-sm">
            <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Recomendación
            </p>
            <p className="text-sm text-foreground/80 font-medium leading-relaxed">
              {recommendation}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
