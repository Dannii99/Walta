"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import type { MonthlySnapshot } from "@/types";

interface MonthlySnapshotCardProps {
  snapshot: MonthlySnapshot;
}

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function MonthlySnapshotCard({ snapshot }: MonthlySnapshotCardProps) {
  const income = parseFloat(snapshot.income);
  const expenses = parseFloat(snapshot.totalExpenses);
  const savings = parseFloat(snapshot.totalSavings);
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const savingsColor =
    savingsRate >= 20
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : savingsRate >= 10
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-rose-100 text-rose-800 border-rose-200";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {monthNames[snapshot.month - 1]} {snapshot.year}
          </CardTitle>
          <Badge variant="outline" className={savingsColor}>
            {savingsRate.toFixed(1)}% ahorro
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ingresos</span>
          <span className="font-medium">{formatCOP(income)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Gastos</span>
          <span className="font-medium">{formatCOP(expenses)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ahorros</span>
          <span className="font-medium">{formatCOP(savings)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.min(savingsRate, 100)}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
