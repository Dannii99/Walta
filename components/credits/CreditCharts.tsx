"use client";

import { useTheme } from "next-themes";
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
import { TrendingDown, BarChart3 } from "lucide-react";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface CreditChartsProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  simulatedExtraAmount?: number;
}

export function CreditCharts({ loan, simulatedExtraAmount = 0 }: CreditChartsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const scheduleOriginal = generateAmortizationSchedule(
    loan,
    loan.payments,
    loan.extraPayments
  );

  const balanceData = scheduleOriginal.map((row) => ({
    mes: row.month,
    saldo: Math.round(row.balance),
  }));

  const today = new Date();
  const currentMonthRow = scheduleOriginal.find((row) => {
    const rowDate = new Date(row.date);
    return (
      rowDate.getUTCFullYear() === today.getUTCFullYear() &&
      rowDate.getUTCMonth() === today.getUTCMonth()
    );
  });
  const currentMonth = currentMonthRow?.month ?? 0;

  const scheduleWithAbono =
    simulatedExtraAmount > 0
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

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const tickColor = isDark ? "#a8a29e" : "#78716c";
  const cursorColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Evolución del saldo
          </h2>
        </div>
        <div className="p-5 md:p-6">
          <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="mes"
                tickFormatter={(v) => `Mes ${v}`}
                tick={{ fontSize: 12, fill: tickColor }}
                stroke={tickColor}
              />
              <YAxis
                tickFormatter={(v) =>
                  new Intl.NumberFormat("es-CO", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(v)
                }
                tick={{ fontSize: 12, fill: tickColor }}
                stroke={tickColor}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1c1917" : "#ffffff",
                  border: `1px solid ${isDark ? "#292524" : "#e7e5e4"}`,
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                cursor={{ fill: cursorColor }}
                formatter={(value) => formatCOP(Number(value))}
                labelFormatter={(label) => `Mes ${label}`}
              />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={isDark ? "#60a5fa" : "#3b82f6"}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: isDark ? "#60a5fa" : "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
          {currentMonth > 0 && (
            <p className="text-xs text-center text-stone-500 dark:text-stone-400 mt-3 tabular-nums">
              Punto actual: <span className="font-semibold text-stone-700 dark:text-stone-300">Mes {currentMonth}</span>
            </p>
          )}
        </div>
      </div>

      {simulatedExtraAmount > 0 && (
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.3} />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Impacto del abono simulado
            </h2>
          </div>
          <div className="p-5 md:p-6">
            <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  type="number"
                  tickFormatter={(v) =>
                    new Intl.NumberFormat("es-CO", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(v)
                  }
                  tick={{ fontSize: 12, fill: tickColor }}
                  stroke={tickColor}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12, fill: tickColor }}
                  stroke={tickColor}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1c1917" : "#ffffff",
                    border: `1px solid ${isDark ? "#292524" : "#e7e5e4"}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: cursorColor }}
                  formatter={(value) => formatCOP(Number(value))}
                />
                <Legend wrapperStyle={{ fontSize: "12px", color: tickColor }} />
                <Bar
                  dataKey="sinAbono"
                  name="Sin abono"
                  fill={isDark ? "#57534e" : "#a8a29e"}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="conAbono"
                  name="Con abono"
                  fill={isDark ? "#34d399" : "#10b981"}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-bold mt-3 tabular-nums">
              Ahorro: {formatCOP(originalCost - newCost)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
