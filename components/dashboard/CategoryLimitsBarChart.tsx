"use client";

import { createElement, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import { useTheme } from "next-themes";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/currency";
import type { CategoryType } from "@/types";

export interface BarChartItem {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  spent: number;
  limit: number;
}

interface CategoryLimitsBarChartProps {
  items: BarChartItem[];
  bare?: boolean;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

type FilterKey = "all" | "exceeded" | "near";

interface BarDatum {
  name: string;
  spent: number;
  limit: number;
  color: string;
  type: CategoryType;
  id: string;
}

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: BarDatum;
}

interface YTickProps {
  x?: number | string;
  y?: number | string;
  payload?: { value: string };
}

export function CategoryLimitsBarChart({ items, bare = false }: CategoryLimitsBarChartProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.spent - a.spent),
    [items]
  );

  const totalSpent = sorted.reduce((sum, i) => sum + i.spent, 0);
  const hasData = sorted.length > 0 && totalSpent > 0;
  const exceededCount = sorted.filter(
    (i) => i.limit > 0 && i.spent > i.limit
  ).length;
  const nearCount = sorted.filter((i) => {
    if (i.limit <= 0) return false;
    const pct = (i.spent / i.limit) * 100;
    return pct > 85 && pct <= 100;
  }).length;

  const filtered = useMemo(() => {
    if (filter === "exceeded")
      return sorted.filter((i) => i.limit > 0 && i.spent > i.limit);
    if (filter === "near")
      return sorted.filter((i) => {
        if (i.limit <= 0) return false;
        const pct = (i.spent / i.limit) * 100;
        return pct > 85 && pct <= 100;
      });
    return sorted;
  }, [sorted, filter]);

  const topN = filtered.slice(0, 8);

  const barData: BarDatum[] = topN.map((i) => ({
    name: i.name,
    spent: i.spent,
    limit: i.limit,
    color: i.color,
    type: i.type,
    id: i.id,
  }));

  const renderCustomBar = (props: CustomBarProps) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
    if (!payload) return null;
    const { spent, limit, color } = payload;
    const hasLimit = limit > 0;
    const pct = hasLimit ? (spent / limit) * 100 : 0;
    const statusColor = !hasLimit
      ? color
      : pct > 100
      ? "#e11d48"
      : pct > 85
      ? "#f59e0b"
      : "#10b981";
    const fillRatio = hasLimit ? Math.min(spent / limit, 1) : 1;
    const fillWidth = width * fillRatio;
    const rx = Math.min(4, height / 2);

    return createElement(
      "g",
      null,
      createElement("rect", {
        x,
        y,
        width,
        height,
        rx,
        ry: rx,
        fill: isDark ? "#1e293b" : "#f5f5f4",
      }),
      fillWidth > 0
        ? createElement("rect", {
            x,
            y,
            width: fillWidth,
            height,
            rx,
            ry: rx,
            fill: statusColor,
          })
        : null
    );
  };

  const renderYTick = (props: YTickProps) => {
    const { x = 0, y = 0, payload } = props;
    if (!payload) return null;
    const item = barData.find((d) => d.name === payload.value);
    if (!item) return null;
    return createElement(
      "g",
      { transform: `translate(${x},${y})` },
      createElement(
        "text",
        {
          x: 0,
          y: -3,
          textAnchor: "end",
          fill: isDark ? "#f8fafc" : "#1c1917",
          fontSize: 12,
          fontWeight: 600,
        },
        item.name
      ),
      createElement(
        "text",
        {
          x: 0,
          y: 11,
          textAnchor: "end",
          fill: isDark ? "#94a3b8" : "#78716c",
          fontSize: 10,
          fontWeight: 500,
        },
        item.limit > 0 ? `de ${formatCurrency(item.limit)}` : "Sin límite"
      )
    );
  };

  const labelFill = isDark ? "#f8fafc" : "#0c0a09";
  const cursorFill = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        bare
          ? ""
          : "bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      )}
    >
      <div className={cn("space-y-5", !bare && "p-5 md:p-6")}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          {!bare && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.3} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Gastado vs Límite
                </h2>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Equivalente mensual · top {topN.length} categorías
                </p>
              </div>
            </div>
          )}
          <div className={cn("flex items-center gap-1.5 flex-wrap", bare && "w-full")}>
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="Todas"
              count={sorted.length}
            />
            <FilterChip
              active={filter === "near"}
              onClick={() => setFilter("near")}
              label="Cerca"
              count={nearCount}
              tone="amber"
            />
            <FilterChip
              active={filter === "exceeded"}
              onClick={() => setFilter("exceeded")}
              label="Excedidas"
              count={exceededCount}
              tone="rose"
            />
          </div>
        </div>

        {bare && !hasData ? (
          <div className="text-center py-10 text-stone-500 dark:text-stone-400 text-sm">
            <p className="font-medium">Sin gastos registrados este mes</p>
            <p className="text-xs mt-1">Agrega gastos para ver el comparativo contra tus límites.</p>
          </div>
        ) : !hasData ? null : topN.length === 0 ? (
          <div className="text-center py-10 text-stone-500 dark:text-stone-400 text-sm">
            <p className="font-medium">Sin categorías en este filtro</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-xs text-stone-700 dark:text-stone-300 underline mt-1"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <>
            <div
              className="h-[320px] md:h-[360px] outline-none focus:outline-none"
              tabIndex={-1}
              style={{ outline: "none" }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 64, left: 0, bottom: 5 }}
                  barCategoryGap={10}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  <XAxis
                    type="number"
                    hide
                    domain={[0, (dataMax: number) => Math.max(dataMax * 1.05, 100)]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tickLine={false}
                    axisLine={false}
                    tick={renderYTick}
                  />
                  <Tooltip
                    cursor={{ fill: cursorFill }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as BarDatum;
                      const pct = d.limit > 0 ? (d.spent / d.limit) * 100 : 0;
                      const over = d.spent > d.limit && d.limit > 0;
                      return (
                        <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-md p-2.5 min-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-50 truncate">
                              {d.name}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-[11px]">
                            <div className="flex justify-between gap-3">
                              <span className="text-stone-500 dark:text-stone-400">Gastado</span>
                              <span className="font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                                {formatCurrency(d.spent)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-stone-500 dark:text-stone-400">Límite</span>
                              <span className="font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                                {d.limit > 0 ? formatCurrency(d.limit) : "—"}
                              </span>
                            </div>
                            {d.limit > 0 && (
                              <div className="flex justify-between gap-3 pt-0.5 border-t border-stone-100 dark:border-stone-700">
                                <span className="text-stone-500 dark:text-stone-400">% usado</span>
                                <span
                                  className={cn(
                                    "font-bold tabular-nums",
                                    over
                                      ? "text-rose-700 dark:text-rose-400"
                                      : pct > 85
                                      ? "text-amber-700 dark:text-amber-400"
                                      : "text-stone-900 dark:text-stone-50"
                                  )}
                                >
                                  {pct.toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="limit"
                    shape={renderCustomBar}
                    isAnimationActive={true}
                    animationDuration={700}
                    background={false}
                  >
                    <LabelList
                      dataKey="spent"
                      position="right"
                      formatter={(v) =>
                        formatCurrency(typeof v === "number" ? v : 0)
                      }
                      style={{
                        fill: labelFill,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <SummaryStat
                icon={BarChart3}
                label="Categorías"
                value={String(sorted.length)}
                valueColor="text-stone-900 dark:text-stone-50"
              />
              <SummaryStat
                icon={TrendingUp}
                label="Gastado"
                value={formatCOP(totalSpent)}
                valueColor="text-stone-900 dark:text-stone-50"
              />
              <SummaryStat
                icon={AlertTriangle}
                label="Excedidas"
                value={String(exceededCount)}
                valueColor={exceededCount > 0 ? "text-rose-700 dark:text-rose-400" : "text-stone-900 dark:text-stone-50"}
              />
            </div>

            <div className="flex items-center gap-3 text-[10px] text-stone-500 dark:text-stone-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
                Disponible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-emerald-500" />
                Saludable
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-amber-500" />
                Cerca del límite
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-rose-500" />
                Excedido
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  tone?: "amber" | "rose";
}

function FilterChip({ active, onClick, label, count, tone }: FilterChipProps) {
  const toneClass = (() => {
    if (!active)
      return "bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800";
    if (tone === "amber")
      return "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400";
    if (tone === "rose")
      return "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400";
    return "bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900";
  })();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-[10px] font-bold uppercase tracking-wider transition-colors",
        toneClass
      )}
    >
      {label}
      <span
        className={cn(
          "tabular-nums",
          active && tone === undefined && "text-white/70 dark:text-stone-900/70",
          active && tone === "amber" && "text-amber-700/70 dark:text-amber-400/70",
          active && tone === "rose" && "text-rose-700/70 dark:text-rose-400/70"
        )}
      >
        {count}
      </span>
    </button>
  );
}

interface SummaryStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
  valueColor: string;
}

function SummaryStat({ icon: Icon, label, value, valueColor }: SummaryStatProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className={cn("text-sm font-extrabold tabular-nums", valueColor)}>
        {value}
      </p>
    </div>
  );
}
