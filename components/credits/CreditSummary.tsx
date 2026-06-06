"use client";

import { AlertTriangle, Clock, CheckCircle2, CalendarClock } from "lucide-react";
import {
  calculateRemainingBalance,
  getProjectedPayoffDate,
  getNextPaymentDate,
  getPaidInstallments,
} from "@/lib/loan-engine";
import { getEffectiveMonthlyPayment } from "@/lib/loan-fees";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Loan } from "@/types";

interface CreditSummaryProps {
  loan: Loan;
}

export function CreditSummary({ loan }: CreditSummaryProps) {
  const principal = parseFloat(loan.principal);
  const monthlyPayment = parseFloat(loan.monthlyPayment);
  const totalMonthlyPayment = getEffectiveMonthlyPayment(loan);
  const monthlyFees = totalMonthlyPayment - monthlyPayment;
  const remaining = calculateRemainingBalance(
    loan,
    loan.payments ?? [],
    loan.extraPayments ?? []
  );
  const totalPaid = principal - remaining;
  const realPaidCount = loan.payments?.length ?? 0;
  const paidFromExtract = Math.max(
    0,
    (loan.paidInstallments ?? 0) - realPaidCount
  );
  const paidCount = getPaidInstallments(loan);
  const nextPayment = getNextPaymentDate(loan);
  const payoffDate = getProjectedPayoffDate(
    loan,
    loan.payments ?? [],
    loan.extraPayments ?? []
  );

  const hasPendingPastPayments =
    loan.status === "DEFAULTED" ||
    (loan.paidInstallments !== undefined &&
      loan.paidInstallments > 0 &&
      realPaidCount < loan.paidInstallments);

  const stats = [
    {
      label: "Saldo actual",
      value: formatCOP(remaining),
      sub: `${((remaining / principal) * 100).toFixed(0)}% restante`,
      icon: CalendarClock,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-950/40",
    },
    {
      label: "Total pagado",
      value: formatCOP(totalPaid),
      sub: `${((totalPaid / principal) * 100).toFixed(0)}% del capital`,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      label: "Cuota mensual",
      value: formatCOP(totalMonthlyPayment),
      sub: (() => {
        const cuotaInfo =
          paidFromExtract > 0
            ? `${paidCount} / ${loan.termMonths} cuotas (${realPaidCount} reales + ${paidFromExtract} extracto)`
            : `${paidCount} / ${loan.termMonths} cuotas`;
        return monthlyFees > 0
          ? `+ ${formatCOP(monthlyFees)} cargos · ${cuotaInfo}`
          : cuotaInfo;
      })(),
      icon: CalendarClock,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-100 dark:bg-violet-950/40",
    },
    {
      label: "Próximo pago",
      value: nextPayment.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      sub: payoffDate
        ? `Liquidación: ${payoffDate.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        : "No calculable",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950/40",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-4 md:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
                    stat.bg
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", stat.color)} strokeWidth={2.2} />
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {stat.label}
              </p>
              <p className="text-sm md:text-base font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50 mt-1">
                {stat.value}
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                {stat.sub}
              </p>
            </div>
          );
        })}
      </div>

      {loan.status === "DEFAULTED" && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-rose-800 dark:text-rose-400">
              Crédito en mora
            </p>
            <p className="text-xs text-rose-700 dark:text-rose-400/80">
              Hay cuotas vencidas sin pago registradas.
            </p>
          </div>
        </div>
      )}

      {hasPendingPastPayments && loan.status !== "DEFAULTED" && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-amber-800 dark:text-amber-400">
              Próximo pago vencido
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400/80">
              Hay cuotas pasadas pendientes de sincronización.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
