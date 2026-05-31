"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CurrencyInput } from "@/components/ui/currency-input";
import { CapitalContributionForm } from "./CapitalContributionForm";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";
import { TrendingDown, Clock, PiggyBank, ArrowRight } from "lucide-react";

interface CapitalImpactSimulatorProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

export function CapitalImpactSimulator({ loan }: CapitalImpactSimulatorProps) {
  const [simulatedAmount, setSimulatedAmount] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const scheduleOriginal = useMemo(
    () => generateAmortizationSchedule(loan, loan.payments, loan.extraPayments),
    [loan]
  );

  const scheduleWithAbono = useMemo(() => {
    if (simulatedAmount <= 0) return scheduleOriginal;

    const simulatedExtra: LoanExtraPayment = {
      id: "simulated",
      loanId: loan.id,
      amount: String(simulatedAmount),
      date: new Date(),
      createdAt: new Date(),
    };

    return generateAmortizationSchedule(loan, loan.payments, [
      ...loan.extraPayments,
      simulatedExtra,
    ]);
  }, [loan, simulatedAmount, scheduleOriginal]);

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
    scheduleOriginal.length > 0 ? scheduleOriginal[scheduleOriginal.length - 1].date : null;
  const newPayoffDate =
    scheduleWithAbono.length > 0
      ? scheduleWithAbono[scheduleWithAbono.length - 1].date
      : null;

  const kpiCards = [
    {
      icon: TrendingDown,
      label: "Meses ahorrados",
      value: monthsSaved > 0 ? `${monthsSaved} meses` : "Sin cambio",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      visible: simulatedAmount > 0,
    },
    {
      icon: PiggyBank,
      label: "Interés ahorrado",
      value: formatCOP(interestSaved),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
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
      color: "text-blue-600",
      bg: "bg-blue-50",
      visible: simulatedAmount > 0,
    },
  ].filter((kpi) => kpi.visible);

  // Table rows: show first 6 + last 2
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
            Prueba cuánto ahorrarías si hicieras un abono extra hoy. Sin guardar nada, solo simulación.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
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
              <Button variant="outline" onClick={() => setShowApplyModal(true)}>
                Aplicar este abono
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

          {/* KPIs */}
          {simulatedAmount > 0 && kpiCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {kpiCards.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={i}
                    className={`${kpi.bg} rounded-lg p-4 border`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${kpi.color}`} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {kpi.label}
                      </span>
                    </div>
                    <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Side-by-side tables */}
          {simulatedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {/* BEFORE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground">ANTES del abono</h3>
                  <Badge variant="outline" className="text-xs">
                    {originalTerm} meses · {formatCOP(originalTotalInterest)} interés
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Mes</th>
                        <th className="px-3 py-2 text-right font-medium">Cuota</th>
                        <th className="px-3 py-2 text-right font-medium">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {originalRows.map((row, i, arr) => (
                        <tr key={row.month} className={row.status === "PAID" ? "bg-emerald-50/30" : ""}>
                          <td className="px-3 py-2">
                            {i === arr.length - 1 && arr.length > 8 ? "..." : row.month}
                          </td>
                          <td className="px-3 py-2 text-right">{formatCOP(row.payment)}</td>
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
                    ? `Pago total: ${originalPayoffDate.toLocaleDateString("es-CO", {
                        month: "long",
                        year: "numeric",
                      })}`
                    : ""}
                </p>
              </div>

              {/* AFTER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emerald-600">DESPUÉS del abono</h3>
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-200">
                    {newTerm} meses · {formatCOP(newTotalInterest)} interés
                  </Badge>
                </div>
                <div className="border rounded-lg overflow-hidden border-emerald-200">
                  <table className="w-full text-xs">
                    <thead className="bg-emerald-50/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Mes</th>
                        <th className="px-3 py-2 text-right font-medium">Cuota</th>
                        <th className="px-3 py-2 text-right font-medium">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {newRows.map((row, i, arr) => (
                        <tr
                          key={row.month}
                          className={`${row.status === "PAID" ? "bg-emerald-50/30" : ""} ${
                            row.extraPayment > 0 ? "bg-emerald-100/50 font-medium" : ""
                          }`}
                        >
                          <td className="px-3 py-2">
                            {i === arr.length - 1 && arr.length > 8 ? "..." : row.month}
                            {row.extraPayment > 0 && (
                              <span className="ml-1 text-emerald-600 text-[10px]">
                                (+{formatCOP(row.extraPayment)})
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">{formatCOP(row.payment)}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {formatCOP(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-center text-emerald-600 font-medium">
                  {newPayoffDate
                    ? `Nuevo pago total: ${newPayoffDate.toLocaleDateString("es-CO", {
                        month: "long",
                        year: "numeric",
                      })}`
                    : ""}
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Apply modal */}
      {showApplyModal && (
        <CapitalContributionForm
          onRecord={async () => {
            setShowApplyModal(false);
            setSimulatedAmount(0);
          }}
          triggerRefresh={0}
        />
      )}
    </div>
  );
}
