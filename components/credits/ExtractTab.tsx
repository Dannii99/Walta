"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExtractReconciliationCard } from "./ExtractReconciliationCard";
import { ExtractDiffBreakdown } from "./ExtractDiffBreakdown";
import {
  getLoanCalibration,
  CALIBRATION_CONFIG,
} from "@/lib/credit-engine";
import { calculateTotalMonthlyFees } from "@/lib/loan-fees";
import { cn } from "@/lib/utils";
import type { Loan, LoanPayment, LoanExtraPayment, FeeItem } from "@/types";
import { Check, AlertTriangle, AlertCircle, Info, FileText } from "lucide-react";

interface ExtractTabProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
}

const ICONS = {
  check: Check,
  warn: AlertTriangle,
  alert: AlertCircle,
  info: Info,
} as const;

export function ExtractTab({ loan }: ExtractTabProps) {
  const [actualMonthlyPayment, setActualMonthlyPayment] = useState<
    number | null
  >(null);

  const fees = (loan.fees as FeeItem[] | null) ?? [];
  const calculatedMonthly = parseFloat(loan.monthlyPayment) || 0;
  const feesMonthly = calculateTotalMonthlyFees(fees);

  const calibration = useMemo(
    () => getLoanCalibration(calculatedMonthly, feesMonthly, actualMonthlyPayment),
    [calculatedMonthly, feesMonthly, actualMonthlyPayment]
  );

  const config = CALIBRATION_CONFIG[calibration.status];
  const Icon = ICONS[config.icon];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#17181c] dark:text-white">
              Sincroniza con tu extracto bancario
            </h3>
            <p className="text-sm text-[#737373] dark:text-[#a1a1aa] mt-1 leading-relaxed">
              Tu extracto es la fuente de verdad. Compara lo que el banco te
              cobra con nuestros cálculos para asegurarte de que las
              recomendaciones de IA estén basadas en datos reales.
            </p>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border shrink-0",
              config.badge
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={2.5} />
            {config.label}
          </span>
        </div>
      </motion.div>

      <ExtractReconciliationCard
        loanId={loan.id}
        termMonths={loan.termMonths}
        initialPaidInstallments={loan.paidInstallments ?? 0}
        onActualMonthlyChange={setActualMonthlyPayment}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={calibration.status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <ExtractDiffBreakdown calibration={calibration} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
