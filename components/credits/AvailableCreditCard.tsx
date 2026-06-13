"use client";

import { Wallet, CreditCard, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatCOP } from "@/lib/currency";

interface AvailableCreditCardProps {
  income: number;
  availableMoney: number;
  activeLoansCount: number;
  activeLoansMonthly: number;
}

function getRatioTier(ratio: number): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  if (ratio < 20) {
    return {
      label: "Bajo",
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-900",
    };
  }
  if (ratio < 40) {
    return {
      label: "Moderado",
      bg: "bg-amber-100 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-900",
    };
  }
  return {
    label: "Alto",
    bg: "bg-rose-100 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900",
  };
}

export function AvailableCreditCard({
  income,
  availableMoney,
  activeLoansCount,
  activeLoansMonthly,
}: AvailableCreditCardProps) {
  const remainingCapacity = Math.max(0, availableMoney - activeLoansMonthly);
  const recommendedMax = remainingCapacity * 0.3;
  const isOvercommitted = availableMoney > 0 && activeLoansMonthly >= availableMoney;
  const isLow = remainingCapacity <= 0;
  const debtRatio = income > 0 ? (activeLoansMonthly / income) * 100 : 0;
  const tier = getRatioTier(debtRatio);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 md:p-6"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br from-violet-200/40 to-fuchsia-200/40 dark:from-violet-900/20 dark:to-fuchsia-900/20 blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Capacidad de crédito
            </p>
            <p className="text-[10px] text-stone-400 dark:text-stone-500">
              Después de gastos y cuotas activas
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
            {formatCOP(remainingCapacity)}
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
            disponible para nuevo crédito
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200/80 dark:border-stone-800">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Disponible
            </p>
            <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatCOP(availableMoney)}
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              post-gastos
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Cuotas activas
            </p>
            <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
              {formatCOP(activeLoansMonthly)}
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              {activeLoansCount === 0
                ? "sin créditos activos"
                : `${activeLoansCount} crédito${activeLoansCount === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {activeLoansCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${tier.bg} ${tier.text} ${tier.border}`}
            >
              <CreditCard className="h-3 w-3" strokeWidth={2.2} />
              Ratio {tier.label.toLowerCase()}
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tabular-nums">
              {debtRatio.toFixed(0)}% del ingreso comprometido
            </span>
          </div>
        )}

        {!isLow && !isOvercommitted && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-900/40">
            <TrendingUp className="h-3.5 w-3.5 text-violet-700 dark:text-violet-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                Recomendado
              </p>
              <p className="text-xs text-violet-900 dark:text-violet-200 leading-relaxed">
                Cuota máxima sugerida:{" "}
                <span className="font-bold tabular-nums">
                  {formatCOP(recommendedMax)}
                </span>{" "}
                (30% de la capacidad)
              </p>
            </div>
          </div>
        )}

        {isOvercommitted && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40">
            <AlertCircle className="h-3.5 w-3.5 text-rose-700 dark:text-rose-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                Tus cuotas activas ya igualan o superan tu dinero disponible.
                Evita adquirir nuevas deudas hasta liberar capacidad.
              </p>
            </div>
          </div>
        )}

        {isLow && !isOvercommitted && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <AlertCircle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                Tu capacidad para nueva deuda es baja. Considera reducir
                gastos o pagar créditos activos antes de tomar uno nuevo.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Sparkles className="h-3 w-3" />
          <span>Análisis IA al guardar</span>
        </div>
      </div>
    </motion.div>
  );
}
