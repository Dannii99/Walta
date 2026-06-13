"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, PieChart, type LucideIcon } from "lucide-react";
import { ExpenseSummary } from "@/components/expenses/ExpenseSummary";
import { ExpenseTypeCards } from "@/components/expenses/ExpenseTypeCards";
import { cn } from "@/lib/utils";
import type { BudgetRule } from "@/types";

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: "summary", label: "Resumen", icon: TrendingUp },
  { id: "distribution", label: "Distribución", icon: PieChart },
];

interface SummaryTabsProps {
  totalEquivalent: number;
  oneTimeTotal: number;
  income: number;
  rule: BudgetRule;
  totalsByType: Record<"NEEDS" | "WANTS" | "SAVINGS", number>;
  savingsRate: number;
  reducedMotion?: boolean;
}

function SummaryTabsBar({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + tabs.length) % tabs.length;
    onChange(tabs[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Vistas de resumen"
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl bg-[#f5f5f5]/80 dark:bg-white/5",
        className
      )}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-lg",
              "text-xs md:text-sm font-semibold whitespace-nowrap",
              "transition-colors duration-150 outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#26be15] focus-visible:ring-offset-1",
              isActive
                ? "bg-gradient-to-r from-[#17181c] to-[#333438] text-white shadow-sm"
                : "text-[#737373] hover:text-[#17181c] dark:text-[#a1a1aa] dark:hover:text-white"
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function ExpenseSummaryTabs({
  totalEquivalent,
  oneTimeTotal,
  income,
  rule,
  totalsByType,
  savingsRate,
  reducedMotion,
}: SummaryTabsProps) {
  const [active, setActive] = useState<string>("summary");

  return (
    <section
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      aria-labelledby="summary-heading"
    >
      <div className="p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <h2
              id="summary-heading"
              className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#26be15]" />
              Gastos por tipo
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
              Equivalente mensual · Regla {rule.needs}/{rule.wants}/{rule.savings}
            </p>
          </div>
          <SummaryTabsBar tabs={TABS} active={active} onChange={setActive} />
        </div>

        <div
          id={`tabpanel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="min-h-[240px]"
        >
          <AnimatePresence mode="wait">
            {active === "summary" ? (
              <motion.div
                key="summary"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ExpenseSummary
                  totalEquivalent={totalEquivalent}
                  oneTimeTotal={oneTimeTotal}
                  income={income}
                />
              </motion.div>
            ) : (
              <motion.div
                key="distribution"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ExpenseTypeCards
                  totals={totalsByType}
                  income={income}
                  rule={rule}
                  savingsRate={savingsRate}
                  totalEquivalent={totalEquivalent}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
