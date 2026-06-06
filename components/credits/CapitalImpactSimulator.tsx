"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";
import {
  TrendingDown,
  Clock,
  PiggyBank,
  ArrowRight,
} from "lucide-react";

type RecalcMode = "REDUCE_TERM" | "REDUCE_PAYMENT";

export interface CapitalImpactPrefill {
  amount: number;
  mode: RecalcMode;
  newTerm: number;
}

interface CapitalImpactSimulatorProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  /**
   * Callback que el simulador invoca cuando el usuario hace click en
   * "Aplicar este abono". El padre debe levantar el estado del Dialog
   * controlado y pre-llenar el form con los valores sugeridos.
   */
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

  const originalTerm = scheduleOriginal.length;
  const newTerm = scheduleWithAbono.length;
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

  const originalPayoffDate =
    scheduleOriginal.length > 0
      ? scheduleOriginal[scheduleOriginal.length - 1].date
      : null;
  const newPayoffDate =
    scheduleWithAbono.length > 0
      ? scheduleWithAbono[scheduleWithAbono.length - 1].date
      : null;

  // The "new cuota" is the payment of the first row AFTER the extra's
  // effective month. For REDUCE_TERM, this is the same as the base cuota.
  // For REDUCE_PAYMENT, it's the recalculated value.
  const baseCuota = parseFloat(loan.monthlyPayment);
  const newCuota =
    simulatedMode === "REDUCE_PAYMENT" && simulatedAmount > 0
      ? scheduleWithAbono[Math.min(remainingTerm, scheduleWithAbono.length - 1)]
          ?.payment ?? baseCuota
      : baseCuota;
  const cuotaReduction = baseCuota - newCuota;

  const kpiCards = [
    {
      icon: TrendingDown,
      label: "Meses ahorrados",
      value: monthsSaved > 0 ? `${monthsSaved} meses` : "Sin cambio",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/60",
      visible: simulatedAmount > 0,
    },
    {
      icon: PiggyBank,
      label: "Intereses ahorrados",
      value: formatCOP(interestSaved),
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/60",
      visible: simulatedAmount > 0 && interestSaved > 0,
    },
    {
      icon: Clock,
      label: "Nuevo plazo estimado",
      value: newPayoffDate
        ? newPayoffDate.toLocaleDateString("es-CO", {
            month: "long",
            year: "numeric",
          })
        : "—",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/60",
      visible: simulatedAmount > 0,
    },
  ];

  if (simulatedMode === "REDUCE_PAYMENT" && simulatedAmount > 0) {
    kpiCards.push({
      icon: TrendingDown,
      label: cuotaReduction > 0 ? "Nueva cuota" : "Cuota similar",
      value: formatCOP(newCuota),
      color:
        cuotaReduction > 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-stone-600 dark:text-stone-400",
      bg:
        cuotaReduction > 0
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-900/60"
          : "bg-stone-50 dark:bg-stone-800/30 border-stone-200/60 dark:border-stone-700",
      visible: true,
    });
  }

  const visibleKpis = kpiCards.filter((kpi) => kpi.visible);

  function getPreviewRows(schedule: typeof scheduleOriginal) {
    if (schedule.length <= 8) return schedule;
    return [...schedule.slice(0, 6), ...schedule.slice(-2)];
  }

  const originalRows = getPreviewRows(scheduleOriginal);
  const newRows = getPreviewRows(scheduleWithAbono);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-primary" />
            Simulador de Abono a Capital
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Prueba cuánto ahorrarás si hicieras un abono extra hoy. Sin guardar
            nada, solo simulación.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">
                ¿Cuánto quieres abonar a capital?
              </label>
              <CurrencyInput
                value={simulatedAmount}
                onValueChange={setSimulatedAmount}
                placeholder="Ej: $ 5.000.000"
              />
            </div>
            {simulatedAmount > 0 && (
              <Button
                variant="outline"
                onClick={() =>
                  onApplyPrefill?.({
                    amount: simulatedAmount,
                    mode: simulatedMode,
                    newTerm: simulatedNewTerm,
                  })
                }
              >
                Aplicar este abono
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {simulatedAmount > 0 && (
            <div className="space-y-3">
              <Label>Efecto del abono</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatedMode("REDUCE_TERM")}
                  data-active={simulatedMode === "REDUCE_TERM"}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    simulatedMode === "REDUCE_TERM"
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 dark:border-stone-800 hover:border-stone-300"
                  )}
                >
                  <Clock
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      simulatedMode === "REDUCE_TERM"
                        ? "text-primary"
                        : "text-stone-500"
                    )}
                  />
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                      Reducir plazo
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Misma cuota, pagas menos meses.
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedMode("REDUCE_PAYMENT")}
                  data-active={simulatedMode === "REDUCE_PAYMENT"}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    simulatedMode === "REDUCE_PAYMENT"
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 dark:border-stone-800 hover:border-stone-300"
                  )}
                >
                  <TrendingDown
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      simulatedMode === "REDUCE_PAYMENT"
                        ? "text-primary"
                        : "text-stone-500"
                    )}
                  />
                  <div>
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                      Reducir cuota
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Recalcula la cuota sobre el saldo restante.
                    </p>
                  </div>
                </button>
              </div>

              {simulatedMode === "REDUCE_PAYMENT" && (
                <div className="space-y-2">
                  <Label htmlFor="simulator-new-term">
                    Nuevo plazo total (meses)
                  </Label>
                  <Input
                    id="simulator-new-term"
                    type="number"
                    min={1}
                    max={360}
                    step={1}
                    value={simulatedNewTerm}
                    onChange={(e) =>
                      setSimulatedNewTerm(parseInt(e.target.value, 10) || 1)
                    }
                  />
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Plazo restante actual: {remainingTerm} meses
                  </p>
                </div>
              )}
            </div>
          )}

          {simulatedAmount > 0 && visibleKpis.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {visibleKpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className={`${kpi.bg} rounded-lg p-4 border`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {kpi.label}
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${kpi.color}`}>
                      {kpi.value}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          )}

          {simulatedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    ANTES del abono
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {originalTerm} meses · {formatCOP(originalTotalInterest)}{" "}
                    intereses
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Mes</th>
                        <th className="px-3 py-2 text-right font-medium">
                          Cuota
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {originalRows.map((row, i, arr) => (
                        <tr
                          key={row.month}
                          className={
                            row.status === "PAID"
                              ? "bg-emerald-50/30 dark:bg-emerald-950/20"
                              : ""
                          }
                        >
                          <td className="px-3 py-2">
                            {i === arr.length - 1 && arr.length > 8
                              ? "..."
                              : row.month}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCOP(row.payment)}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {formatCOP(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {originalPayoffDate
                    ? `Pago total: ${originalPayoffDate.toLocaleDateString(
                        "es-CO",
                        { month: "long", year: "numeric" }
                      )}`
                    : ""}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    DESPUÉS del abono
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                  >
                    {newTerm} meses · {formatCOP(newTotalInterest)} intereses
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden border-emerald-200 dark:border-emerald-900">
                  <table className="w-full text-xs">
                    <thead className="bg-emerald-50/50 dark:bg-emerald-950/30">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Mes</th>
                        <th className="px-3 py-2 text-right font-medium">
                          Cuota
                        </th>
                        <th className="px-3 py-2 text-right font-medium">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {newRows.map((row, i, arr) => (
                        <tr
                          key={row.month}
                          className={`${
                            row.status === "PAID"
                              ? "bg-emerald-50/30 dark:bg-emerald-950/20"
                              : ""
                          } ${
                            row.extraPayment > 0
                              ? "bg-emerald-100/50 dark:bg-emerald-950/40 font-medium"
                              : ""
                          }`}
                        >
                          <td className="px-3 py-2">
                            {i === arr.length - 1 && arr.length > 8
                              ? "..."
                              : row.month}
                            {row.extraPayment > 0 && (
                              <span className="ml-1 text-emerald-600 dark:text-emerald-400 text-[10px]">
                                (+{formatCOP(row.extraPayment)})
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatCOP(row.payment)}
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {formatCOP(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">
                  {newPayoffDate
                    ? `Nuevo pago total: ${newPayoffDate.toLocaleDateString(
                        "es-CO",
                        { month: "long", year: "numeric" }
                      )}`
                    : ""}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
