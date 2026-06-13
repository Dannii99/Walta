"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, SlidersHorizontal, Tags, TrendingUp } from "lucide-react";
import { Tabs, type TabItem } from "./Tabs";
import { IncomeEditor } from "./IncomeEditor";
import { RuleEditor } from "./RuleEditor";
import { CategoryManager } from "./CategoryManager";
import type { BudgetRule, Category } from "@/types";
import { formatCOP } from "@/lib/currency";

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

type TabId = "ingreso" | "regla" | "categorias";

const TABS: TabItem[] = [
  { id: "ingreso", label: "Ingreso", icon: Wallet },
  { id: "regla", label: "Regla", icon: SlidersHorizontal },
  { id: "categorias", label: "Categorías", icon: Tags },
];

interface ReglasClientProps {
  budgetId: string;
  currentIncome: number;
  currentRule: BudgetRule;
  categories: CategoryWithCount[];
}

export function ReglasClient({
  budgetId,
  currentIncome,
  currentRule,
  categories,
}: ReglasClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("ingreso");

  const totalNeeds = currentRule.needs;
  const totalWants = currentRule.wants;
  const totalSavings = currentRule.savings;

  const summaryCards = [
    {
      label: "Ingreso mensual",
      value: formatCOP(currentIncome),
      icon: TrendingUp,
      color: "bg-[#23ad1b]/10 text-[#23ad1b]",
    },
    {
      label: "Regla activa",
      value: `${totalNeeds}% · ${totalWants}% · ${totalSavings}%`,
      icon: SlidersHorizontal,
      color: "bg-[#617dd5]/10 text-[#617dd5]",
    },
    {
      label: "Categorías",
      value: `${categories.length}`,
      icon: Tags,
      color: "bg-[#e7964d]/10 text-[#e7964d]",
    },
  ];

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" strokeWidth={2.4} />
            Reglas
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-tight">
            Configura tu presupuesto
          </h1>
          <p className="text-sm md:text-[15px] text-[#737373] dark:text-[#a1a1aa] font-medium max-w-2xl leading-relaxed">
            Define tu ingreso, cómo se distribuye y qué categorías lo componen.
            Todos los cambios recalculan tu dashboard.
          </p>
        </header>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {summaryCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 md:p-5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] truncate">
                    {card.label}
                  </p>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.color}`}>
                    <Icon className="h-4 w-4" strokeWidth={2.3} />
                  </div>
                </div>
                <p className="text-xl md:text-2xl font-extrabold tracking-tight text-[#17181c] dark:text-white tabular-nums">
                  {card.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs
          tabs={TABS}
          active={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "ingreso" && (
              <IncomeEditor budgetId={budgetId} currentIncome={currentIncome} />
            )}
            {activeTab === "regla" && (
              <RuleEditor
                budgetId={budgetId}
                currentRule={currentRule}
                income={currentIncome}
              />
            )}
            {activeTab === "categorias" && (
              <CategoryManager budgetId={budgetId} categories={categories} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
