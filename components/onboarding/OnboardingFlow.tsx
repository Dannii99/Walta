"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBudget } from "@/server/actions/budget-actions";
import { DEFAULT_BUDGET_RULE } from "@/lib/constants";
import { PREDEFINED_CATEGORIES } from "@/lib/categories";
import type { CategoryType } from "@/types";
import { StepIndicator } from "./StepIndicator";
import { WelcomeStep } from "./WelcomeStep";
import { IncomeStep } from "./IncomeStep";
import { ReviewStep } from "./ReviewStep";

export interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  description?: string;
  plannedAmount: number | null;
}

const STEPS = [
  { label: "Bienvenida" },
  { label: "Ingreso" },
  { label: "Categorías" },
];

const TYPE_COLORS: Record<CategoryType, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

function buildInitialCategories(): CategoryItem[] {
  return PREDEFINED_CATEGORIES.map((c, index) => ({
    id: `cat-${index}`,
    name: c.name,
    type: c.type,
    icon: c.icon,
    description: c.description,
    plannedAmount: null,
  }));
}

interface OnboardingFlowProps {
  userId: string;
}

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [budgetName, setBudgetName] = useState("Mi Presupuesto");
  const [income, setIncome] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleStart = () => {
    setStep(2);
  };

  const persistBudget = async (cats: CategoryItem[], inc: number) => {
    await createBudget(
      userId,
      budgetName || "Mi Presupuesto",
      inc.toString(),
      DEFAULT_BUDGET_RULE,
      cats.map((c) => ({
        name: c.name,
        type: c.type,
        color: TYPE_COLORS[c.type],
        icon: c.icon,
        description: c.description,
        plannedAmount: c.plannedAmount !== null ? Math.round(c.plannedAmount).toString() : null,
      }))
    );
  };

  const handleQuickCreate = async () => {
    setError("");
    setIsSaving(true);
    try {
      const quickIncome = 3000000;
      const quickCategories = buildInitialCategories();
      await persistBudget(quickCategories, quickIncome);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el presupuesto");
      setIsSaving(false);
    }
  };

  const handleSkipAll = async () => {
    setError("");
    setIsSaving(true);
    try {
      const emptyCats = buildInitialCategories();
      await persistBudget(emptyCats, income > 0 ? income : 3000000);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el presupuesto");
      setIsSaving(false);
    }
  };

  const handleIncomeNext = () => {
    if (income > 0) {
      setCategories(buildInitialCategories());
      setStep(3);
    }
  };

  const handleSave = async () => {
    if (income <= 0 || categories.length === 0) return;

    setError("");
    setIsSaving(true);
    try {
      await persistBudget(categories, income);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el presupuesto");
      setIsSaving(false);
    }
  };

  const canGoNext = () => {
    switch (step) {
      case 2:
        return income > 0 && budgetName.trim().length > 0;
      case 3:
        return categories.length > 0 && !isSaving;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 2) {
      handleIncomeNext();
    } else if (step === 3) {
      handleSave();
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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
                {step === 1 && (
                  <WelcomeStep onStart={handleStart} onQuickCreate={handleQuickCreate} />
                )}

                {step === 2 && (
                  <IncomeStep
                    budgetName={budgetName}
                    income={income}
                    onBudgetNameChange={setBudgetName}
                    onIncomeChange={setIncome}
                  />
                )}

                {step === 3 && (
                  <ReviewStep
                    income={income}
                    categories={categories}
                    onCategoriesChange={setCategories}
                    onSkipAll={handleSkipAll}
                    onFinalize={handleSave}
                    onBack={handleBack}
                    isSaving={isSaving}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            {step > 1 && step < 3 && (
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
                  Siguiente
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