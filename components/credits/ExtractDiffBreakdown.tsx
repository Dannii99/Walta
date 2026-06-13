"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, AlertCircle, Info, Sparkles } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import {
  CALIBRATION_CONFIG,
  type LoanCalibration,
} from "@/lib/credit-engine";
import { cn } from "@/lib/utils";

interface ExtractDiffBreakdownProps {
  calibration: LoanCalibration;
}

const ICONS = {
  check: Check,
  warn: AlertTriangle,
  alert: AlertCircle,
  info: Info,
} as const;

export function ExtractDiffBreakdown({ calibration }: ExtractDiffBreakdownProps) {
  const config = CALIBRATION_CONFIG[calibration.status];
  const Icon = ICONS[config.icon];

  const breakdownRows = [
    {
      label: "Cuota calculada por Walta",
      value: calibration.calculatedMonthly,
      muted: true,
    },
    {
      label: "+ Cargos mensuales (÷ 12)",
      value: calibration.feesMonthly,
      muted: true,
    },
    {
      label: "Cuota esperada",
      value: calibration.expectedMonthly,
      muted: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
              Comparación de cuota
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
              Lo que calculamos vs lo que ves en tu extracto
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shrink-0",
            config.badge
          )}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
          {config.label}
        </span>
      </div>

      <div className="rounded-xl border border-[#e8e8e8]/60 dark:border-[#2a2a2e] overflow-hidden">
        <div className="divide-y divide-[#e8e8e8]/60 dark:divide-[#2a2a2e]">
          {breakdownRows.map((row, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm",
                row.muted
                  ? "bg-[#fafafa] dark:bg-[#1a1a1e]/50"
                  : "bg-white dark:bg-[#17181c] font-semibold"
              )}
            >
              <span
                className={cn(
                  row.muted
                    ? "text-[#737373] dark:text-[#a1a1aa]"
                    : "text-[#17181c] dark:text-white"
                )}
              >
                {row.label}
              </span>
              <span
                className={cn(
                  "tabular-nums",
                  row.muted
                    ? "text-[#17181c] dark:text-white"
                    : "text-[#17181c] dark:text-white font-bold"
                )}
              >
                {formatCOP(row.value)}
              </span>
            </div>
          ))}

          {calibration.actualMonthlyPayment !== null && (
            <>
              <div className="flex items-center justify-between px-4 py-2.5 text-sm bg-blue-50/50 dark:bg-blue-950/20">
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  Cuota de tu extracto
                </span>
                <span className="font-bold tabular-nums text-blue-900 dark:text-blue-100">
                  {formatCOP(calibration.actualMonthlyPayment)}
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-sm",
                  calibration.status === "MATCH"
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                    : calibration.status === "MINOR"
                    ? "bg-amber-50/50 dark:bg-amber-950/20"
                    : "bg-rose-50/50 dark:bg-rose-950/20"
                )}
              >
                <span
                  className={cn(
                    "font-semibold",
                    calibration.status === "MATCH"
                      ? "text-emerald-700 dark:text-emerald-300"
                      : calibration.status === "MINOR"
                      ? "text-amber-700 dark:text-amber-300"
                      : "text-rose-700 dark:text-rose-300"
                  )}
                >
                  Diferencia
                </span>
                <span
                  className={cn(
                    "font-bold tabular-nums",
                    calibration.status === "MATCH"
                      ? "text-emerald-900 dark:text-emerald-100"
                      : calibration.status === "MINOR"
                      ? "text-amber-900 dark:text-amber-100"
                      : "text-rose-900 dark:text-rose-100"
                  )}
                >
                  {calibration.diff !== null && calibration.diff > 0 ? "+" : ""}
                  {formatCOP(calibration.diff ?? 0)}
                  {calibration.diffPct !== null && (
                    <span className="ml-1 text-xs font-medium opacity-75">
                      ({calibration.diffPct > 0 ? "+" : ""}
                      {calibration.diffPct.toFixed(2)}%)
                    </span>
                  )}
                </span>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {calibration.reason && (
        <div
          className={cn(
            "rounded-xl border p-3 text-xs",
            calibration.status === "MINOR"
              ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/60 text-amber-800 dark:text-amber-200"
              : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/60 text-rose-800 dark:text-rose-200"
          )}
        >
          <p className="leading-relaxed">{calibration.reason}</p>
        </div>
      )}

      {calibration.status === "UNKNOWN" && (
        <div className="rounded-xl border border-[#e8e8e8]/60 dark:border-[#2a2a2e] bg-[#fafafa] dark:bg-[#1a1a1e]/50 p-3 text-xs text-[#737373] dark:text-[#a1a1aa]">
          <p className="leading-relaxed">
            Ingresa la cuota exacta que aparece en tu extracto bancario para
            validar que nuestros cálculos coincidan.
          </p>
        </div>
      )}
    </div>
  );
}
