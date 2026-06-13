"use client";

import { CreditPaymentsList } from "./CreditPaymentsList";
import { CreditCharts } from "./CreditCharts";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

interface PaymentsTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

export function PaymentsTab({ loan }: PaymentsTabProps) {
  return (
    <div className="space-y-6">
      <CreditPaymentsList payments={loan.payments} />
      <CreditCharts loan={loan} />
    </div>
  );
}
