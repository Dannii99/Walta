"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";
import {
  TrendingDown,
  Clock,
  PiggyBank,
  Sparkles,
  ArrowRight,
  Wallet,
} from "lucide-react";

type RecalcMode = "REDUCE_TERM" | "REDUCE_PAYMENT";

export interface CapitalImpactPrefill {
  amount: number;
  mode: RecalcMode;
  newTerm: number;
}

interface CapitalImpactSimulatorProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  onApplyPrefill?: (prefill: CapitalImpactPrefill) => void;
}

export function CapitalImpactSimulator({
  loan,
  onApplyPrefill,
}: CapitalImpactSimulatorProps) {
  const [simulatedAmount, setSimulatedAmount] = useState(0);
  const [simulatedMode, setSimulatedMode] = useState<RecalcMode>("REDUCE_TERM");
  const [simulatedNewTerm, setSimulatedNewTerm] = useState<number>(
    loan.termMonths
  );

  const scheduleOriginal = useMemo(
    () => generateAmortizationSchedule(loan, loan.payments, loan.extraPayments),
    [loan]
  );

  const remainingTerm = Math.max(
    1,
    loan.termMonths - (loan.paidInstallments ?? 0)
  );

  const scheduleWithAbono = useMemo(() => {
    if (simulatedAmount <= 0) return scheduleOriginal;

    const simulatedExtra: LoanExtraPayment = {
      id: "simulated",
      loanId: loan.id,
      amount: String(simulatedAmount),
      date: new Date(),
      recalculationMode: simulatedMode,
      newTermMonths: simulatedMode === "REDUCE_PAYMENT" ? simulatedNewTerm : null,
      createdAt: new Date(),
    };

    return generateAmortizationSchedule(loan, loan.payments, [
      ...loan.extraPayments,
      simulatedExtra,
    ]);
  }, [loan, simulatedAmount, simulatedMode, simulatedNewTerm, scheduleOriginal]);

  function effectiveTerm(rows: typeof scheduleOriginal): number {
    const paidOffIndex = rows.findIndex((r) => r.status === "PAID_OFF");
    return paidOffIndex >= 0 ? paidOffIndex + 1 : rows.length;
  }
  function payoffDate(rows: typeof scheduleOriginal): Date | null {
    const paidOffIndex = rows.findIndex((r) => r.status === "PAID_OFF");
    if (paidOffIndex >= 0) return rows[paidOffIndex].date;
    if (rows.length > 0) return rows[rows.length - 1].date;
    return null;
  }

  const originalTerm = effectiveTerm(scheduleOriginal);
  const newTerm = effectiveTerm(scheduleWithAbono);
  const monthsSaved = originalTerm - newTerm;

  const originalTotalInterest = scheduleOriginal.reduce(
    (sum, row) => sum + row.interest,
    0
  );
  const newTotalInterest = scheduleWithAbono.reduce(
    (sum, row) => sum + row.interest,
    0
  );
  const interestSaved = originalTotalInterest - newTotalInterest;

  const newPayoffDate = payoffDate(scheduleWithAbono);
  const originalPayoffDate = payoffDate(scheduleOriginal);

  const baseCuota = parseFloat(loan.monthlyPayment);
  const newCuota =
    simulatedMode === "REDUCE_PAYMENT" && simulatedAmount > 0
      ? scheduleWithAbono[Math.min(remainingTerm, scheduleWithAbono.length - 1)]
          ?.payment ?? baseCuota
      : baseCuota;
  const cuotaReduction = baseCuota - newCuota;

  const hasResults = simulatedAmount > 0;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#17181c] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 md:px-6 md:py-5 border-b border-[#e8e8e8] dark:border-[#2a2a2e]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PiggyBank className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#17181c] dark:text-white">
              Simulador de abono
            </h2>
            <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa]">
              Prueba cuánto ahorrarías con un abono extra
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 md:px-6 md:py-5 space-y-5">
        {/* Amount Input */}
        <div>
          <label className="text-xs font-semibold text-[#737373] dark:text-[#a1a1aa] mb-1.5 block">
            ¿Cuánto quieres abonar?
          </label>
          <CurrencyInput
            value={simulatedAmount}
            onValueChange={setSimulatedAmount}
            placeholder="$ 0"
          />
        </div>

        {/* Mode Selection */}
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xs font-semibold text-[#737373] dark:text-[#a1a1aa]">
              Efecto del abono
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSimulatedMode("REDUCE_TERM")}
                data-active={simulatedMode === "REDUCE_TERM"}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                  simulatedMode === "REDUCE_TERM"
                    ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] hover:border-[#d4d4d4] dark:hover:border-[#404040]"
                )}
              >
                <Clock
                  className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    simulatedMode === "REDUCE_TERM"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-[#737373]"
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      simulatedMode === "REDUCE_TERM"
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-[#17181c] dark:text-white"
                    )}
                  >
                    Reducir plazo
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
                    Misma cuota, pagas menos meses
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSimulatedMode("REDUCE_PAYMENT")}
                data-active={simulatedMode === "REDUCE_PAYMENT"}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                  simulatedMode === "REDUCE_PAYMENT"
                    ? "border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                    : "border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] hover:border-[#d4d4d4] dark:hover:border-[#404040]"
                )}
              >
                <TrendingDown
                  className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    simulatedMode === "REDUCE_PAYMENT"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-[#737373]"
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      simulatedMode === "REDUCE_PAYMENT"
                        ? "text-blue-800 dark:text-blue-300"
                        : "text-[#17181c] dark:text-white"
                    )}
                  >
                    Reducir cuota
                  </p>
                  <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa]">
                    Recalcula la cuota mensual
                  </p>
                </div>
              </button>
            </div>

            {simulatedMode === "REDUCE_PAYMENT" && (
              <div className="pt-2">
                <label className="text-xs font-semibold text-[#737373] dark:text-[#a1a1aa] mb-1.5 block">
                  Nuevo plazo restante (meses)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={360}
                  step={1}
                  value={simulatedNewTerm}
                  onChange={(e) =>
                    setSimulatedNewTerm(parseInt(e.target.value, 10) || 1)
                  }
                  className="bg-[#f5f5f5] dark:bg-white/5 border-[#e8e8e8] dark:border-[#2a2a2e] text-[#17181c] dark:text-white h-9"
                />
                <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] mt-1">
                  Plazo restante actual: {remainingTerm} meses
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 pt-2"
          >
            <div className="h-px bg-[#e8e8e8] dark:bg-[#2a2a2e]" />

            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Resultado esperado
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Months Saved */}
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Meses ahorrados
                  </span>
                </div>
                <p className="text-lg font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {monthsSaved > 0 ? monthsSaved : "—"}
                </p>
                {newPayoffDate && (
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5 leading-relaxed">
                    {originalPayoffDate && monthsSaved > 0 ? (
                      <>
                        {originalPayoffDate.toLocaleDateString("es-CO", { month: "short", year: "numeric" })}
                        {" → "}
                        <span className="font-semibold">
                          {newPayoffDate.toLocaleDateString("es-CO", { month: "short", year: "numeric" })}
                        </span>
                      </>
                    ) : (
                      newPayoffDate.toLocaleDateString("es-CO", { month: "short", year: "numeric" })
                    )}
                  </p>
                )}
              </div>

              {/* Interest Saved */}
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-3.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <PiggyBank className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Intereses ahorrados
                  </span>
                </div>
                <p className="text-lg font-extrabold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {formatCOP(interestSaved)}
                </p>
                {interestSaved > 0 && (
                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                    {monthsSaved > 0
                      ? `${monthsSaved} ${monthsSaved === 1 ? "mes" : "meses"} menos`
                      : "Sin cambio de plazo"}
                  </p>
                )}
              </div>

              {/* New Payment (if reduce payment) */}
              {simulatedMode === "REDUCE_PAYMENT" && (
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 p-3.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                      Nueva cuota
                    </span>
                  </div>
                  <p className="text-lg font-extrabold tabular-nums text-blue-700 dark:text-blue-300">
                    {formatCOP(newCuota)}
                  </p>
                  {cuotaReduction > 0 && (
                    <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                      {formatCOP(cuotaReduction)} menos al mes
                    </p>
                  )}
                </div>
              )}

              {/* Apply button */}
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() =>
                    onApplyPrefill?.({
                      amount: simulatedAmount,
                      mode: simulatedMode,
                      newTerm: simulatedNewTerm,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 h-10 text-xs font-bold rounded-xl bg-[#26be15] hover:bg-[#23ad1b] text-white transition-colors shadow-sm"
                >
                  <Wallet className="h-3.5 w-3.5" />
                  Aplicar abono de {formatCOP(simulatedAmount)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-4 text-center"
          >
            <div className="mx-auto h-12 w-12 rounded-2xl bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-[#737373] dark:text-[#a1a1aa]" />
            </div>
            <p className="text-sm font-semibold text-[#737373] dark:text-[#a1a1aa]">
              Ingresa un monto para simular
            </p>
            <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-1">
              Verás cuántos meses e intereses te ahorras.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
