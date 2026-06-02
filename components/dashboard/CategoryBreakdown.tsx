"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/currency";
import type { CategoryType } from "@/types";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import {
  Plus,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Tag,
  Home,
  Building,
  ShoppingCart,
  UtensilsCrossed,
  Zap,
  Droplet,
  Flame,
  Wifi,
  Bus,
  Fuel,
  HeartPulse,
  Shield,
  CreditCard,
  Phone,
  Tv,
  Coffee,
  Shirt,
  ShoppingBag,
  Dumbbell,
  Repeat,
  Plane,
  Smartphone,
  PiggyBank,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { getCategoryIconName } from "@/lib/dashboard-helpers";

export interface BreakdownItem {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  spent: number;
  limit: number;
}

interface CategoryBreakdownProps {
  items: BreakdownItem[];
}

const typeLabels: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const typeBadgeStyles: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-100 text-emerald-800 border-emerald-300",
  WANTS: "bg-amber-100 text-amber-800 border-amber-300",
  SAVINGS: "bg-blue-100 text-blue-800 border-blue-300",
  DEBT: "bg-rose-100 text-rose-800 border-rose-300",
};

const typeIconStyles: Record<CategoryType, string> = {
  NEEDS: "from-emerald-500 to-teal-500",
  WANTS: "from-amber-500 to-orange-500",
  SAVINGS: "from-blue-500 to-indigo-500",
  DEBT: "from-rose-500 to-pink-500",
};

const iconRegistry: Record<string, LucideIcon> = {
  Home,
  Building,
  ShoppingCart,
  UtensilsCrossed,
  Zap,
  Droplet,
  Flame,
  Wifi,
  Bus,
  Fuel,
  HeartPulse,
  Shield,
  CreditCard,
  Landline: Phone,
  Tv,
  Coffee,
  Shirt,
  ShoppingBag,
  Dumbbell,
  Repeat,
  Plane,
  Smartphone,
  PiggyBank,
  TrendingUp,
  Briefcase,
  Tag,
};

function getStatus(percentage: number) {
  if (percentage <= 85) {
    return {
      color: "[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500",
      text: "text-emerald-600",
      pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }
  if (percentage <= 100) {
    return {
      color: "[&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500",
      text: "text-amber-600",
      pill: "bg-amber-100 text-amber-700 border-amber-200",
    };
  }
  return {
    color: "[&>div]:bg-gradient-to-r [&>div]:from-rose-500 [&>div]:to-pink-500",
    text: "text-rose-600",
    pill: "bg-rose-100 text-rose-700 border-rose-200",
  };
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  const { setOpenAddModal } = useDashboard();

  const sorted = [...items].sort((a, b) => b.spent - a.spent);
  const totalSpent = sorted.reduce((sum, i) => sum + i.spent, 0);
  const overBudget = sorted.filter((i) => i.limit > 0 && i.spent > i.limit).length;
  const totalLimit = sorted.reduce((sum, i) => sum + i.limit, 0);
  const overage = totalSpent - totalLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 shadow-xl ring-1 ring-black/5 h-full"
    >
      <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-3xl" />

      <div className="relative p-5 md:p-6 space-y-4 md:space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shrink-0">
              <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-tight">
                Detalle por Categoría
              </h2>
              <p className="text-[11px] text-muted-foreground font-medium truncate">
                Ordenado por mayor gasto
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenAddModal(true)}
            className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>

        {totalSpent > 0 && totalLimit > 0 && (
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="rounded-xl border border-border/60 bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5 md:p-3">
              <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-blue-700">
                <BarChart3 className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span className="truncate">Categorías</span>
              </div>
              <div className="text-xl md:text-2xl font-extrabold tabular-nums text-blue-900 mt-0.5 md:mt-1">
                {sorted.length}
              </div>
            </div>
            <div
              className={`rounded-xl border border-border/60 p-2.5 md:p-3 ${
                overBudget > 0
                  ? "bg-gradient-to-br from-rose-50 to-pink-50"
                  : "bg-gradient-to-br from-emerald-50 to-teal-50"
              }`}
            >
              <div
                className={`flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                  overBudget > 0 ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                {overBudget > 0 ? (
                  <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5 md:h-3 md:w-3" />
                )}
                <span className="truncate">Excedidas</span>
              </div>
              <div
                className={`text-xl md:text-2xl font-extrabold tabular-nums mt-0.5 md:mt-1 ${
                  overBudget > 0 ? "text-rose-900" : "text-emerald-900"
                }`}
              >
                {overBudget}
              </div>
            </div>
            <div
              className={`rounded-xl border border-border/60 p-2.5 md:p-3 ${
                overage > 0
                  ? "bg-gradient-to-br from-amber-50 to-orange-50"
                  : "bg-gradient-to-br from-cyan-50 to-sky-50"
              }`}
            >
              <div
                className={`flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                  overage > 0 ? "text-amber-700" : "text-cyan-700"
                }`}
              >
                {overage > 0 ? "Excedido" : "Holgura"}
              </div>
              <div
                className={`text-base md:text-lg font-extrabold tabular-nums mt-0.5 md:mt-1 leading-tight ${
                  overage > 0 ? "text-amber-900" : "text-cyan-900"
                }`}
              >
                {formatCOP(Math.abs(overage))}
              </div>
            </div>
          </div>
        )}

        {sorted.length === 0 || totalSpent === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-indigo-500" />
            </div>
            <p className="font-medium">No hay gastos registrados este mes</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAddModal(true)}
              className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar tu primer gasto
            </Button>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 max-h-[420px] overflow-y-auto pr-1 -mr-1">
            {sorted.map((item, i) => {
              const percentage =
                item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
              const shareOfTotal =
                totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
              const status = getStatus(percentage);
              const iconGradient = typeIconStyles[item.type] ?? "from-gray-400 to-gray-500";
              const IconKey = getCategoryIconName(item.name);
              const Icon = iconRegistry[IconKey] ?? Tag;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${iconGradient} text-white shadow-sm shrink-0`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </div>
                      <span className="font-semibold text-sm truncate">
                        {item.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] md:text-[10px] font-bold shrink-0 hidden sm:inline-flex ${
                          typeBadgeStyles[item.type] ?? ""
                        }`}
                      >
                        {typeLabels[item.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold tabular-nums px-1.5 md:px-2 py-0.5 rounded-full border ${status.pill}`}
                      >
                        {shareOfTotal.toFixed(0)}%
                      </span>
                      <span
                        className={`text-sm font-extrabold tabular-nums ${status.text}`}
                      >
                        {formatCOP(item.spent)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 flex-1 ${status.color}`}
                    />
                    <span className="text-[10px] md:text-[11px] text-muted-foreground font-medium shrink-0 w-24 md:w-28 text-right tabular-nums">
                      de {formatCOP(item.limit)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
