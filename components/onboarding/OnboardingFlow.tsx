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
import { TemplateStep } from "./TemplateStep";
import { IncomeStep } from "./IncomeStep";
import { ReviewStep } from "./ReviewStep";

interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  suggestedAmount: number;
  icon: string;
  description?: string;
}

const STEPS = [
  { label: "Bienvenida" },
  { label: "Plantilla" },
  { label: "Ingreso" },
  { label: "Revisar" },
];

const TYPE_COLORS: Record<CategoryType, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

const DEFAULT_PERCENTAGES: Record<string, number> = {
  Hogar: 25,
  Alimentación: 10,
  Transporte: 5,
  Salud: 5,
  Servicios: 5,
  Deudas: 0,
  Ocio: 15,
  Compras: 10,
  Entretenimiento: 5,
  Viajes: 0,
  Ahorro: 15,
  Inversiones: 5,
};

const FULL_TEMPLATE_KEYS = PREDEFINED_CATEGORIES.map((c) => c.name);
const MINIMAL_KEYS = ["Hogar", "Alimentación", "Transporte", "Deudas", "Ocio", "Ahorro"];

function generateFromTemplate(
  keys: string[],
  inc: number
): CategoryItem[] {
  return keys.map((name, index) => {
    const predef = PREDEFINED_CATEGORIES.find((c) => c.name === name);
    if (!predef) return null as never;
    const pct = DEFAULT_PERCENTAGES[name] ?? 5;
    return {
      id: `cat-${index}`,
      name: predef.name,
      type: predef.type,
      suggestedAmount: Math.round(inc * (pct / 100)),
      icon: predef.icon,
      description: predef.description,
    };
  }).filter(Boolean);
}

interface OnboardingFlowProps {
  userId: string;
}

export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState<"standard" | "minimal" | "blank" | null>(null);
  const [budgetName, setBudgetName] = useState("Mi Presupuesto");
  const [income, setIncome] = useState(0);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleStart = () => {
    setStep(2);
  };

  const handleQuickCreate = async () => {
    setError("");
    setIsSaving(true);
    try {
      const quickIncome = 3000000;
      const quickCategories = generateFromTemplate(FULL_TEMPLATE_KEYS, quickIncome);

      await createBudget(
        userId,
        "Mi Presupuesto",
        quickIncome.toString(),
        DEFAULT_BUDGET_RULE,
        quickCategories.map((c) => ({
          name: c.name,
          type: c.type,
          color: TYPE_COLORS[c.type],
          icon: c.icon,
          description: c.description,
        }))
      );

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el presupuesto");
      setIsSaving(false);
    }
  };

  const handleTemplateSelect = (selected: "standard" | "minimal" | "blank") => {
    setTemplate(selected);
    if (selected === "blank") {
      setCategories([]);
    }
    setStep(3);
  };

  const handleIncomeNext = () => {
    if (template && income > 0) {
      let generated: CategoryItem[] = [];
      if (template === "standard") {
        generated = generateFromTemplate(FULL_TEMPLATE_KEYS, income);
      } else if (template === "minimal") {
        generated = generateFromTemplate(MINIMAL_KEYS, income);
      }
      setCategories(generated);
      setStep(4);
    }
  };

  const handleSave = async () => {
    if (!template || income <= 0 || categories.length === 0) return;

    setError("");
    setIsSaving(true);
    try {
      await createBudget(
        userId,
        budgetName || "Mi Presupuesto",
        income.toString(),
        DEFAULT_BUDGET_RULE,
        categories.map((c) => ({
          name: c.name,
          type: c.type,
          color: TYPE_COLORS[c.type],
          icon: c.icon,
          description: c.description,
        }))
      );

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
        return template !== null;
      case 3:
        return income > 0 && budgetName.trim().length > 0;
      case 4:
        return categories.length > 0 && !isSaving;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 3) {
      handleIncomeNext();
    } else if (step === 4) {
      handleSave();
    } else if (step < 4) {
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
                  <TemplateStep
                    value={template}
                    onChange={handleTemplateSelect}
                  />
                )}

                {step === 3 && (
                  <IncomeStep
                    budgetName={budgetName}
                    income={income}
                    onBudgetNameChange={setBudgetName}
                    onIncomeChange={setIncome}
                  />
                )}

                {step === 4 && (
                  <ReviewStep
                    income={income}
                    categories={categories}
                    onCategoriesChange={setCategories}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 p-3 text-sm text-destructive font-medium">
                {error}
              </div>
            )}

            {step > 1 && (
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
                  {step === 4 ? (
                    isSaving ? "Guardando..." : "Guardar y empezar"
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
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