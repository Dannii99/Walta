"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoanForm } from "./LoanForm";
import { LoanFormSteps } from "./LoanFormSteps";
import { AvailableCreditCard } from "./AvailableCreditCard";

interface NewCreditPageClientProps {
  mode: "new" | "ongoing";
  defaultValues?: Record<string, unknown> | null;
  availableMoney: number;
  income: number;
  activeLoansCount: number;
  activeLoansMonthly: number;
  isOngoing: boolean;
  titleText: string;
  subtitleText: string;
}

export function NewCreditPageClient({
  mode,
  defaultValues,
  availableMoney,
  income,
  activeLoansCount,
  activeLoansMonthly,
  isOngoing,
  titleText,
  subtitleText,
}: NewCreditPageClientProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = mode === "ongoing" ? 3 : 2;

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/credits">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Créditos
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 shrink-0">
            <FileSignature className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
              {isOngoing ? "En curso" : "Nuevo"}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-tight">
              {titleText}
            </h1>
          </div>
        </div>
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium max-w-2xl">
          {subtitleText}
        </p>
      </div>

      {/* Step indicator — always visible above grid on mobile */}
      <LoanFormSteps step={currentStep} totalSteps={totalSteps} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <LoanForm
            mode={mode}
            defaultValues={defaultValues}
            availableMoney={availableMoney}
            hideStepIndicator
            step={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <AvailableCreditCard
            income={income}
            availableMoney={availableMoney}
            activeLoansCount={activeLoansCount}
            activeLoansMonthly={activeLoansMonthly}
          />
        </div>
      </div>
    </div>
  );
}
