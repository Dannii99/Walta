"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, PiggyBank, CalendarDays, FileText } from "lucide-react";
import { CreditDetailHeader } from "./CreditDetailHeader";
import { CreditSummary } from "./CreditSummary";
import { CreditProgressBar } from "./CreditProgressBar";
import { CreditAmortizationTable } from "./CreditAmortizationTable";
import { CreditPaymentsList } from "./CreditPaymentsList";
import { CreditExtrasList } from "./CreditExtrasList";
import { CreditCharts } from "./CreditCharts";
import { DeleteCreditDialog } from "./DeleteCreditDialog";
import { PaymentRecorder } from "./PaymentRecorder";
import { CapitalContributionForm } from "./CapitalContributionForm";
import { CapitalImpactSimulator } from "./CapitalImpactSimulator";
import { AILoanAdvisorCard } from "./AILoanAdvisorCard";
import { ExtractTab } from "./ExtractTab";
import {
  recordPayment,
  recordCapitalContribution,
  deleteLoan,
} from "@/server/actions/loan-actions";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import { toast } from "sonner";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

type TabKey = "amortization" | "payments" | "extras" | "extract";

interface CreditDetailClientProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

const TABS: { key: TabKey; label: string; icon: typeof Receipt }[] = [
  { key: "amortization", label: "Amortización", icon: CalendarDays },
  { key: "payments", label: "Pagos", icon: Receipt },
  { key: "extras", label: "Abonos", icon: PiggyBank },
  { key: "extract", label: "Extracto", icon: FileText },
];

export function CreditDetailClient({ loan }: CreditDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("amortization");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const schedule = generateAmortizationSchedule(
    loan,
    loan.payments,
    loan.extraPayments
  );

  const handleRecordPayment = async (data: {
    amount: string;
    principalPaid: string;
    interestPaid: string;
    paidDate: Date;
  }) => {
    await recordPayment(loan.id, data);
    setRefreshKey((k) => k + 1);
    router.refresh();
  };

  const handleRecordExtra = async (data: {
    amount: string;
    date: Date;
    note?: string | null;
  }) => {
    await recordCapitalContribution(loan.id, data);
    setRefreshKey((k) => k + 1);
    router.refresh();
  };

  const handleMarkPaid = async (month: number) => {
    const row = schedule.find((r) => r.month === month);
    if (!row) return;

    await recordPayment(loan.id, {
      amount: String(row.payment.toFixed(2)),
      principalPaid: String(row.principal.toFixed(2)),
      interestPaid: String(row.interest.toFixed(2)),
      paidDate: row.date,
    });
    setRefreshKey((k) => k + 1);
    router.refresh();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLoan(loan.id);
      toast.success("Crédito eliminado", {
        description: `Se eliminó "${loan.title}" correctamente.`,
      });
      router.push("/credits");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar el crédito."
      );
    }
  };

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <CreditDetailHeader
        loan={loan}
        onDelete={() => setShowDeleteDialog(true)}
        isDeleting={isDeleting}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as TabKey)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-6">
          <CreditSummary key={`summary-${refreshKey}`} loan={loan} />
          <CreditProgressBar
            key={`progress-${refreshKey}`}
            loan={loan}
            schedule={schedule}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + refreshKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "amortization" && (
                <CreditAmortizationTable
                  schedule={schedule}
                  onMarkPaid={handleMarkPaid}
                />
              )}
              {activeTab === "payments" && (
                <CreditPaymentsList payments={loan.payments} />
              )}
              {activeTab === "extras" && (
                <CreditExtrasList extras={loan.extraPayments} />
              )}
              {activeTab === "extract" && <ExtractTab loan={loan} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="space-y-6">
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
                onRecord={handleRecordPayment}
                triggerRefresh={refreshKey}
              />
              <CapitalContributionForm
                onRecord={handleRecordExtra}
                triggerRefresh={refreshKey}
              />
            </div>
          </div>

          <CapitalImpactSimulator
            key={`simulator-${refreshKey}`}
            loan={loan}
          />
        </div>
      </div>

      <CreditCharts key={`charts-${refreshKey}`} loan={loan} />

      <AILoanAdvisorCard loanId={loan.id} />

      <DeleteCreditDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        creditTitle={loan.title}
        paymentCount={loan.payments.length}
        extrasCount={loan.extraPayments.length}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
