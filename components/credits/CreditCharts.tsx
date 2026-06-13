"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingDown } from "lucide-react";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface CreditChartsProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

interface BalanceDataPoint {
  mes: number;
  saldo: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: number;
  isDark?: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white dark:bg-[#1e1e22] border border-[#e8e8e8] dark:border-[#2a2a2e] rounded-xl px-4 py-3 shadow-lg">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-1">
        Mes {label}
      </p>
      <p className="text-sm font-extrabold tabular-nums text-[#17181c] dark:text-white">
        {formatCOP(payload[0].value)}
      </p>
    </div>
  );
}

export function CreditCharts({ loan }: CreditChartsProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const schedule = useMemo(
    () => generateAmortizationSchedule(loan, loan.payments, loan.extraPayments),
    [loan]
  );

  const balanceData: BalanceDataPoint[] = useMemo(
    () =>
      schedule.map((row) => ({
        mes: row.month,
        saldo: Math.round(row.balance),
      })),
    [schedule]
  );

  const today = new Date();
  const currentMonthRow = schedule.find((row) => {
    const rowDate = new Date(row.date);
    return (
      rowDate.getUTCFullYear() === today.getUTCFullYear() &&
      rowDate.getUTCMonth() === today.getUTCMonth()
    );
  });
  const currentMonth = currentMonthRow?.month ?? 0;

  const minBalance = Math.min(...balanceData.map((d) => d.saldo));
  const maxBalance = Math.max(...balanceData.map((d) => d.saldo));
  const yDomain = [Math.max(0, minBalance * 0.95), maxBalance * 1.05];

  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "#a1a1aa" : "#a1a1aa";
  const axisColor = isDark ? "#2a2a2e" : "#e8e8e8";
  const lineColor = isDark ? "#60a5fa" : "#3b82f6";
  const refLineColor = isDark ? "#a1a1aa" : "#737373";

  return (
    <div className="rounded-2xl bg-white dark:bg-[#17181c] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-[#e8e8e8] dark:border-[#2a2a2e] flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <TrendingDown className="h-3.5 w-3.5" strokeWidth={2.3} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
            Evolución del saldo
          </h2>
          <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa]">
            Proyección mes a mes del saldo pendiente
          </p>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="saldoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={1} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tickFormatter={(v) => `${v}`}
                tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
                stroke={axisColor}
                tickSize={0}
                tickMargin={8}
                label={{
                  value: "Mes",
                  position: "insideBottomRight",
                  offset: -6,
                  style: { fontSize: 10, fill: tickColor },
                }}
              />
              <YAxis
                tickFormatter={(v) =>
                  new Intl.NumberFormat("es-CO", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(v)
                }
                tick={{ fontSize: 11, fill: tickColor, fontWeight: 500 }}
                stroke={axisColor}
                tickSize={0}
                tickMargin={8}
                domain={yDomain}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1, strokeDasharray: "3 3" }} />
              {currentMonth > 0 && (
                <ReferenceLine
                  x={currentMonth}
                  stroke={refLineColor}
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: "Hoy",
                    position: "top",
                    fill: refLineColor,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="saldo"
                stroke={lineColor}
                strokeWidth={2.5}
                fill="url(#saldoGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: lineColor,
                  stroke: isDark ? "#17181c" : "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#a1a1aa]">
            <span className="h-2 w-4 rounded-sm bg-blue-500" />
            Saldo proyectado
          </div>
          {currentMonth > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#a1a1aa]">
              <span className="h-0.5 w-4 border-t border-dashed border-[#a1a1aa]" />
              Posición actual (mes {currentMonth})
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-[#737373] dark:text-[#a1a1aa]">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" />
            Liquidación (mes {schedule.length})
          </div>
        </div>
      </div>
    </div>
  );
}
