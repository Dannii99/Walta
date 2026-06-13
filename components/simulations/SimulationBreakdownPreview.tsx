"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import { labelOr, FORMULA_LABELS } from "@/lib/simulation-types";
import { VERDICT_CONFIG, type Verdict } from "@/lib/simulation-engine";
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

interface SimulationBreakdownPreviewProps {
  inputs: {
    price: number;
    downPayment: number;
    term: number;
    rate: number;
    formula?: string;
  };
  result: {
    monthlyPayment: number;
    effectiveMonthlyPayment: number;
    totalMonthlyFees: number;
    totalUpfrontFees: number;
    verdict: Verdict;
    percentage: number;
    remainingAfter: number;
    totalInterest: number;
    totalCost: number;
  };
  availableMoney: number;
  fees: FeeItem[];
}

const VERDICT_ICON: Record<string, typeof CheckCircle2> = {
  SAFE: CheckCircle2,
  TIGHT: AlertTriangle,
  RISKY: XCircle,
  NOT_RECOMMENDED: XCircle,
};

const VERDICT_BADGE: Record<string, string> = {
  SAFE: "bg-[#23ad1b]/10 text-[#23ad1b] border-[#23ad1b]/20 dark:bg-[#23ad1b]/15 dark:text-[#23ad1b] dark:border-[#23ad1b]/20",
  TIGHT: "bg-[#e7964d]/10 text-[#e7964d] border-[#e7964d]/20 dark:bg-[#e7964d]/15 dark:text-[#e7964d] dark:border-[#e7964d]/20",
  RISKY: "bg-[#e7964d]/10 text-[#e7964d] border-[#e7964d]/20 dark:bg-[#e7964d]/15 dark:text-[#e7964d] dark:border-[#e7964d]/20",
  NOT_RECOMMENDED: "bg-[#e54d4d]/10 text-[#e54d4d] border-[#e54d4d]/20 dark:bg-[#e54d4d]/15 dark:text-[#e54d4d] dark:border-[#e54d4d]/20",
};

const VERDICT_LABEL: Record<string, string> = {
  SAFE: "Seguro",
  TIGHT: "Ajustado",
  RISKY: "Riesgoso",
  NOT_RECOMMENDED: "No Recomendado",
};

export function SimulationBreakdownPreview({
  inputs,
  result,
  availableMoney,
  fees,
}: SimulationBreakdownPreviewProps) {
  const principal = Math.max(0, inputs.price - inputs.downPayment);
  const termYears = (inputs.term / 12).toFixed(1);
  const verdictInfo = VERDICT_CONFIG[result.verdict];
  const VerdictIcon = VERDICT_ICON[result.verdict];
  const verdictBadge = VERDICT_BADGE[result.verdict];
  const verdictLabel = VERDICT_LABEL[result.verdict];
  const hasFees = fees.length > 0;
  const hasMonthlyFees = result.totalMonthlyFees > 0;
  const hasUpfrontFees = result.totalUpfrontFees > 0;

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
                  Resumen financiero
                </h3>
                <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] mt-0.5">
                  Vista previa en tiempo real
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 ${verdictBadge}`}
            >
              <VerdictIcon className="h-3 w-3" />
              {verdictLabel}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 md:px-6 py-4 space-y-1">
          {/* DETALLE DEL PRÉSTAMO */}
          <SectionLabel>Detalle del préstamo</SectionLabel>
          <Row label="Precio" value={formatCOP(inputs.price)} />
          <Row label="Cuota inicial" value={formatCOP(inputs.downPayment)} />
          <HighlightRow label="Monto financiado" value={formatCOP(principal)} />

          <DashedLine />

          {/* CONDICIONES */}
          <SectionLabel>Condiciones</SectionLabel>
          <Row label="Plazo" value={`${inputs.term} meses (${termYears} años)`} />
          <Row label="Tasa" value={`${(inputs.rate * 100).toFixed(2)}% EA`} />
          <Row label="Fórmula" value={labelOr(inputs.formula ?? "french_ea", FORMULA_LABELS)} />

          <DashedLine />

          {/* RESULTADO */}
          <SectionLabel>Resultado</SectionLabel>
          <HeroRow
            label="Cuota mensual"
            value={formatCOP(result.monthlyPayment)}
            color={result.remainingAfter >= 0 ? "green" : "red"}
          />
          {hasMonthlyFees && (
            <FeeRow
              label="Cargos mensuales"
              value={`+ ${formatCOP(result.totalMonthlyFees)}`}
            />
          )}
          {hasFees && hasMonthlyFees && (
            <HighlightRow
              label="Cuota efectiva mensual"
              value={formatCOP(result.effectiveMonthlyPayment)}
              color={result.remainingAfter >= 0 ? "green" : "red"}
            />
          )}
          <CostRow label="Intereses totales" value={formatCOP(result.totalInterest)} />
          {hasUpfrontFees && (
            <CostRow label="Cargos iniciales" value={formatCOP(result.totalUpfrontFees)} />
          )}
          <CostRow label="Costo total" value={formatCOP(result.totalCost)} />

          <DashedLine />

          {/* DISPONIBILIDAD */}
          <SectionLabel>Disponibilidad</SectionLabel>
          <Row label="Disponible actual" value={formatCOP(availableMoney)} />
          <HighlightRow
            label="Después de la cuota"
            value={formatCOP(result.remainingAfter)}
            color={result.remainingAfter >= 0 ? "green" : "red"}
          />

          {/* Verdict bar */}
          <div className="mt-5 pt-4 border-t border-dashed border-[#e8e8e8] dark:border-[#2a2a2e]">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                    Pago respecto a disponible
                  </span>
                  <span className={`text-sm font-bold tabular-nums ${verdictInfo.color}`}>
                    {result.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#f5f5f5] dark:bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#26be15]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(result.percentage, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-2 leading-relaxed">
              {verdictInfo.description}
            </p>
          </div>
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
