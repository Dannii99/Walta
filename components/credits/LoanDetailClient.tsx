"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoanDetailSummary } from "./LoanDetailSummary";
import { AmortizationTable } from "./AmortizationTable";
import { PaymentRecorder } from "./PaymentRecorder";
import { CapitalContributionForm } from "./CapitalContributionForm";
import { LoanProgressBar } from "./LoanProgressBar";
import { recordPayment, recordCapitalContribution } from "@/server/actions/loan-actions";
import { generateAmortizationSchedule } from "@/lib/loan-engine";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";
import { Receipt, PiggyBank, CalendarDays } from "lucide-react";

type TabKey = "amortization" | "payments" | "extras";

interface LoanDetailClientProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

export function LoanDetailClient({ loan }: LoanDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("amortization");
  const [refreshKey, setRefreshKey] = useState(0);

  const schedule = generateAmortizationSchedule(loan, loan.payments, loan.extraPayments);

  const handleRecordPayment = async (data: {
    amount: string;
    principalPaid: string;
    interestPaid: string;
    paidDate: Date;
  }) => {
    await recordPayment(loan.id, data);
    setRefreshKey((k) => k + 1);
  };

  const handleRecordExtra = async (data: {
    amount: string;
    date: Date;
    note?: string | null;
  }) => {
    await recordCapitalContribution(loan.id, data);
    setRefreshKey((k) => k + 1);
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "amortization", label: "Amortización", icon: CalendarDays },
    { key: "payments", label: "Pagos", icon: Receipt },
    { key: "extras", label: "Abonos", icon: PiggyBank },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{loan.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              {loan.type === "VEHICLE" && "Vehículo"}
              {loan.type === "PERSONAL" && "Personal"}
              {loan.type === "HOUSING" && "Vivienda"}
              {loan.type === "OTHER" && "Otros"}
            </Badge>
            <Badge
              variant="outline"
              className={
                loan.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : loan.status === "PAID_OFF"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-red-100 text-red-800 border-red-200"
              }
            >
              {loan.status === "ACTIVE" && "Activo"}
              {loan.status === "PAID_OFF" && "Pagado"}
              {loan.status === "DEFAULTED" && "En mora"}
            </Badge>
            <Badge variant="secondary">
              {loan.formula === "french_ea" ? "Francesa (EA)" : "Nominal (NAMV/12)"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
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

      <LoanDetailSummary loan={loan} />
      <LoanProgressBar loan={loan} schedule={schedule} />

      {/* Custom tabs */}
      <div className="border-b">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + refreshKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "amortization" && (
            <AmortizationTable schedule={schedule} />
          )}
          {activeTab === "payments" && (
            <PaymentsList payments={loan.payments} />
          )}
          {activeTab === "extras" && (
            <ExtrasList extras={loan.extraPayments} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PaymentsList({ payments }: { payments: LoanPayment[] }) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hay pagos registrados aún.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pagos realizados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div>
                <p className="font-medium text-sm">
                  {new Date(p.paidDate).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Capital: {formatCOP(parseFloat(p.principalPaid))} · Interés: {formatCOP(parseFloat(p.interestPaid))}
                </p>
              </div>
              <span className="font-bold text-sm">{formatCOP(parseFloat(p.amount))}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExtrasList({ extras }: { extras: LoanExtraPayment[] }) {
  if (extras.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No hay abonos a capital registrados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Abonos a capital</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {extras.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div>
                <p className="font-medium text-sm">
                  {new Date(e.date).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {e.note && <p className="text-xs text-muted-foreground">{e.note}</p>}
              </div>
              <span className="font-bold text-sm text-emerald-600">{formatCOP(parseFloat(e.amount))}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}
