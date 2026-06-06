"use client";

import { CreditAmortizationTable } from "./CreditAmortizationTable";
import { CapitalImpactSimulator } from "./CapitalImpactSimulator";
import { AccionesCard } from "./AccionesCard";
import type { AmortizationRow, Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface AmortizationTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  schedule: AmortizationRow[];
  onMarkPaid: (month: number) => Promise<void>;
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

export function AmortizationTab({
  loan,
  schedule,
  onMarkPaid,
  onRecordPayment,
  onRecordExtra,
  refreshKey,
}: AmortizationTabProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <div className="xl:col-span-3 min-w-0">
        <CreditAmortizationTable
          schedule={schedule}
          onMarkPaid={onMarkPaid}
        />
      </div>
      <div className="space-y-4">
        <AccionesCard
          loan={loan}
          onRecordPayment={onRecordPayment}
          onRecordExtra={onRecordExtra}
          refreshKey={refreshKey}
        />
        <CapitalImpactSimulator
          key={`simulator-${refreshKey}`}
          loan={loan}
        />
      </div>
    </div>
  );
}
