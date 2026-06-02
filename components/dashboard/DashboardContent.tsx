"use client";

import { useDashboard } from "@/components/dashboard/DashboardContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { HealthCards } from "@/components/dashboard/HealthCards";
import { CategoryBreakdown, type BreakdownItem } from "@/components/dashboard/CategoryBreakdown";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { Plus, Sparkles } from "lucide-react";

interface DashboardContentProps {
  budgetName: string;
  income: number;
  expenses: number;
  monthlyEquivalentExpenses: number;
  available: number;
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsSpent: number;
  savingsLimit: number;
  donutData: { name: string; value: number; color?: string }[];
  categoriesBreakdown: BreakdownItem[];
  categories: Category[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export function DashboardContent({
  budgetName,
  income,
  expenses,
  monthlyEquivalentExpenses,
  available,
  needsSpent,
  needsLimit,
  wantsSpent,
  wantsLimit,
  savingsSpent,
  savingsLimit,
  donutData,
  categoriesBreakdown,
  categories,
}: DashboardContentProps) {
  const { openAddModal, setOpenAddModal, triggerRefresh } = useDashboard();

  const expensesPct =
    income > 0 ? ((monthlyEquivalentExpenses / income) * 100).toFixed(0) : "0";
  const overBudget = monthlyEquivalentExpenses > income;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-lg ring-1 ring-black/5">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-purple-500/15 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/10 to-rose-500/10 blur-2xl" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Tu presupuesto
              </p>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              {budgetName}
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Resumen de tu presupuesto mensual · equivalente mensual
            </p>
          </div>
          <Button
            onClick={() => setOpenAddModal(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Agregar gasto
          </Button>
        </div>
      </div>

      {/* HERO: Donut Chart full-width */}
      <CategoryDonutChart data={donutData} variant="hero" />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Ingreso Mensual"
          value={income}
          icon="income"
          subtitle="Presupuesto total"
        />
        <KPICard
          title="Gastos del Mes"
          value={monthlyEquivalentExpenses}
          icon="expenses"
          subtitle={`${expensesPct}% del ingreso · Real: ${formatCurrency(expenses)}`}
        />
        <KPICard
          title="Disponible"
          value={available}
          icon="available"
          subtitle={overBudget ? "⚠️ Sobre el presupuesto" : "Equiv. mensual"}
        />
      </div>

      {/* Health Cards */}
      <HealthCards
        needsSpent={needsSpent}
        needsLimit={needsLimit}
        wantsSpent={wantsSpent}
        wantsLimit={wantsLimit}
        savingsSpent={savingsSpent}
        savingsLimit={savingsLimit}
      />

      {/* Category Breakdown */}
      <CategoryBreakdown items={categoriesBreakdown} />

      {/* Add Modal */}
      <AddExpenseModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={triggerRefresh}
      />
    </div>
  );
}
