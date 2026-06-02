"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/currency";
import {
  getHealthBadge,
  getHeroGradient,
  type HealthStatus,
} from "@/lib/dashboard-helpers";
import { Plus, Settings, Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  budgetName: string;
  monthLabel: string;
  available: number;
  income: number;
  monthlyEquivalentExpenses: number;
  status: HealthStatus;
  dynamicMessage: string;
  onAddExpense: () => void;
}

const StatusIcon = ({ status }: { status: HealthStatus }) => {
  if (status === "healthy") return <CheckCircle2 className="h-3.5 w-3.5" />;
  if (status === "warning" || status === "critical") return <AlertTriangle className="h-3.5 w-3.5" />;
  return <TrendingDown className="h-3.5 w-3.5" />;
};

export function HeroSection({
  budgetName,
  monthLabel,
  available,
  income,
  monthlyEquivalentExpenses,
  status,
  dynamicMessage,
  onAddExpense,
}: HeroSectionProps) {
  const palette = getHeroGradient(status);
  const badge = getHealthBadge(status);
  const overBudget = available < 0;
  const expensesPct = income > 0 ? ((monthlyEquivalentExpenses / income) * 100).toFixed(0) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${palette.card} p-6 md:p-8 shadow-xl ring-1 ring-black/5`}
    >
      <div
        className={`absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${palette.blobA} blur-3xl`}
      />
      <div
        className={`absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gradient-to-br ${palette.blobB} blur-2xl`}
      />

      <div className="relative space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              {monthLabel}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full border ${badge.border} ${badge.bg} px-3 py-1 ring-1 ${badge.ring}`}
          >
            <span className={`bg-gradient-to-br ${badge.gradient} bg-clip-text text-transparent`}>
              <StatusIcon status={status} />
            </span>
            <span
              className={`bg-gradient-to-br ${badge.gradient} bg-clip-text text-transparent`}
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                {badge.label}
              </span>
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tu dinero este mes
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-foreground/90">
            {budgetName}
          </h1>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {overBudget ? "Te hace falta" : "Dinero disponible"}
          </p>
          <div
            className={`mt-1 text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight tabular-nums bg-gradient-to-br ${palette.numberGradient} bg-clip-text text-transparent`}
          >
            {formatCOP(Math.abs(available))}
          </div>
        </div>

        <div className="flex items-start gap-2 max-w-2xl">
          <p className="text-sm text-foreground/70 font-medium leading-relaxed">
            {dynamicMessage}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            onClick={onAddExpense}
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Agregar gasto
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border/80 bg-background/60 backdrop-blur hover:bg-background"
          >
            <Link href="/settings">
              <Settings className="h-4 w-4 mr-1.5" />
              Ajustar presupuesto
            </Link>
          </Button>
          <div className="hidden sm:flex items-center gap-1.5 ml-auto text-xs font-semibold text-muted-foreground">
            {overBudget ? (
              <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <span>
              {expensesPct}% del ingreso comprometido
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
