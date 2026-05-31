"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateRemainingBalance,
  getProjectedPayoffDate,
  getNextPaymentDate,
  getPaidInstallments,
} from "@/lib/loan-engine";
import type { Loan } from "@/types";

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface LoanDetailSummaryProps {
  loan: Loan;
}

export function LoanDetailSummary({ loan }: LoanDetailSummaryProps) {
  const principal = parseFloat(loan.principal);
  const monthlyPayment = parseFloat(loan.monthlyPayment);
  const remaining = calculateRemainingBalance(
    loan,
    loan.payments ?? [],
    loan.extraPayments ?? []
  );
  const totalPaid = principal - remaining;
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
      paidCount < loan.paidInstallments);

  const stats = [
    {
      label: "Saldo actual",
      value: formatCOP(remaining),
      sub: `${((remaining / principal) * 100).toFixed(0)}% restante`,
    },
    {
      label: "Total pagado",
      value: formatCOP(totalPaid),
      sub: `${((totalPaid / principal) * 100).toFixed(0)}% del capital`,
    },
    {
      label: "Cuota mensual",
      value: formatCOP(monthlyPayment),
      sub: `${paidCount} / ${loan.termMonths} cuotas`,
    },
    {
      label: "Proximo pago",
      value: nextPayment.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      sub: payoffDate
        ? `Pago total estimado: ${payoffDate.toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`
        : "No calculable",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {loan.status === "DEFAULTED" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-red-800">
              <span className="font-semibold">Credito en mora</span>
              <span className="text-sm">
                Hay cuotas vencidas sin pago
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {hasPendingPastPayments && loan.status !== "DEFAULTED" && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-2 text-amber-800">
              <span className="font-semibold">Proximo pago vencido</span>
              <span className="text-sm">
                Hay cuotas pasadas pendientes de sincronizacion
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}