"use client";

import { useMemo } from "react";
import { CreditAmortizationTable } from "./CreditAmortizationTable";
import { CreditProgressBar } from "./CreditProgressBar";
import { getPaymentStatusCounts } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { AmortizationRow, Loan, LoanPayment, LoanExtraPayment } from "@/types";
import { CalendarDays, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface AmortizationTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  schedule: AmortizationRow[];
  onMarkPaid: (month: number) => Promise<void>;
}

export function AmortizationTab({ loan, schedule, onMarkPaid }: AmortizationTabProps) {
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
      {/* Schedule stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#17181c] p-4 md:p-5"
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

      {/* Progress bar */}
      <CreditProgressBar loan={loan} schedule={schedule} />

      {/* Amortization table */}
      <CreditAmortizationTable
        schedule={schedule}
        onMarkPaid={onMarkPaid}
      />
    </div>
  );
}
