"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { SlidersHorizontal, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBudget } from "@/server/actions/budget-actions";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { BudgetRule } from "@/types";

const ruleSchema = z.object({
  needs: z.number().int().min(0).max(100),
  wants: z.number().int().min(0).max(100),
  savings: z.number().int().min(0).max(100),
}).refine((data) => data.needs + data.wants + data.savings === 100, {
  message: "Los porcentajes deben sumar exactamente 100%",
  path: ["root"],
});

type RuleForm = z.infer<typeof ruleSchema>;

interface RuleEditorProps {
  budgetId: string;
  currentRule: BudgetRule;
  income: number;
}

const categoryMeta = [
  { key: "needs" as const, label: "Necesidades", color: "bg-emerald-500", textColor: "text-emerald-600 dark:text-emerald-400", fillColor: "#10b981" },
  { key: "wants" as const, label: "Deseos", color: "bg-amber-500", textColor: "text-amber-600 dark:text-amber-400", fillColor: "#f59e0b" },
  { key: "savings" as const, label: "Ahorros", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400", fillColor: "#3b82f6" },
];

export function RuleEditor({ budgetId, currentRule, income }: RuleEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: currentRule,
  });

  const values = useWatch({ control }) as RuleForm;
  const total = (values.needs || 0) + (values.wants || 0) + (values.savings || 0);
  const isValid = total === 100;

  const onSubmit = async (data: RuleForm) => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await updateBudget(budgetId, { rule: data });
      setFeedback({
        type: "success",
        text: "Regla actualizada. El dashboard se recalculó con los nuevos porcentajes.",
      });
    } catch {
      setFeedback({
        type: "error",
        text: "No pudimos guardar la regla. Inténtalo de nuevo.",
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
      className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-6"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200 flex items-center justify-center shrink-0">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Regla 50/30/20
          </h2>
          <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5 leading-relaxed">
            Ajusta los porcentajes de distribución de tu ingreso. La suma debe
            ser exactamente 100%.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          {categoryMeta.map((meta) => {
            const value = values[meta.key] ?? 0;
            const amount = income * (value / 100);
            return (
              <div key={meta.key} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label
                    htmlFor={meta.key}
                    className={cn("font-semibold text-sm", meta.textColor)}
                  >
                    {meta.label}
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id={meta.key}
                      type="number"
                      min={0}
                      max={100}
                      className="h-9 w-20 text-right tabular-nums"
                      {...register(meta.key, { valueAsNumber: true })}
                    />
                    <span className="text-sm text-stone-500 dark:text-stone-400 font-semibold w-5">%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-300", meta.color)}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium text-right tabular-nums">
                  Aproximadamente {formatCOP(amount)}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "flex items-center justify-between p-3.5 rounded-xl border",
            isValid
              ? "border-stone-200/60 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/50"
              : "border-rose-200 bg-rose-50/40 dark:border-rose-900/60 dark:bg-rose-950/30"
          )}
        >
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">Total</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-lg font-extrabold tabular-nums",
                isValid ? "text-stone-900 dark:text-stone-50" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {total}%
            </span>
            {!isValid && (
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {total > 100 ? `Excede en ${total - 100}%` : `Faltan ${100 - total}%`}
              </span>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">{errors.root.message}</p>
        )}

        <div className="flex items-center flex-wrap gap-3 pt-1">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" strokeWidth={2.2} />
                Guardar regla
              </>
            )}
          </Button>
          {feedback && (
            <span
              className={cn(
                "text-xs font-medium",
                feedback.type === "success" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
              role="status"
            >
              {feedback.text}
            </span>
          )}
        </div>
      </form>

      <div className="pt-5 border-t border-stone-200/60 dark:border-stone-800 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Vista previa
        </p>
        <div className="h-8 w-full rounded-full overflow-hidden flex bg-stone-100 dark:bg-stone-800">
          {categoryMeta.map((meta) => {
            const value = values[meta.key] ?? 0;
            return (
              <div
                key={meta.key}
                className={cn(
                  "h-full flex items-center justify-center text-xs text-white font-bold transition-all duration-300",
                  meta.color
                )}
                style={{ width: `${value}%` }}
              >
                {value > 8 ? `${value}%` : ""}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
          {categoryMeta.map((meta) => (
            <div key={meta.key} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", meta.color)} />
              <span>{meta.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
