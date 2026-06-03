"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Car,
  CreditCard,
  Home,
  Wallet,
  type LucideIcon,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import {
  TYPE_LABELS,
  TYPE_ICON_BG,
  VERDICT_LABELS,
  VERDICT_PILL,
  type DbVerdict,
  labelOr,
  FORMULA_LABELS,
  type SimulationInputRow,
  type SimulationResultRow,
} from "@/lib/simulation-types";

const TYPE_ICON: Record<string, LucideIcon> = {
  VEHICLE: Car,
  PERSONAL: Wallet,
  HOUSING: Home,
  OTHER: CreditCard,
};

interface SimulationCardProps {
  simulation: {
    id: string;
    type: string;
    title: string;
    createdAt: string;
  };
  inputs: SimulationInputRow;
  result: SimulationResultRow;
}

export function SimulationCard({ simulation, inputs, result }: SimulationCardProps) {
  const Icon = TYPE_ICON[simulation.type] ?? CreditCard;
  const typeLabel = labelOr(simulation.type, TYPE_LABELS);
  const dbVerdict = (["APPROVED", "WARNING", "REJECTED"] as DbVerdict[]).includes(
    result.verdict as DbVerdict
  )
    ? (result.verdict as DbVerdict)
    : "WARNING";
  const verdictLabel = VERDICT_LABELS[dbVerdict];
  const verdictPill = VERDICT_PILL[dbVerdict];

  const principal = Math.max(0, inputs.price - inputs.downPayment);
  const termYears = (inputs.term / 12).toFixed(1);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/simulations/${simulation.id}`}
        className="block rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                TYPE_ICON_BG[simulation.type] ?? TYPE_ICON_BG.OTHER
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {typeLabel}
              </p>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate">
                {simulation.title}
              </h3>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors shrink-0" />
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Cuota mensual
            </p>
            <p className="text-lg font-extrabold tabular-nums text-stone-900 dark:text-stone-50">
              {formatCOP(result.monthlyPayment)}
            </p>
          </div>
          <div className="h-px bg-stone-200/80 dark:bg-stone-800" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Precio</span>
              <span className="font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {formatCOP(inputs.price)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Inicial</span>
              <span className="font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {formatCOP(inputs.downPayment)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Financiado</span>
              <span className="font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {formatCOP(principal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Plazo</span>
              <span className="font-semibold text-stone-700 dark:text-stone-200">
                {termYears} años
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Tasa</span>
              <span className="font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {(inputs.rate * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-500 dark:text-stone-400">Fórmula</span>
              <span className="font-semibold text-stone-700 dark:text-stone-200 text-[10px]">
                {labelOr(inputs.formula ?? "french_ea", FORMULA_LABELS)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 font-medium">
            <Calendar className="h-2.5 w-2.5" />
            <span>
              {new Intl.DateTimeFormat("es-CO", {
                day: "numeric",
                month: "short",
              }).format(new Date(simulation.createdAt))}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] font-bold uppercase tracking-wider ${verdictPill}`}
          >
            {verdictLabel}
          </Badge>
        </div>
      </Link>
    </motion.div>
  );
}
