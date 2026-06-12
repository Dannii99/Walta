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
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { formatCOP } from "@/lib/currency";
import {
  TYPE_LABELS,
  VERDICT_LABELS,
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

const TYPE_ICON_BG: Record<string, string> = {
  VEHICLE: "bg-[#617dd5]/15 text-[#617dd5]",
  PERSONAL: "bg-[#9333ea]/15 text-[#9333ea]",
  HOUSING: "bg-[#23ad1b]/15 text-[#23ad1b]",
  OTHER: "bg-[#737373]/15 text-[#737373]",
};

const VERDICT_ICON: Record<string, LucideIcon> = {
  APPROVED: CheckCircle2,
  WARNING: AlertTriangle,
  REJECTED: XCircle,
};

const VERDICT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: {
    bg: "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15",
    text: "text-[#23ad1b]",
    border: "border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  },
  WARNING: {
    bg: "bg-[#e7964d]/10 dark:bg-[#e7964d]/15",
    text: "text-[#e7964d]",
    border: "border-[#e7964d]/20 dark:border-[#e7964d]/20",
  },
  REJECTED: {
    bg: "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15",
    text: "text-[#e54d4d]",
    border: "border-[#e54d4d]/20 dark:border-[#e54d4d]/20",
  },
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
  const verdictColors = VERDICT_COLORS[dbVerdict];
  const VerdictIcon = VERDICT_ICON[dbVerdict];

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
        className="block bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow group"
      >
        {/* Header — gradient dark */}
        <div className="relative bg-gradient-to-r from-[#17181c] to-[#333438] rounded-t-2xl p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  TYPE_ICON_BG[simulation.type] ?? TYPE_ICON_BG.OTHER
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {typeLabel}
                </p>
                <h3 className="text-sm font-bold text-white truncate">
                  {simulation.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${verdictColors.bg} ${verdictColors.text} ${verdictColors.border}`}
              >
                <VerdictIcon className="h-3 w-3" />
                {verdictLabel}
              </span>
              <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-[#26be15] transition-colors shrink-0" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 space-y-4">
          {/* Cuota mensual */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-1">
              Cuota mensual
            </p>
            <p className="text-2xl md:text-3xl font-extrabold tabular-nums text-[#26be15] dark:text-[#26be15]">
              {formatCOP(result.monthlyPayment)}
            </p>
          </div>

          {/* 3-col compact stats */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
                Financiado
              </p>
              <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
                {formatCOP(principal)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
                Plazo
              </p>
              <p className="text-sm font-bold text-[#17181c] dark:text-white">
                {termYears} años
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-0.5">
                Tasa
              </p>
              <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
                {(inputs.rate * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 md:px-5 pb-4 md:pb-5 pt-0">
          <div className="flex items-center gap-1 text-[10px] text-[#737373] dark:text-[#a1a1aa] font-medium">
            <Calendar className="h-2.5 w-2.5" />
            <span>
              {new Intl.DateTimeFormat("es-CO", {
                day: "numeric",
                month: "short",
              }).format(new Date(simulation.createdAt))}
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            {labelOr(inputs.formula ?? "french_ea", FORMULA_LABELS)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
