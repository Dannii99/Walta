"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";
import { TrendingDown, BarChart3 } from "lucide-react";

interface LoanChartsProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  simulatedExtraAmount?: number;
}

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export function LoanCharts({ loan, simulatedExtraAmount = 0 }: LoanChartsProps) {
  const scheduleOriginal = generateAmortizationSchedule(
    loan,
    loan.payments,
    loan.extraPayments
  );

  const balanceData = scheduleOriginal.map((row) => ({
    mes: row.month,
    saldo: Math.round(row.balance),
    estado: row.status,
  }));

  // Current month marker
  const today = new Date();
  const currentMonthRow = scheduleOriginal.find((row) => {
    const rowDate = new Date(row.date);
    return (
      rowDate.getUTCFullYear() === today.getUTCFullYear() &&
      rowDate.getUTCMonth() === today.getUTCMonth()
    );
  });
  const currentMonth = currentMonthRow?.month ?? 0;

  // Comparison data
  const scheduleWithAbono = simulatedExtraAmount > 0
    ? generateAmortizationSchedule(loan, loan.payments, [
        ...loan.extraPayments,
        {
          id: "simulated",
          loanId: loan.id,
          amount: String(simulatedExtraAmount),
          date: new Date(),
          createdAt: new Date(),
        } as LoanExtraPayment,
      ])
    : scheduleOriginal;

  const originalCost = scheduleOriginal.reduce(
    (sum, row) => sum + row.payment + row.interest,
    0
  );
  const newCost = scheduleWithAbono.reduce(
    (sum, row) => sum + row.payment + row.interest,
    0
  );
  const comparisonData = [
    {
      name: "Costo total",
      sinAbono: Math.round(originalCost),
      conAbono: Math.round(newCost),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Balance evolution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-primary" />
            Evolución del saldo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="mes"
                tickFormatter={(v) => `Mes ${v}`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(v) =>
                  new Intl.NumberFormat("es-CO", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(v)
                }
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => formatCOP(Number(value))}
                labelFormatter={(label) => `Mes ${label}`}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              {/* Reference line for current month */}
              {currentMonth > 0 && (
                <Line
                  type="monotone"
                  dataKey={() => null}
                  stroke="transparent"
                  dot={({ cx, cy }) => (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={0}
                      fill="none"
                    />
                  )}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          {currentMonth > 0 && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Punto actual: Mes {currentMonth}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Comparison */}
      {simulatedExtraAmount > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Impacto del abono simulado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  type="number"
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("es-CO", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(v)
                  }
                  tick={{ fontSize: 12 }}
                />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip
                  formatter={(value) => formatCOP(Number(value))}
                />
                <Legend />
                <Bar dataKey="sinAbono" name="Sin abono" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                <Bar dataKey="conAbono" name="Con abono" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-emerald-600 font-medium mt-2">
              Ahorro: {formatCOP(originalCost - newCost)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
