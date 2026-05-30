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
  // Sort ascending for the chart (oldest first)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparativa Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("es-CO", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
              />
              <Tooltip formatter={formatTooltip as unknown as React.ComponentProps<typeof Tooltip>['formatter']} />
              <Legend />
              <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Ahorros" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
