"use client";

import { useEffect, useState } from "react";
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
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = 0;
    const end = currentIncome;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [currentIncome]);

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
        text: "Ingreso actualizado. El dashboard se recalculó automáticamente.",
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
    <div className="space-y-6">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-to-br from-[#17181c] to-[#333438] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#26be15]/15 flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5 text-[#26be15]" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Ingreso mensual
              </p>
              <h2 className="text-sm font-bold text-white leading-tight">
                Tu base financiera
              </h2>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums text-white leading-[1.05]">
              {formatCOP(displayValue)}
            </p>
            <p className="text-xs text-white/50 font-medium flex items-center gap-1.5">
              <Info className="h-3 w-3 shrink-0" strokeWidth={2.2} />
              Este valor alimenta todos los cálculos de tu dashboard
            </p>
          </div>
        </div>
      </motion.div>

      {/* Edit card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5"
      >
        <header className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#17181c] dark:text-white flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white">
              Actualizar ingreso
            </h2>
            <p className="text-xs md:text-sm text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
              Modifica este valor cuando cambie tu salario o fuentes de ingreso.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="income"
              className="text-xs font-semibold text-[#17181c] dark:text-white"
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
                className="bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5] h-10 px-4"
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
                className="text-xs text-[#e54d4d] font-medium pt-1"
              >
                {errors.income.message}
              </p>
            )}
          </div>

          {feedback && (
            <p
              className={cn(
                "text-xs font-medium",
                feedback.type === "success"
                  ? "text-[#23ad1b]"
                  : "text-[#e54d4d]"
              )}
              role="status"
            >
              {feedback.text}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
