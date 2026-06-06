"use client";

import { CreditAmortizationTable } from "./CreditAmortizationTable";
import type { AmortizationRow, Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface AmortizationTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  schedule: AmortizationRow[];
  onMarkPaid: (month: number) => Promise<void>;
}

export function AmortizationTab({ schedule, onMarkPaid }: AmortizationTabProps) {
  return (
    <CreditAmortizationTable
      schedule={schedule}
      onMarkPaid={onMarkPaid}
    />
  );
}
