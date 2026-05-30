"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Loan, AmortizationRow } from "@/types";

interface LoanProgressBarProps {
  loan: Loan;
  schedule: AmortizationRow[];
}

export function LoanProgressBar({ loan, schedule }: LoanProgressBarProps) {
  const principal = parseFloat(loan.principal);
  const paidCount = loan.payments?.length ?? 0;
  const totalMonths = schedule.length || loan.termMonths;
  const monthsProgress = totalMonths > 0 ? (paidCount / totalMonths) * 100 : 0;

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
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cuotas pagadas</span>
            <span className="font-medium">{paidCount} de {totalMonths} meses</span>
          </div>
          <Progress value={monthsProgress} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capital amortizado</span>
            <span className="font-medium">{capitalProgress.toFixed(0)}%</span>
          </div>
          <Progress value={Math.min(capitalProgress, 100)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
