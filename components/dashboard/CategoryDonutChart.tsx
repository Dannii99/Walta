"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PieChart as PieIcon, Plus } from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface DonutData {
  name: string;
  value: number;
  color?: string;
}

interface CategoryDonutChartProps {
  data: DonutData[];
  monthLabel?: string;
  bare?: boolean;
  reducedMotion?: boolean;
}

const PALETTE = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EF4444",
  "#0EA5E9",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export function CategoryDonutChart({ data, monthLabel, bare = false, reducedMotion }: CategoryDonutChartProps) {
  const { setOpenAddModal } = useDashboard();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chartData = data.map((item, i) => ({
    ...item,
    color: item.color || PALETTE[i % PALETTE.length],
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const hasData = chartData.length > 0 && total > 0;

  const body = (
    <div className={cn("space-y-5", !bare && "p-5 md:p-6")}>
        {!bare && (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50/70 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 shrink-0">
            <PieIcon className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Distribución de Gastos
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              {monthLabel ? `${monthLabel} · Equivalente mensual` : "Equivalente mensual"}
            </p>
          </div>
        </div>
        )}

        {hasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-3 relative">
              <div className="h-[280px] sm:h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={135}
                    paddingAngle={2}
                    dataKey="value"
                    stroke={isDark ? "#0f172a" : "#ffffff"}
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      const pct = total > 0 ? (Number(item.value) / total) * 100 : 0;
                      return (
                        <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-md p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.payload.color }}
                            />
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-50">
                              {item.payload.name}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                            {formatCurrency(Number(item.value))}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                            {pct.toFixed(1)}% del total
                          </div>
                        </div>
                      );
                    }}
                  />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Total mes
                </span>
                <span className="text-2xl md:text-3xl font-extrabold mt-0.5 text-stone-900 dark:text-stone-50 tabular-nums">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-1.5 max-h-[360px] overflow-y-auto -mr-1 pr-1 scrollbar-none">
              {chartData.map((entry) => {
                const pct = total > 0 ? (entry.value / total) * 100 : 0;
                return (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between gap-2 py-1.5 border-b border-stone-100 dark:border-stone-800 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 truncate">
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold tabular-nums text-stone-500 dark:text-stone-400">
                        {pct.toFixed(0)}%
                      </span>
                      <span className="text-xs font-bold tabular-nums text-stone-900 dark:text-stone-50">
                        {formatCurrency(entry.value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] sm:h-[340px] gap-3 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800">
              <PieIcon className="h-5 w-5 text-stone-500 dark:text-stone-400" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                No hay gastos este mes
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium max-w-xs">
                Agrega tu primer gasto y verás cómo se distribuye tu dinero.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setOpenAddModal(true)}
              className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar gasto
            </Button>
          </div>
        )}
    </div>
  );

  if (bare) return body;

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-stone-900/60 border border-[#E8E5E0]/60 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.03)] h-full hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-shadow duration-300"
    >
      {body}
    </motion.div>
  );
}
