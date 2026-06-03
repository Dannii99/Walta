"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Wallet, Save, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { updateBudget } from "@/server/actions/budget-actions";
import { useRouter } from "next/navigation";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";

const incomeSchema = z.object({
  income: z
    .number({ message: "Ingresa un valor numérico" })
    .positive("El ingreso debe ser mayor a 0")
    .finite("Ingresa un valor válido"),
});

type IncomeForm = z.infer<typeof incomeSchema>;

interface IncomeEditorProps {
  budgetId: string;
  currentIncome: number;
}

export function IncomeEditor({ budgetId, currentIncome }: IncomeEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<IncomeForm>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { income: currentIncome },
  });

  const onSubmit = async (data: IncomeForm) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await updateBudget(budgetId, { income: data.income.toString() });
      setFeedback({
        type: "success",
        text: "Ingreso actualizado. Reglas y categorías se recalcularon en el dashboard.",
      });
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "No pudimos guardar el cambio. Inténtalo de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shrink-0">
          <Wallet className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Tu ingreso mensual
          </h2>
          <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5 leading-relaxed">
            Es la base sobre la que calculamos los límites de tu presupuesto y
            los gráficos del dashboard.
          </p>
        </div>
      </header>

      <div className="rounded-xl bg-stone-50 border border-stone-200/60 dark:bg-stone-900/50 dark:border-stone-800 p-4 md:p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
          Ingreso actual
        </p>
        <p
          className="text-3xl md:text-5xl font-extrabold tracking-tight tabular-nums leading-[1.05] text-stone-900 dark:text-stone-50"
          aria-live="polite"
        >
          {formatCOP(currentIncome)}
        </p>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-2 flex items-start gap-1.5">
          <Info className="h-3 w-3 mt-0.5 shrink-0" strokeWidth={2.2} />
          <span>Modifica este valor cuando cambie tu salario o fuentes de ingreso.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1.5">
          <Label
            htmlFor="income"
            className="text-xs font-semibold text-stone-700 dark:text-stone-300"
          >
            Nuevo ingreso
          </Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <CurrencyInput
              id="income"
              {...register("income", { valueAsNumber: true })}
              className="h-10 flex-1"
              aria-invalid={!!errors.income}
              aria-describedby={errors.income ? "income-error" : undefined}
            />
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 h-10 px-4"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" strokeWidth={2.2} />
              )}
              Guardar
            </Button>
          </div>
          {errors.income && (
            <p
              id="income-error"
              className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1"
            >
              {errors.income.message}
            </p>
          )}
        </div>

        {feedback && (
          <p
            className={cn(
              "text-xs font-medium",
              feedback.type === "success" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}
            role="status"
          >
            {feedback.text}
          </p>
        )}
      </form>
    </motion.section>
  );
}
