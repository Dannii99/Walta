"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  reducedMotion?: boolean;
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
  pct: number;
}

export function CategoryLimitsBarChart({ items, bare = false, reducedMotion }: CategoryLimitsBarChartProps) {
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

  const topN = filtered.slice(0, 10);

  const barData: BarDatum[] = topN.map((i) => {
    const pct = i.limit > 0 ? (i.spent / i.limit) * 100 : 0;
    return {
      name: i.name,
      spent: i.spent,
      limit: i.limit,
      color: i.color,
      type: i.type,
      id: i.id,
      pct,
    };
  });

  const maxValue = Math.max(
    ...barData.map((d) => Math.max(d.spent, d.limit)),
    1
  );

  const cursorFill = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const axisColor = isDark ? "#a1a1aa" : "#737373";

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        bare
          ? ""
          : "bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      )}
    >
      <div className={cn("space-y-5", !bare && "p-6 md:p-7")}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          {!bare && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#26be15]/10 text-[#26be15] shrink-0">
                <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.3} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
                  Gastado vs Límite
                </h2>
                <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
                  Top {topN.length} categorías
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
              tone="warning"
            />
            <FilterChip
              active={filter === "exceeded"}
              onClick={() => setFilter("exceeded")}
              label="Excedidas"
              count={exceededCount}
              tone="danger"
            />
          </div>
        </div>

        {bare && !hasData ? (
          <div className="text-center py-10 text-[#737373] dark:text-[#a1a1aa] text-sm">
            <p className="font-medium">Sin gastos registrados este mes</p>
            <p className="text-xs mt-1">Agrega gastos para ver el comparativo.</p>
          </div>
        ) : !hasData ? null : topN.length === 0 ? (
          <div className="text-center py-10 text-[#737373] dark:text-[#a1a1aa] text-sm">
            <p className="font-medium">Sin categorías en este filtro</p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-xs text-[#17181c] dark:text-white underline mt-1"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mobile: horizontal scroll */}
            <div className="lg:hidden overflow-x-auto scrollbar-none -mx-2 px-2">
              <div className="flex gap-0 md:gap-4 min-w-max">
                {barData.map((d) => {
                  const over = d.spent > d.limit && d.limit > 0;
                  const pct = d.limit > 0 ? (d.spent / d.limit) * 100 : 0;
                  const barHeight = Math.min((d.spent / maxValue) * 160, 160);
                  const limitHeight = Math.min((d.limit / maxValue) * 160, 160);

                  return (
                    <div key={d.id} className="flex flex-col items-center gap-2 w-16">
                      <div className="relative h-[160px] flex items-end">
                        {/* Limit line */}
                        {d.limit > 0 && (
                          <div
                            className="absolute w-full border-t border-dashed border-[#a1a1aa] dark:border-[#737373]"
                            style={{ bottom: `${limitHeight}px` }}
                          />
                        )}
                        {/* Spent bar */}
                        <div
                          className={cn(
                            "w-8 rounded-t-md transition-all",
                            over
                              ? "bg-gradient-to-t from-[#e54d4d] to-[#e54d4d]/70"
                              : "bg-gradient-to-t from-[#17181c] to-[#333438]"
                          )}
                          style={{ height: `${barHeight}px` }}
                        />
                      </div>
                      <div className="text-center space-y-0.5">
                        <p className="text-[10px] font-semibold text-[#17181c] dark:text-white truncate w-16 leading-tight">
                          {d.name}
                        </p>
                        <p className={cn(
                          "text-[9px] font-bold",
                          over ? "text-[#e54d4d]" : "text-[#737373] dark:text-[#a1a1aa]"
                        )}>
                          {pct.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Recharts vertical */}
            <div className="hidden lg:block h-[320px] md:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 30 }}
                  barCategoryGap={12}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: axisColor, fontSize: 11, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: axisColor, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        notation: "compact",
                        maximumFractionDigits: 0,
                      }).format(v)
                    }
                  />
                  <Tooltip
                    cursor={{ fill: cursorFill }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as BarDatum;
                      const over = d.spent > d.limit && d.limit > 0;
                      return (
                        <div className="rounded-xl border border-[#e8e8e8] dark:border-[#26272b] bg-white dark:bg-[#17181c] shadow-md p-2.5 min-w-[180px]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="text-xs font-semibold text-[#17181c] dark:text-white truncate">
                              {d.name}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-[11px]">
                            <div className="flex justify-between gap-3">
                              <span className="text-[#737373] dark:text-[#a1a1aa]">Gastado</span>
                              <span className="font-bold text-[#17181c] dark:text-white tabular-nums">
                                {formatCurrency(d.spent)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-[#737373] dark:text-[#a1a1aa]">Límite</span>
                              <span className="font-bold text-[#17181c] dark:text-white tabular-nums">
                                {d.limit > 0 ? formatCurrency(d.limit) : "—"}
                              </span>
                            </div>
                            {d.limit > 0 && (
                              <div className="flex justify-between gap-3 pt-0.5 border-t border-[#f0f0f0] dark:border-[#26272b]">
                                <span className="text-[#737373] dark:text-[#a1a1aa]">% usado</span>
                                <span
                                  className={cn(
                                    "font-bold tabular-nums",
                                    over
                                      ? "text-[#e54d4d]"
                                      : d.pct > 85
                                      ? "text-[#e7964d]"
                                      : "text-[#23ad1b]"
                                  )}
                                >
                                  {d.pct.toFixed(0)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar
                    dataKey="spent"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={700}
                  >
                    {barData.map((d) => {
                      const over = d.spent > d.limit && d.limit > 0;
                      return (
                        <Cell
                          key={d.id}
                          fill={
                            over
                              ? "#e54d4d"
                              : "url(#gradientBlack)"
                          }
                        />
                      );
                    })}
                  </Bar>
                  <defs>
                    <linearGradient id="gradientBlack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#333438" />
                      <stop offset="100%" stopColor="#17181c" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Simple summary row */}
            <div className="flex items-center gap-4 text-[10px] text-[#737373] dark:text-[#a1a1aa] flex-wrap pt-2 border-t border-[#f0f0f0] dark:border-[#26272b]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-[#17181c]" />
                Gastado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm border border-dashed border-[#a1a1aa] dark:border-[#737373]" />
                Límite
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-[#e54d4d]" />
                Excedido
              </span>
              <span className="ml-auto font-bold text-[#17181c] dark:text-white">
                {exceededCount > 0 ? `${exceededCount} excedidas` : "Sin excedidos"}
              </span>
            </div>
          </div>
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
  tone?: "warning" | "danger";
}

function FilterChip({ active, onClick, label, count, tone }: FilterChipProps) {
  const toneClass = (() => {
    if (!active)
      return "bg-[#f5f5f5] dark:bg-[#1a1a1e] text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f0f0f0] dark:hover:bg-[#26272b]";
    if (tone === "warning")
      return "bg-[#fffbeb] dark:bg-[#e7964d]/10 text-[#e7964d] border border-[#e7964d]/20";
    if (tone === "danger")
      return "bg-[#fef2f2] dark:bg-[#e54d4d]/10 text-[#e54d4d] border border-[#e54d4d]/20";
    return "bg-gradient-to-r from-[#17181c] to-[#333438] text-white";
  })();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-[10px] font-bold uppercase tracking-wider transition-colors",
        toneClass
      )}
    >
      {label}
      <span className="tabular-nums opacity-70">
        {count}
      </span>
    </button>
  );
}
