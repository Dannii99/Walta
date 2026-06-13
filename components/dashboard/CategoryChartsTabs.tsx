"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PieChart, BarChart3, type LucideIcon } from "lucide-react";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import {
  CategoryLimitsBarChart,
  type BarChartItem,
} from "@/components/dashboard/CategoryLimitsBarChart";
import { cn } from "@/lib/utils";

interface CategoryChartsTabsProps {
  donutData: { name: string; value: number; color?: string }[];
  barItems: BarChartItem[];
  monthLabel: string;
  reducedMotion?: boolean;
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: "donut", label: "Distribución", icon: PieChart },
  { id: "bar", label: "Gastado vs Límite", icon: BarChart3 },
];

function ChartsTabs({
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
      aria-label="Vistas de gráficos"
      className={cn(
        "flex items-center gap-1 p-1 rounded-xl bg-white/50 dark:bg-white/5",
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

export function CategoryChartsTabs({
  donutData,
  barItems,
  monthLabel,
  reducedMotion,
}: CategoryChartsTabsProps) {
  const [active, setActive] = useState<string>("donut");

  return (
    <section
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      aria-labelledby="charts-heading"
    >
      <div className="p-6 md:p-7 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <h2
              id="charts-heading"
              className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#26be15]" />
              Visualización de gastos
            </h2>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
              {monthLabel} · Equivalente mensual
            </p>
          </div>
          <ChartsTabs tabs={TABS} active={active} onChange={setActive} />
        </div>

        <div
          id={`tabpanel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="min-h-[320px] md:min-h-[400px]"
        >
          <AnimatePresence mode="wait">
            {active === "donut" ? (
              <motion.div
                key="donut"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryDonutChart data={donutData} monthLabel={monthLabel} bare reducedMotion={reducedMotion} />
              </motion.div>
            ) : (
              <motion.div
                key="bar"
                initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CategoryLimitsBarChart items={barItems} bare reducedMotion={reducedMotion} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
