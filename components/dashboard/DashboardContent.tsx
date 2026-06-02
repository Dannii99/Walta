"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { KPICard } from "@/components/dashboard/KPICard";
import { SimulatorQuickAccess } from "@/components/dashboard/SimulatorQuickAccess";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { HealthCards } from "@/components/dashboard/HealthCards";
import {
  CategoryBreakdown,
  type BreakdownItem,
} from "@/components/dashboard/CategoryBreakdown";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import type { Category } from "@/types";
import { getDynamicMessage, type HealthStatus } from "@/lib/dashboard-helpers";

interface DashboardContentProps {
  budgetName: string;
  monthLabel: string;
  ruleName: string;
  income: number;
  expenses: number;
  monthlyEquivalentExpenses: number;
  available: number;
  savingsCapacity: number;
  healthStatus: HealthStatus;
  expensesPct: string;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
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
  monthLabel,
  ruleName,
  income,
  expenses,
  monthlyEquivalentExpenses,
  available,
  savingsCapacity,
  healthStatus,
  expensesPct,
  needsPct,
  wantsPct,
  savingsPct,
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
  const { openAddModal, setOpenAddModal } = useDashboard();
  const router = useRouter();

  const dynamicMessage = getDynamicMessage(
    healthStatus,
    available,
    Number(expensesPct)
  );
  const overBudget = monthlyEquivalentExpenses > income;

  const handleExpenseAdded = () => {
    setOpenAddModal(false);
    router.refresh();
  };

  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6 max-w-7xl mx-auto">
      <HeroSection
        budgetName={budgetName}
        monthLabel={monthLabel}
        available={available}
        income={income}
        monthlyEquivalentExpenses={monthlyEquivalentExpenses}
        status={healthStatus}
        dynamicMessage={dynamicMessage}
        onAddExpense={() => setOpenAddModal(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KPICard
          title="Ingreso Mensual"
          value={income}
          icon="income"
          subtitle="Tu base del mes"
        />
        <KPICard
          title="Gastos del Mes"
          value={monthlyEquivalentExpenses}
          icon="expenses"
          subtitle={`${expensesPct}% del ingreso · Real ${formatCurrency(expenses)}`}
        />
        <KPICard
          title="Disponible"
          value={available}
          icon="available"
          subtitle={overBudget ? "⚠️ Sobre el presupuesto" : "Lo que puedes usar"}
        />
        <KPICard
          title="Capacidad de ahorro"
          value={savingsCapacity}
          icon="savings"
          subtitle="Reserva este mes"
        />
      </motion.div>

      <SimulatorQuickAccess />

      <HealthCards
        ruleName={ruleName}
        needsPct={needsPct}
        wantsPct={wantsPct}
        savingsPct={savingsPct}
        needsSpent={needsSpent}
        needsLimit={needsLimit}
        wantsSpent={wantsSpent}
        wantsLimit={wantsLimit}
        savingsSpent={savingsSpent}
        savingsLimit={savingsLimit}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6">
        <div className="xl:col-span-2">
          <CategoryDonutChart data={donutData} variant="hero" monthLabel={monthLabel} />
        </div>
        <div className="xl:col-span-1">
          <CategoryBreakdown items={categoriesBreakdown} />
        </div>
      </div>

      <AddExpenseModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={handleExpenseAdded}
      />
    </div>
  );
}
