"use client";

import { useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { AvailableHero } from "@/components/dashboard/AvailableHero";
import { MiniStatsRow } from "@/components/dashboard/MiniStatsRow";
import { HealthCards } from "@/components/dashboard/HealthCards";
import { SimulatorQuickAccess } from "@/components/dashboard/SimulatorQuickAccess";
import { CategoryChartsTabs } from "@/components/dashboard/CategoryChartsTabs";
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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:py-8 space-y-6 md:space-y-8 max-w-360 mx-auto">
      {/* Greeting as page title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          {greeting},{" "}
          <span className="text-[#26be15]">{userName}</span>
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium">
          {monthLabel} · {budgetName}
        </p>
      </div>

      <AvailableHero
        available={available}
        income={income}
        expenses={monthlyEquivalentExpenses}
        savingsCapacity={savingsCapacity}
        expensesPct={Number(expensesPct)}
        overBudget={overBudget}
        healthStatus={healthStatus}
        dynamicMessage={dynamicMessage}
        onAddExpense={() => setOpenAddModal(true)}
        reducedMotion={shouldReduceMotion}
      />

      <MiniStatsRow
        income={income}
        expenses={monthlyEquivalentExpenses}
        savingsCapacity={savingsCapacity}
        expensesPct={Number(expensesPct)}
        overBudget={overBudget}
        reducedMotion={shouldReduceMotion}
      />

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
