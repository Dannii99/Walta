"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditAmortizationTable } from "./CreditAmortizationTable";
import { CreditProgressBar } from "./CreditProgressBar";
import { getPaymentStatusCounts } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { AmortizationRow, Loan, LoanPayment, LoanExtraPayment } from "@/types";
import { CalendarDays, CheckCircle2, Clock, AlertTriangle, LayoutList, Eye } from "lucide-react";

interface AmortizationTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  schedule: AmortizationRow[];
  onMarkPaid: (month: number) => Promise<void>;
}

const TABS = [
  { id: "summary", label: "Resumen", icon: Eye },
  { id: "detail", label: "Detalle", icon: LayoutList },
] as const;

function TabsBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + TABS.length) % TABS.length;
    onChange(TABS[next].id);
  };

  return (
    <div
      role="tablist"
      aria-label="Vistas del cronograma"
      className="flex items-center gap-1 p-1 rounded-xl bg-[#f5f5f5]/80 dark:bg-white/5"
    >
      {TABS.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={`schedule-tabpanel-${tab.id}`}
            id={`schedule-tab-${tab.id}`}
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

function ScheduleHeroCard({
  schedule,
  counts,
}: {
  schedule: AmortizationRow[];
  counts: ReturnType<typeof getPaymentStatusCounts>;
}) {
  const totalMonths = schedule.length;
  const paidMonths = counts.paid + counts.paidOff;
  const pendingMonths = counts.pending;
  const defaultedMonths = counts.defaulted;
  const pct = totalMonths > 0 ? Math.round((paidMonths / totalMonths) * 100) : 0;
  const hasDefaulted = defaultedMonths > 0;

  const remainingBalance = useMemo(() => {
    const lastRow = schedule[schedule.length - 1];
    return lastRow?.balance ?? 0;
  }, [schedule]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#17181c] p-5 md:p-6 space-y-4">
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
          {paidMonths}
        </span>
        <span className="text-lg md:text-xl font-bold text-[#737373] dark:text-[#a1a1aa]">
          / {totalMonths}
        </span>
        <span className="text-xs font-medium text-[#737373] dark:text-[#a1a1aa]">
          cuotas
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
            hasDefaulted
              ? "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15 text-[#e54d4d] dark:text-[#e54d4d] border-[#e54d4d]/20 dark:border-[#e54d4d]/20"
              : "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15 text-[#23ad1b] dark:text-[#23ad1b] border-[#23ad1b]/20 dark:border-[#23ad1b]/20"
          )}
        >
          {hasDefaulted ? `${defaultedMonths} mora` : `${pct}%`}
        </span>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[#f5f5f5] dark:bg-white/5"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #23ad1b, #26be15)`,
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="text-[#737373] dark:text-[#a1a1aa]">
          {paidMonths} {paidMonths === 1 ? "pagada" : "pagadas"}
        </span>
        <span className="text-[#737373] dark:text-[#a1a1aa]">·</span>
        <span className="text-[#737373] dark:text-[#a1a1aa]">
          {pendingMonths} {pendingMonths === 1 ? "pendiente" : "pendientes"}
        </span>
        {hasDefaulted && (
          <>
            <span className="text-[#737373] dark:text-[#a1a1aa]">·</span>
            <span className="text-[#e54d4d] font-semibold">
              {defaultedMonths} {defaultedMonths === 1 ? "en mora" : "en mora"}
            </span>
          </>
        )}
      </div>

      <div className="pt-3 border-t border-[#e8e8e8] dark:border-[#2a2a2e] space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
          Saldo pendiente
        </p>
        <p className="text-lg font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
          {formatCOP(remainingBalance)}
        </p>
      </div>
    </div>
  );
}

export function AmortizationTab({ loan, schedule, onMarkPaid }: AmortizationTabProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const counts = useMemo(() => getPaymentStatusCounts(schedule), [schedule]);

  const stats = useMemo(() => {
    const totalMonths = schedule.length;
    const pendingRows = schedule.filter(
      (r) => r.status === "PENDING" || r.status === "DEFAULTED"
    );
    const remainingInterest = pendingRows.reduce((sum, r) => sum + r.interest, 0);
    const totalInterest = schedule.reduce((sum, r) => sum + r.interest, 0);
    const totalPaidMonths = counts.paid + counts.paidOff;

    return [
      {
        label: "Total meses",
        value: `${totalMonths}`,
        sub: `${totalPaidMonths} pagados · ${totalMonths - totalPaidMonths} pendientes`,
        icon: CalendarDays,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-950/40",
      },
      {
        label: "Pagadas",
        value: `${counts.paid}`,
        sub: counts.paidFromExtract > 0
          ? `${counts.paidReal ?? counts.paid - counts.paidFromExtract} reales · ${counts.paidFromExtract} extracto`
          : `${counts.paid} cuotas al día`,
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-950/40",
      },
      {
        label: "Pendientes",
        value: `${counts.pending + counts.defaulted}`,
        sub: counts.defaulted > 0
          ? `${counts.defaulted} en mora · ${Math.round((counts.defaulted / (counts.pending + counts.defaulted)) * 100)}%`
          : `${counts.pending} por pagar`,
        icon: counts.defaulted > 0 ? AlertTriangle : Clock,
        color: counts.defaulted > 0
          ? "text-rose-600 dark:text-rose-400"
          : "text-amber-600 dark:text-amber-400",
        bg: counts.defaulted > 0
          ? "bg-rose-100 dark:bg-rose-950/40"
          : "bg-amber-100 dark:bg-amber-950/40",
      },
      {
        label: "Interés restante",
        value: formatCOP(remainingInterest),
        sub: `${((remainingInterest / (totalInterest || 1)) * 100).toFixed(0)}% del total`,
        icon: CalendarDays,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-100 dark:bg-violet-950/40",
      },
    ];
  }, [schedule, counts]);

  return (
    <div className="space-y-6">
      {/* Schedule stats — tabbed */}
      <section
        className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        aria-labelledby="schedule-stats-heading"
      >
        <div className="p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-0.5">
              <h2
                id="schedule-stats-heading"
                className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#26be15]" />
                Resumen del cronograma
              </h2>
              <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] font-medium">
                {schedule.length} meses · {loan.termMonths} plazo
              </p>
            </div>
            <TabsBar active={activeTab} onChange={setActiveTab} />
          </div>

          <div
            id={`schedule-tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`schedule-tab-${activeTab}`}
            className="min-h-[180px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === "summary" ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScheduleHeroCard schedule={schedule} counts={counts} />
                </motion.div>
              ) : (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {stats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={i}
                          className="rounded-2xl bg-[#f5f5f5]/60 dark:bg-white/[0.03] p-4 md:p-5"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div
                              className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center shrink-0",
                                stat.bg
                              )}
                            >
                              <Icon className={cn("h-3.5 w-3.5", stat.color)} strokeWidth={2.2} />
                            </div>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                            {stat.label}
                          </p>
                          <p className="text-sm md:text-base font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white mt-1">
                            {stat.value}
                          </p>
                          <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] mt-0.5 line-clamp-2">
                            {stat.sub}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <CreditProgressBar loan={loan} schedule={schedule} />
      <CreditAmortizationTable schedule={schedule} onMarkPaid={onMarkPaid} />
    </div>
  );
}
