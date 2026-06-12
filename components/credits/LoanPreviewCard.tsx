"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import { calculateTotalMonthlyFees } from "@/lib/loan-fees";
import type { FeeItem } from "@/types";
import {
  DashedLine,
  SectionLabel,
  Row,
  HighlightRow,
  HeroRow,
  CostRow,
  FeeRow,
} from "@/components/shared/BreakdownRows";

interface LoanPreviewCardProps {
  principal: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  availableMoney?: number;
  fees?: FeeItem[];
  previousExtraPayment?: { amount: number; date: Date } | null;
}

function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function LoanPreviewCard({
  principal,
  monthlyPayment,
  totalInterest,
  totalCost,
  availableMoney,
  fees = [],
  previousExtraPayment = null,
}: LoanPreviewCardProps) {
  const monthlyFees = calculateTotalMonthlyFees(fees);
  const totalMonthlyPayment = monthlyPayment + monthlyFees;
  const hasPrevExtra =
    previousExtraPayment && previousExtraPayment.amount > 0;
  const remainingBalance = hasPrevExtra
    ? Math.max(0, principal - previousExtraPayment.amount)
    : principal;
  const outstandingTotal = hasPrevExtra
    ? Math.max(0, totalCost - previousExtraPayment.amount)
    : totalCost;

  const percentageOfBudget =
    availableMoney && availableMoney > 0
      ? (totalMonthlyPayment / availableMoney) * 100
      : 0;

  const isSafe = percentageOfBudget <= 30;
  const isTight = percentageOfBudget <= 50 && !isSafe;
  const isRisky = percentageOfBudget > 50;

  const capacityBadge = isSafe
    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
    : isTight
      ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
      : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900";

  const capacityLabel = isSafe ? "Cómodo" : isTight ? "Ajustado" : "Riesgoso";
  const CapacityIcon = isSafe ? CheckCircle2 : AlertTriangle;
  const capacityColor = isSafe ? "green" : isRisky ? "red" : "green";

  const monthlyFeeItems = fees.filter((f) => f.type === "monthly");
  const hasMonthlyFees = monthlyFeeItems.length > 0;
  const hasUpfrontFees = fees.some((f) => f.type === "upfront");
  const totalUpfrontFees = fees
    .filter((f) => f.type === "upfront")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-dashed border-[#e8e8e8] dark:border-[#2a2a2e]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-[#26be15]/10 dark:bg-[#26be15]/15 flex items-center justify-center shrink-0">
                <FileText className="h-4.5 w-4.5 text-[#26be15]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#17181c] dark:text-white leading-tight">
                  Tu crédito calculado
                </h3>
                <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] mt-0.5">
                  Vista previa en tiempo real
                </p>
              </div>
            </div>
            {availableMoney !== undefined && availableMoney > 0 && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 ${capacityBadge}`}
              >
                <CapacityIcon className="h-3 w-3" />
                {capacityLabel}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-5 md:px-6 py-4 space-y-1">
          {/* DETALLE DEL PRÉSTAMO */}
          <SectionLabel>Detalle del préstamo</SectionLabel>
          <Row label="Capital a financiar" value={formatCOP(principal)} />
          {hasPrevExtra && (
            <HighlightRow
              label="Saldo después de abonos"
              value={formatCOP(remainingBalance)}
              color="green"
            />
          )}

          <DashedLine />

          {/* RESULTADO */}
          <SectionLabel>Resultado</SectionLabel>
          <HeroRow
            label="Cuota mensual"
            value={formatCOP(monthlyPayment)}
            color={capacityColor}
          />
          {hasMonthlyFees && (
            <FeeRow
              label="Cargos mensuales"
              value={`+ ${formatCOP(monthlyFees)}`}
            />
          )}
          {hasMonthlyFees && (
            <HighlightRow
              label="Cuota efectiva mensual"
              value={formatCOP(totalMonthlyPayment)}
              color={capacityColor}
            />
          )}
          <CostRow label="Intereses totales" value={formatCOP(totalInterest)} />
          {hasUpfrontFees && (
            <CostRow label="Cargos iniciales" value={formatCOP(totalUpfrontFees)} />
          )}
          <CostRow label="Costo total" value={formatCOP(totalCost)} />
          {hasPrevExtra && (
            <CostRow label="Total restante a pagar" value={formatCOP(outstandingTotal)} />
          )}

          <DashedLine />

          {/* DISPONIBILIDAD */}
          {availableMoney !== undefined && availableMoney > 0 && (
            <>
              <SectionLabel>Disponibilidad</SectionLabel>
              <Row label="Disponible actual" value={formatCOP(availableMoney)} />
              <HighlightRow
                label="Después de la cuota"
                value={formatCOP(Math.max(0, availableMoney - totalMonthlyPayment))}
                color={capacityColor}
              />

              {/* Capacity bar */}
              <div className="mt-4 pt-4 border-t border-dashed border-[#e8e8e8] dark:border-[#2a2a2e]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                    Pago respecto a disponible
                  </span>
                  <span className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
                    {percentageOfBudget.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f5f5f5] dark:bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#26be15]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(percentageOfBudget, 100)}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-2 leading-relaxed">
                  {isSafe
                    ? "Tu cuota representa un porcentaje saludable de tu presupuesto disponible."
                    : isTight
                      ? "Tu cuota consume una parte significativa de tu presupuesto. Considera reducir el plazo o el monto."
                      : "Tu cuota excede el 50% de tu presupuesto disponible. Esto es financieramente riesgoso."}
                </p>
              </div>
            </>
          )}

          {/* Previous extra payment */}
          {hasPrevExtra && (
            <>
              <DashedLine />
              <SectionLabel>Abono a capital previo</SectionLabel>
              <Row
                label="Fecha"
                value={formatShortDate(previousExtraPayment.date)}
              />
              <Row
                label="Monto"
                value={formatCOP(previousExtraPayment.amount)}
              />
            </>
          )}
        </div>

        {/* Tear line */}
        <div className="relative h-4 bg-[#f5f5f5] dark:bg-[#17181c] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-2 flex items-center">
            <div className="w-full border-t border-dashed border-[#d4d4d4] dark:border-[#404040]" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="flex gap-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#e8e8e8] dark:bg-[#2a2a2e]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
