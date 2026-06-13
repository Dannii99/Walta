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
  "#26be15",
  "#617dd5",
  "#e7964d",
  "#e54d4d",
  "#23ad1b",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
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
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#26be15]/10 text-[#26be15] shrink-0">
            <PieIcon className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
              Distribución de Gastos
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
              {monthLabel ? `${monthLabel} · Equivalente mensual` : "Equivalente mensual"}
            </p>
          </div>
        </div>
      )}

      {hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 relative">
            <div className="h-[220px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke={isDark ? "#17181c" : "#ffffff"}
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
                        <div className="rounded-xl border border-[#e8e8e8] dark:border-[#26272b] bg-white dark:bg-[#17181c] shadow-md p-2.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.payload.color }}
                            />
                            <span className="text-xs font-semibold text-[#17181c] dark:text-white">
                              {item.payload.name}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-[#17181c] dark:text-white tabular-nums">
                            {formatCurrency(Number(item.value))}
                          </div>
                          <div className="text-[10px] text-[#737373] dark:text-[#a1a1aa] font-medium">
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
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                Total mes
              </span>
              <span className="text-xl md:text-2xl font-extrabold mt-0.5 text-[#17181c] dark:text-white tabular-nums">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Mobile: horizontal scrollable cards */}
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {chartData.map((entry) => {
              const pct = total > 0 ? (entry.value / total) * 100 : 0;
              return (
                <div
                  key={entry.name}
                  className="flex-shrink-0 bg-[#fafafa] dark:bg-[#1a1a1e] rounded-xl p-3 min-w-[140px]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[11px] font-medium text-[#17181c] dark:text-white truncate">
                      {entry.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#17181c] dark:text-white tabular-nums">
                    {formatCurrency(entry.value)}
                  </div>
                  <div className="text-[10px] text-[#737373] dark:text-[#a1a1aa] font-medium">
                    {pct.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: vertical scrollable cards */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-2 max-h-[320px] overflow-y-auto -mr-1 pr-1 scrollbar-none">
            {chartData.map((entry) => {
              const pct = total > 0 ? (entry.value / total) * 100 : 0;
              return (
                <div
                  key={entry.name}
                  className="bg-[#fafafa] dark:bg-[#1a1a1e] rounded-xl p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-[11px] font-medium text-[#17181c] dark:text-white truncate">
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#17181c] dark:text-white tabular-nums">
                      {formatCurrency(entry.value)}
                    </span>
                    <span className="text-[10px] font-bold tabular-nums text-[#737373] dark:text-[#a1a1aa]">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[220px] sm:h-[300px] gap-3 px-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1e]">
            <PieIcon className="h-5 w-5 text-[#737373] dark:text-[#a1a1aa]" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#17181c] dark:text-white">
              No hay gastos este mes
            </p>
            <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium max-w-xs">
              Agrega tu primer gasto y verás cómo se distribuye tu dinero.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setOpenAddModal(true)}
            className="bg-gradient-to-r from-[#17181c] to-[#333438] text-white hover:from-[#25262c] hover:to-[#3d3e43]"
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
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full"
    >
      {body}
    </motion.div>
  );
}
