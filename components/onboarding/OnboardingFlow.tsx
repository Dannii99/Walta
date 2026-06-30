"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBudget } from "@/server/actions/budget-actions";
import { DEFAULT_BUDGET_RULE } from "@/lib/constants";
import type { BudgetRule } from "@/types";
import { StepIndicator } from "./StepIndicator";
import { WelcomeStep } from "./WelcomeStep";
import { IncomeStep } from "./IncomeStep";
import { RuleStep } from "./RuleStep";
import { CategoryEducationStep } from "./CategoryEducationStep";

const STEPS = [
  { label: "Bienvenida" },
  { label: "Ingreso" },
  { label: "Distribución" },
  { label: "Categorías" },
];

interface OnboardingFlowProps {
  userId: string;
}

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [budgetName, setBudgetName] = useState("Mi Presupuesto");
  const [income, setIncome] = useState(0);
  const [rule, setRule] = useState<BudgetRule>(DEFAULT_BUDGET_RULE);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const persistBudget = async () => {
    await createBudget(userId, budgetName, income.toString(), rule);
  };

  const handleSave = async () => {
    if (income <= 0) return;

    setError("");
    setIsSaving(true);
    try {
      await persistBudget();
      toast.success("¡Presupuesto creado! Empieza a agregar tus gastos");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el presupuesto");
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      if (income > 0) setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canGoNext = () => {
    switch (step) {
      case 1: return true;
      case 2: return income > 0 && budgetName.trim().length > 0;
      case 3: return true;
      case 4: return !isSaving;
      default: return false;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(38,190,21,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(97,125,213,0.10) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
        {step > 1 && (
          <div className="mb-8">
            <StepIndicator steps={STEPS} currentStep={step} />
          </div>
        )}

        <div className="rounded-2xl bg-card border border-border shadow-lg dark:shadow-black/20 overflow-hidden">
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {step === 1 && <WelcomeStep onStart={() => setStep(2)} />}

                {step === 2 && (
                  <IncomeStep
                    budgetName={budgetName}
                    income={income}
                    onBudgetNameChange={setBudgetName}
                    onIncomeChange={setIncome}
                  />
                )}

                {step === 3 && (
                  <RuleStep
                    rule={rule}
                    onRuleChange={setRule}
                    onSkip={() => {
                      setRule(DEFAULT_BUDGET_RULE);
                      setStep(4);
                    }}
                  />
                )}

                {step === 4 && (
                  <CategoryEducationStep
                    onContinue={handleSave}
                    isLoading={isSaving}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            {step > 1 && step < 4 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Atrás
                </Button>

                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={!canGoNext()}
                  className="rounded-full"
                >
                  {step === 3 ? "Continuar" : "Siguiente"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground font-medium">
          Tu dinero, más claro.
        </p>
      </div>
    </div>
  );
}
