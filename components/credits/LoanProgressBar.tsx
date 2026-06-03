"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Loan, AmortizationRow } from "@/types";
import { getPaymentStatusCounts } from "@/lib/loan-engine";

interface LoanProgressBarProps {
  loan: Loan;
  schedule: AmortizationRow[];
}

export function LoanProgressBar({ loan, schedule }: LoanProgressBarProps) {
  const principal = parseFloat(loan.principal);

  const counts = getPaymentStatusCounts(schedule);
  const total = schedule.length || 1;

  const paidPct = total > 0 ? (counts.paid / total) * 100 : 0;
  const pendingPct = total > 0 ? (counts.pending / total) * 100 : 0;
  const defaultedPct = total > 0 ? (counts.defaulted / total) * 100 : 0;
  const upcomingPct = total > 0 ? (counts.upcoming / total) * 100 : 0;

  const totalPaid = schedule.reduce((sum, row) => {
    if (row.status === "PAID") {
      return sum + row.principal + row.extraPayment;
    }
    return sum;
  }, 0);
  const capitalProgress = principal > 0 ? (totalPaid / principal) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progreso del Crédito</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex h-3 w-full rounded-full overflow-hidden">
            {counts.paid > 0 && (
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${paidPct}%` }}
                title={`${counts.paid} pagadas`}
              />
            )}
            {counts.pending > 0 && (
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${pendingPct}%` }}
                title={`${counts.pending} pendientes`}
              />
            )}
            {counts.defaulted > 0 && (
              <div
                className="bg-red-500 h-full"
                style={{ width: `${defaultedPct}%` }}
                title={`${counts.defaulted} en mora`}
              />
            )}
            {counts.upcoming > 0 && (
              <div
                className="bg-slate-300 dark:bg-slate-700 h-full"
                style={{ width: `${upcomingPct}%` }}
                title={`${counts.upcoming} futuras`}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {counts.paid} pagadas · {counts.pending} pendientes · {counts.defaulted} en mora · {counts.upcoming} futuras
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capital amortizado</span>
            <span className="font-medium">{capitalProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(capitalProgress, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
