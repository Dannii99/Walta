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
  LabelList,
} from "recharts";
import { BarChart3, Plus, TrendingUp, AlertTriangle, Tag, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/currency";
import { useDashboard } from "@/components/dashboard/DashboardContext";
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
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

type FilterKey = "all" | "exceeded" | "near";

export function CategoryLimitsBarChart({ items }: CategoryLimitsBarChartProps) {
  const { setOpenAddModal } = useDashboard();
  const [filter, setFilter] = useState<FilterKey>("all");

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.spent - a.spent),
    [items]
  );

  const totalSpent = sorted.reduce((sum, i) => sum + i.spent, 0);
  const totalLimit = sorted.reduce((sum, i) => sum + i.limit, 0);
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

  const barData = topN.map((i) => ({
    name: i.name,
    spent: i.spent,
    limit: Math.max(i.limit, i.spent),
    color: i.color,
    type: i.type,
    id: i.id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-100 text-stone-700 shrink-0">
              <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-stone-900">
                Gastado vs Límite
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                Equivalente mensual · top {topN.length} categorías
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
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

        {!hasData ? (
          <div className="text-center py-12 text-stone-500 text-sm space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-stone-500" />
            </div>
            <p className="font-medium">Aún no hay datos para graficar</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddModal(true)}
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar tu primer gasto
            </Button>
          </div>
        ) : topN.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-sm">
            <p className="font-medium">
              Sin categorías en este filtro
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-xs text-stone-700 underline mt-1"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <>
            <div className="h-[320px] md:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
                  barCategoryGap={6}
                >
                  <XAxis
                    type="number"
                    hide
                    domain={[0, (dataMax: number) => dataMax * 1.05]}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#57534e", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload as (typeof barData)[number];
                      const pct =
                        d.limit > 0 ? (d.spent / d.limit) * 100 : 0;
                      const over = d.spent > d.limit && d.limit > 0;
                      return (
                        <div className="rounded-lg border border-stone-200 bg-white shadow-md p-2.5 min-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: d.color }}
                            />
                            <span className="text-xs font-semibold text-stone-900 truncate">
                              {d.name}
                            </span>
                          </div>
                          <div className="space-y-0.5 text-[11px]">
                            <div className="flex justify-between gap-3">
                              <span className="text-stone-500">Gastado</span>
                              <span className="font-bold text-stone-900 tabular-nums">
                                {formatCurrency(d.spent)}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3">
                              <span className="text-stone-500">Límite</span>
                              <span className="font-bold text-stone-900 tabular-nums">
                                {d.limit > 0
                                  ? formatCurrency(d.limit)
                                  : "—"}
                              </span>
                            </div>
                            {d.limit > 0 && (
                              <div className="flex justify-between gap-3 pt-0.5 border-t border-stone-100">
                                <span className="text-stone-500">% usado</span>
                                <span
                                  className={cn(
                                    "font-bold tabular-nums",
                                    over
                                      ? "text-rose-700"
                                      : pct > 85
                                      ? "text-amber-700"
                                      : "text-stone-900"
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
                    fill="#0c0a09"
                    radius={[0, 6, 6, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="spent"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={28}
                  >
                    {barData.map((entry, index) => {
                      const isOver =
                        entry.limit > 0 && entry.spent > entry.limit;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isOver ? "#e11d48" : entry.color}
                        />
                      );
                    })}
                    <LabelList
                      dataKey="spent"
                      position="right"
                      formatter={(v) => formatCurrency(typeof v === "number" ? v : 0)}
                      style={{
                        fill: "#0c0a09",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100">
              <SummaryStat
                icon={BarChart3}
                label="Categorías"
                value={String(sorted.length)}
                valueColor="text-stone-900"
              />
              <SummaryStat
                icon={TrendingUp}
                label="Gastado"
                value={formatCOP(totalSpent)}
                valueColor="text-stone-900"
              />
              <SummaryStat
                icon={AlertTriangle}
                label="Excedidas"
                value={String(exceededCount)}
                valueColor={exceededCount > 0 ? "text-rose-700" : "text-stone-900"}
              />
              <SummaryStat
                icon={Tag}
                label="Disponible"
                value={formatCOP(Math.max(totalLimit - totalSpent, 0))}
                valueColor={
                  totalLimit - totalSpent > 0
                    ? "text-emerald-700"
                    : "text-stone-900"
                }
              />
            </div>

            <div className="flex items-center gap-3 text-[10px] text-stone-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-stone-900" />
                Límite
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-stone-700" />
                Gastado dentro del límite
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
    if (!active) return "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100";
    if (tone === "amber")
      return "bg-amber-50 border-amber-200 text-amber-700";
    if (tone === "rose")
      return "bg-rose-50 border-rose-200 text-rose-700";
    return "bg-stone-900 border-stone-900 text-white";
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
          active && tone === undefined && "text-white/70",
          active && tone === "amber" && "text-amber-700/70",
          active && tone === "rose" && "text-rose-700/70"
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
      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-stone-500">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <p className={cn("text-sm font-extrabold tabular-nums", valueColor)}>
        {value}
      </p>
    </div>
  );
}
