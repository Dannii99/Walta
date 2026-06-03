"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { SaasHeader } from "@/components/shared/SaasHeader";
import { AvailableHero } from "@/components/dashboard/AvailableHero";
import { SimulatorQuickAccess } from "@/components/dashboard/SimulatorQuickAccess";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { HealthCards } from "@/components/dashboard/HealthCards";
import {
  CategoryLimitsBarChart,
  type BarChartItem,
} from "@/components/dashboard/CategoryLimitsBarChart";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import type { Category } from "@/types";
import { getDynamicMessage, type HealthStatus } from "@/lib/dashboard-helpers";

interface DashboardContentProps {
  userName: string;
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
  categoriesBreakdown: BarChartItem[];
  categories: Category[];
}

export function DashboardContent({
  userName,
  budgetName,
  monthLabel,
  ruleName,
  income,
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
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 space-y-6 md:space-y-8 max-w-[1440px] mx-auto">
      <SaasHeader
        userName={userName}
        monthLabel={monthLabel}
        budgetName={budgetName}
        dynamicMessage={dynamicMessage}
        status={healthStatus}
        onAddExpense={() => setOpenAddModal(true)}
      />

      <AvailableHero
        available={available}
        income={income}
        expenses={monthlyEquivalentExpenses}
        savingsCapacity={savingsCapacity}
        expensesPct={Number(expensesPct)}
        overBudget={overBudget}
        onAddExpense={() => setOpenAddModal(true)}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <CategoryDonutChart data={donutData} monthLabel={monthLabel} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CategoryLimitsBarChart items={categoriesBreakdown} />
      </motion.div>

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

      <SimulatorQuickAccess />

      <AddExpenseModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={handleExpenseAdded}
      />
    </div>
  );
}
