"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { formatCOP } from "@/lib/currency";
import { labelOr, FORMULA_LABELS, type DbVerdict } from "@/lib/simulation-types";
import { VERDICT_CONFIG, type Verdict, getVerdict } from "@/lib/simulation-engine";

interface SimulationBreakdownProps {
  inputs: {
    price: number;
    downPayment: number;
    term: number;
    rate: number;
    formula?: string;
  };
  result: {
    monthlyPayment: number;
    verdict: string;
    availableAfter: number;
    totalInterest: number;
    totalCost: number;
  };
  availableMoney: number;
}

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "primary" | "destructive" | "muted";
}) {
  const valueClass =
    accent === "primary"
      ? "text-primary font-bold tabular-nums"
      : accent === "destructive"
      ? "text-rose-600 dark:text-rose-400 font-bold tabular-nums"
      : "font-semibold tabular-nums text-stone-900 dark:text-stone-50";

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <span className="text-sm text-stone-600 dark:text-stone-400 font-medium">
        {label}
      </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export function SimulationBreakdown({
  inputs,
  result,
  availableMoney,
}: SimulationBreakdownProps) {
  const principal = Math.max(0, inputs.price - inputs.downPayment);
  const termYears = (inputs.term / 12).toFixed(1);

  const dbToEngine: Record<DbVerdict, Verdict> = {
    APPROVED: "SAFE",
    WARNING: "TIGHT",
    REJECTED: "RISKY",
  };
  const engineVerdict = dbToEngine[result.verdict as DbVerdict] ?? "TIGHT";
  const verdictInfo = VERDICT_CONFIG[engineVerdict];

  const { percentage } = getVerdict(result.monthlyPayment, availableMoney);
  const remainingAfter = availableMoney - result.monthlyPayment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card>
        <CardContent className="p-5 md:p-6 space-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
              Resumen financiero
            </h3>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${verdictInfo.badge}`}
            >
              {verdictInfo.label} · {percentage.toFixed(1)}%
            </span>
          </div>

          <StatRow label="Precio" value={formatCOP(inputs.price)} />
          <StatRow label="Cuota inicial" value={formatCOP(inputs.downPayment)} />
          <StatRow
            label="Monto financiado"
            value={formatCOP(principal)}
            accent="primary"
          />
          <div className="border-t border-stone-200/80 dark:border-stone-800" />
          <StatRow
            label={`Plazo (${termYears} años)`}
            value={`${inputs.term} meses`}
          />
          <StatRow
            label="Tasa"
            value={`${(inputs.rate * 100).toFixed(2)}% EA`}
          />
          <StatRow
            label="Fórmula"
            value={labelOr(inputs.formula ?? "french_ea", FORMULA_LABELS)}
          />
          <div className="border-t border-stone-200/80 dark:border-stone-800" />
          <StatRow
            label="Cuota mensual"
            value={formatCOP(result.monthlyPayment)}
            accent="primary"
          />
          <StatRow
            label="Intereses totales"
            value={formatCOP(result.totalInterest)}
            accent="destructive"
          />
          <StatRow
            label="Costo total"
            value={formatCOP(result.totalCost)}
            accent="destructive"
          />
          <div className="border-t border-stone-200/80 dark:border-stone-800" />
          <StatRow
            label="Disponible actual"
            value={formatCOP(availableMoney)}
          />
          <StatRow
            label="Después de la cuota"
            value={formatCOP(remainingAfter)}
            accent={remainingAfter >= 0 ? "primary" : "destructive"}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
