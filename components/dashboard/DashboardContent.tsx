"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { SaasHeader } from "@/components/shared/SaasHeader";
import { AvailableHero } from "@/components/dashboard/AvailableHero";
import { SimulatorQuickAccess } from "@/components/dashboard/SimulatorQuickAccess";
import { CategoryChartsTabs } from "@/components/dashboard/CategoryChartsTabs";
import { HealthCards } from "@/components/dashboard/HealthCards";
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
  savingsRate: number;
  healthStatus: HealthStatus;
  expensesPct: string;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  donutData: { name: string; value: number; color?: string }[];
  categoriesBreakdown: import("@/components/dashboard/CategoryLimitsBarChart").BarChartItem[];
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
  savingsRate,
  healthStatus,
  expensesPct,
  needsPct,
  wantsPct,
  savingsPct,
  needsSpent,
  needsLimit,
  wantsSpent,
  wantsLimit,
  donutData,
  categoriesBreakdown,
  categories,
}: DashboardContentProps) {
  const { openAddModal, setOpenAddModal } = useDashboard();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion() ?? false;

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
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 space-y-8 md:space-y-10 max-w-[1440px] mx-auto">
      <SaasHeader
        userName={userName}
        monthLabel={monthLabel}
        budgetName={budgetName}
        dynamicMessage={dynamicMessage}
        status={healthStatus}
        onAddExpense={() => setOpenAddModal(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        <div className="lg:col-span-7">
          <AvailableHero
            available={available}
            income={income}
            expenses={monthlyEquivalentExpenses}
            savingsCapacity={savingsCapacity}
            expensesPct={Number(expensesPct)}
            overBudget={overBudget}
            onAddExpense={() => setOpenAddModal(true)}
            reducedMotion={shouldReduceMotion}
          />
        </div>
        <div className="lg:col-span-5">
          <HealthCards
            ruleName={ruleName}
            needsPct={needsPct}
            wantsPct={wantsPct}
            savingsPct={savingsPct}
            needsSpent={needsSpent}
            needsLimit={needsLimit}
            wantsSpent={wantsSpent}
            wantsLimit={wantsLimit}
            savingsRate={savingsRate}
            income={income}
            monthlyEquivalentExpenses={monthlyEquivalentExpenses}
            reducedMotion={shouldReduceMotion}
          />
        </div>
      </div>

      <CategoryChartsTabs
        donutData={donutData}
        barItems={categoriesBreakdown}
        monthLabel={monthLabel}
        reducedMotion={shouldReduceMotion}
      />

      <SimulatorQuickAccess reducedMotion={shouldReduceMotion} />

      <AddExpenseModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={handleExpenseAdded}
      />
    </div>
  );
}
