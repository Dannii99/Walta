"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { PieChart as PieIcon, TrendingUp } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface DonutData {
  name: string;
  value: number;
  color?: string;
}

interface CategoryDonutChartProps {
  data: DonutData[];
  variant?: "default" | "hero";
}

const VIBRANT_PALETTE = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export function CategoryDonutChart({
  data,
  variant = "default",
}: CategoryDonutChartProps) {
  const chartData = data.map((item, i) => ({
    ...item,
    color: item.color || VIBRANT_PALETTE[i % VIBRANT_PALETTE.length],
  }));

  const isHero = variant === "hero";
  const innerRadius = isHero ? 90 : 60;
  const outerRadius = isHero ? 135 : 80;
  const chartHeight = isHero ? 360 : 220;
  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const hasData = chartData.length > 0 && total > 0;
  const topEntry = chartData.reduce(
    (max, e) => (e.value > max.value ? e : max),
    chartData[0] ?? { name: "", value: 0, color: "" }
  );
  const topShare = total > 0 ? (topEntry.value / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 shadow-xl ring-1 ring-black/5`}
    >
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-2xl" />

      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-md">
              <PieIcon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Distribución de Gastos
              </h2>
              <p className="text-[11px] text-muted-foreground font-medium">
                Equivalente mensual
              </p>
            </div>
          </div>
          {isHero && hasData && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200/50">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {topEntry.name}
              </span>
              <span className="text-[10px] font-bold text-emerald-600">
                {topShare.toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {hasData ? (
          <div
            className={
              isHero
                ? "grid grid-cols-1 lg:grid-cols-5 gap-6 items-center"
                : ""
            }
          >
            <div
              className={isHero ? "lg:col-span-3 relative" : "relative"}
            >
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <defs>
                    {chartData.map((entry, i) => (
                      <linearGradient
                        key={`grad-${i}`}
                        id={`grad-${i}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#grad-${index})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      const pct = total > 0 ? (Number(item.value) / total) * 100 : 0;
                      return (
                        <div className="rounded-lg border border-border/60 bg-popover/95 backdrop-blur shadow-xl p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: item.payload.color }}
                            />
                            <span className="text-xs font-semibold">
                              {item.payload.name}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-foreground">
                            {formatCurrency(Number(item.value))}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium">
                            {pct.toFixed(1)}% del total
                          </div>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {isHero && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Total mes
                  </span>
                  <span className="text-2xl md:text-3xl font-extrabold mt-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tabular-nums">
                    {formatCurrency(total)}
                  </span>
                </div>
              )}
            </div>

            <div
              className={
                isHero
                  ? "lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2"
                  : "mt-4 space-y-2"
              }
            >
              {chartData.map((entry) => {
                const pct = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <motion.div
                    key={entry.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium text-foreground/80 truncate">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold tabular-nums text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                        {pct.toFixed(0)}%
                      </span>
                      <span className="text-sm font-bold tabular-nums text-foreground">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-center ${
              isHero ? "h-[340px]" : "h-48"
            } text-muted-foreground text-sm flex-col gap-2`}
          >
            <PieIcon className="h-10 w-10 opacity-30" />
            <p className="font-medium">No hay gastos registrados este mes</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
