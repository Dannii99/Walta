"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/currency";
import type { CategoryType } from "@/types";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import {
  Plus,
  BarChart3,
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
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { getCategoryIconName } from "@/lib/dashboard-helpers";
import { cn } from "@/lib/utils";

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
      bar: "[&>div]:bg-emerald-500",
      text: "text-stone-900",
      pill: "bg-stone-100 text-stone-600 border-stone-200",
    };
  }
  if (percentage <= 100) {
    return {
      bar: "[&>div]:bg-amber-500",
      text: "text-amber-700",
      pill: "bg-amber-50 text-amber-700 border-amber-200",
    };
  }
  return {
    bar: "[&>div]:bg-rose-500",
    text: "text-rose-700",
    pill: "bg-rose-50 text-rose-700 border-rose-200",
  };
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  const { setOpenAddModal } = useDashboard();

  const sorted = [...items].sort((a, b) => b.spent - a.spent);
  const totalSpent = sorted.reduce((sum, i) => sum + i.spent, 0);
  const overBudget = sorted.filter((i) => i.limit > 0 && i.spent > i.limit).length;
  const totalLimit = sorted.reduce((sum, i) => sum + i.limit, 0);
  const overage = totalSpent - totalLimit;
  const hasItems = sorted.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-full"
    >
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-100 text-stone-700 shrink-0">
              <BarChart3 className="h-3.5 w-3.5" strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold tracking-tight text-stone-900">
                Detalle por Categoría
              </h2>
              <p className="text-[11px] text-stone-500 font-medium truncate">
                Ordenado por mayor gasto
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOpenAddModal(true)}
            className="h-8 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Agregar
          </Button>
        </div>

        {hasItems && totalSpent > 0 && (
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-stone-100">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                Categorías
              </p>
              <p className="text-lg font-extrabold tabular-nums text-stone-900 mt-0.5">
                {sorted.length}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                {overBudget > 0 ? (
                  <TrendingUp className="h-2.5 w-2.5 text-rose-600" />
                ) : (
                  <TrendingDown className="h-2.5 w-2.5 text-emerald-600" />
                )}
                Excedidas
              </p>
              <p
                className={cn(
                  "text-lg font-extrabold tabular-nums mt-0.5",
                  overBudget > 0 ? "text-rose-700" : "text-stone-900"
                )}
              >
                {overBudget}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500">
                {overage > 0 ? "Excedido" : "Holgura"}
              </p>
              <p
                className={cn(
                  "text-sm font-extrabold tabular-nums mt-0.5 leading-tight",
                  overage > 0 ? "text-amber-700" : "text-stone-900"
                )}
              >
                {formatCOP(Math.abs(overage))}
              </p>
            </div>
          </div>
        )}

        {!hasItems || totalSpent === 0 ? (
          <div className="text-center py-10 text-stone-500 text-sm space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-stone-500" />
            </div>
            <p className="font-medium">No hay gastos registrados este mes</p>
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
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 -mr-1">
            {sorted.map((item) => {
              const percentage =
                item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
              const shareOfTotal =
                totalSpent > 0 ? (item.spent / totalSpent) * 100 : 0;
              const status = getStatus(percentage);
              const IconKey = getCategoryIconName(item.name);
              const Icon = iconRegistry[IconKey] ?? Tag;

              return (
                <div key={item.id} className="space-y-2 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-100 text-stone-700 shrink-0">
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.3} />
                      </div>
                      <span className="font-semibold text-sm text-stone-900 truncate">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-stone-500 hidden sm:inline">
                        · {typeLabels[item.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-bold tabular-nums text-stone-500">
                        {shareOfTotal.toFixed(0)}%
                      </span>
                      <span className="text-sm font-extrabold tabular-nums text-stone-900">
                        {formatCOP(item.spent)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={cn("h-1.5 flex-1 bg-stone-100", status.bar)}
                    />
                    <span className="text-[10px] text-stone-500 font-medium shrink-0 w-24 md:w-28 text-right tabular-nums">
                      de {formatCOP(item.limit)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
