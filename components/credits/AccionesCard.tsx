"use client";

import { PaymentRecorder } from "./PaymentRecorder";
import { CapitalContributionForm } from "./CapitalContributionForm";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface AccionesCardProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  onRecordPayment: (data: {
    amount: string;
    principalPaid: string;
    interestPaid: string;
    paidDate: Date;
  }) => Promise<void>;
  onRecordExtra: (data: {
    amount: string;
    date: Date;
    note?: string | null;
  }) => Promise<void>;
  refreshKey: number;
}

export function AccionesCard({
  loan,
  onRecordPayment,
  onRecordExtra,
  refreshKey,
}: AccionesCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
        Acciones rápidas
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Registra pagos o abonos para mantener tu crédito al día.
      </p>
      <div className="flex flex-col gap-2">
        <PaymentRecorder
          loan={loan}
          onRecord={onRecordPayment}
          triggerRefresh={refreshKey}
        />
        <CapitalContributionForm
          onRecord={onRecordExtra}
          triggerRefresh={refreshKey}
        />
      </div>
    </div>
  );
}
