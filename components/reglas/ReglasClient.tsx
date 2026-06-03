"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wallet, SlidersHorizontal, Tags } from "lucide-react";
import { Tabs, type TabItem } from "./Tabs";
import { IncomeEditor } from "./IncomeEditor";
import { RuleEditor } from "./RuleEditor";
import { CategoryManager } from "./CategoryManager";
import type { BudgetRule, Category } from "@/types";

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

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3 w-3" strokeWidth={2.4} />
            Reglas
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
            Configura tu presupuesto
          </h1>
          <p className="text-sm md:text-[15px] text-stone-600 font-medium max-w-2xl leading-relaxed">
            Define tu ingreso, cómo se distribuye y qué categorías lo componen.
            Todos los cambios recalculan tu dashboard.
          </p>
        </header>

        <Tabs
          tabs={TABS}
          active={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
        />

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
