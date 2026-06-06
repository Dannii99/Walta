"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, PiggyBank, CalendarDays, FileText } from "lucide-react";
import { CreditDetailHeader } from "./CreditDetailHeader";
import { CreditSummary } from "./CreditSummary";
import { CreditProgressBar } from "./CreditProgressBar";
import { CreditPaymentsList } from "./CreditPaymentsList";
import { CreditExtrasList } from "./CreditExtrasList";
import { CreditCharts } from "./CreditCharts";
import { DeleteCreditDialog } from "./DeleteCreditDialog";
import { AmortizationTab } from "./AmortizationTab";
import { ExtractTab } from "./ExtractTab";
import { AILoanAdvisorCard } from "./AILoanAdvisorCard";
import { EditExtraPaymentDialog } from "./EditExtraPaymentDialog";
import { DeleteExtraPaymentDialog } from "./DeleteExtraPaymentDialog";
import {
  recordPayment,
  recordCapitalContribution,
  deleteLoan,
  updateExtraPayment,
  deleteExtraPayment,
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
  const [editingExtra, setEditingExtra] = useState<LoanExtraPayment | null>(null);
  const [deletingExtra, setDeletingExtra] = useState<LoanExtraPayment | null>(null);

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

  const handleUpdateExtra = async (data: {
    amount: string;
    date: Date;
  }) => {
    if (!editingExtra) return;
    await updateExtraPayment(editingExtra.id, data);
    setRefreshKey((k) => k + 1);
    router.refresh();
    toast.success("Abono actualizado", {
      description: "Los cambios se reflejaron en la tabla de amortización.",
    });
  };

  const handleDeleteExtra = async () => {
    if (!deletingExtra) return;
    await deleteExtraPayment(deletingExtra.id);
    setRefreshKey((k) => k + 1);
    setDeletingExtra(null);
    router.refresh();
    toast.success("Abono eliminado", {
      description: "El saldo y plazo se recalcularon.",
    });
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
            <AmortizationTab
              loan={loan}
              schedule={schedule}
              onMarkPaid={handleMarkPaid}
              onRecordPayment={handleRecordPayment}
              onRecordExtra={handleRecordExtra}
              refreshKey={refreshKey}
            />
          )}
          {activeTab === "payments" && (
            <CreditPaymentsList payments={loan.payments} />
          )}
          {activeTab === "extras" && (
            <CreditExtrasList
              extras={loan.extraPayments}
              onEdit={setEditingExtra}
              onDelete={setDeletingExtra}
            />
          )}
          {activeTab === "extract" && <ExtractTab loan={loan} />}
        </motion.div>
      </AnimatePresence>

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

      <EditExtraPaymentDialog
        extra={editingExtra}
        onOpenChange={(open) => !open && setEditingExtra(null)}
        onUpdate={handleUpdateExtra}
      />

      <DeleteExtraPaymentDialog
        extra={deletingExtra}
        onOpenChange={(open) => !open && setDeletingExtra(null)}
        onConfirm={handleDeleteExtra}
      />
    </div>
  );
}
