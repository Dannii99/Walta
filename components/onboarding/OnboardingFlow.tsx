"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createBudget } from "@/server/actions/budget-actions";
import { DEFAULT_BUDGET_RULE } from "@/lib/constants";
import type { BudgetRule } from "@/types";
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

  const nextLabel = () => {
    if (step === 1) return "Comenzar";
    if (step === 3) return "Continuar";
    if (step === 4) return isSaving ? "Creando..." : "Crear presupuesto";
    return "Siguiente";
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background dark:bg-[#17181c]">
      <div
        className="pointer-events-none fixed -top-32 -right-32 h-80 w-80 rounded-full blur-3xl dark:block hidden"
        style={{ background: "radial-gradient(circle, rgba(38,190,21,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl dark:block hidden"
        style={{ background: "radial-gradient(circle, rgba(97,125,213,0.10) 0%, transparent 70%)" }}
      />

      <header className="fixed top-0 left-0 right-0 z-20 h-14 pt-safe">
        <div className="flex h-full items-center px-4">
          {step > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 dark:bg-white/10 backdrop-blur-sm text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
              aria-label="Atrás"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-16 pb-36 overscroll-contain scroll-smooth">
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {step === 1 && <WelcomeStep />}

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
                />
              )}

              {step === 4 && <CategoryEducationStep />}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/15 dark:bg-destructive/20 border border-destructive/30 dark:border-destructive/40 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-20 pb-safe">
        <div className="flex flex-col items-center gap-3 px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={!canGoNext()}
            className="h-10 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-200"
          >
            {isSaving && step === 4 ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creando...
              </span>
            ) : (
              nextLabel()
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Pasos del onboarding">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === step - 1
                    ? "bg-primary w-5"
                    : "bg-muted-foreground/30 dark:bg-white/20"
                }`}
                role="tab"
                aria-selected={i === step - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
