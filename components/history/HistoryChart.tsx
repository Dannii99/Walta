"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlySnapshot } from "@/types";

interface HistoryChartProps {
  snapshots: MonthlySnapshot[];
}

const monthNames = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function HistoryChart({ snapshots }: HistoryChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const sorted = [...snapshots].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const data = sorted.map((snapshot) => ({
    name: `${monthNames[snapshot.month - 1]} ${snapshot.year}`,
    Gastos: parseFloat(snapshot.totalExpenses),
    Ahorros: parseFloat(snapshot.totalSavings),
  }));

  const formatTooltip = (
    value: number | string | (string | number)[] | undefined
  ) => {
    if (value === undefined || value === null) return ["", ""];
    const num = Array.isArray(value) ? Number(value[0]) : Number(value);
    if (Number.isNaN(num)) return ["", ""];
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
    return [formatted, ""];
  };

  const gridStroke = isDark ? "#334155" : "#e7e5e4";
  const axisFill = isDark ? "#94a3b8" : "#57534e";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparativa Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: axisFill }}
                stroke={axisFill}
              />
              <YAxis
                tick={{ fontSize: 12, fill: axisFill }}
                stroke={axisFill}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("es-CO", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  border: `1px solid ${gridStroke}`,
                  borderRadius: "0.5rem",
                  color: isDark ? "#f8fafc" : "#0c0a09",
                }}
                cursor={{ fill: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}
                formatter={formatTooltip as unknown as React.ComponentProps<typeof Tooltip>['formatter']}
              />
              <Legend wrapperStyle={{ color: axisFill }} />
              <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ahorros" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
