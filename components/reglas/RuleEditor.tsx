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
  {
    key: "needs" as const,
    label: "Necesidades",
    color: "bg-[var(--color-needs)]",
    track: "bg-[var(--color-needs)]/10",
    textColor: "text-[var(--color-needs)]",
    darkTrack: "dark:bg-[var(--color-needs)]/10",
  },
  {
    key: "wants" as const,
    label: "Deseos",
    color: "bg-[var(--color-wants)]",
    track: "bg-[var(--color-wants)]/10",
    textColor: "text-[var(--color-wants)]",
    darkTrack: "dark:bg-[var(--color-wants)]/10",
  },
  {
    key: "savings" as const,
    label: "Ahorros",
    color: "bg-[var(--color-savings)]",
    track: "bg-[var(--color-savings)]/10",
    textColor: "text-[var(--color-savings)]",
    darkTrack: "dark:bg-[var(--color-savings)]/10",
  },
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-6"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#17181c] dark:text-white flex items-center justify-center shrink-0">
          <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white">
            Regla de distribución
          </h2>
          <p className="text-xs md:text-sm text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
            Ajusta los porcentajes de distribución de tu ingreso. La suma debe ser exactamente 100%.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-5">
          {categoryMeta.map((meta) => {
            const value = values[meta.key] ?? 0;
            const amount = income * (value / 100);
            return (
              <div key={meta.key} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-2.5 w-2.5 rounded-full", meta.color)} />
                    <Label
                      htmlFor={meta.key}
                      className={cn("font-semibold text-sm", meta.textColor)}
                    >
                      {meta.label}
                    </Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id={meta.key}
                      type="number"
                      min={0}
                      max={100}
                      className={cn(
                        "h-9 w-20 text-right tabular-nums border-[#e8e8e8] dark:border-[#2a2a2e]",
                        "focus-visible:ring-[var(--color-wants)]/40 focus-visible:ring-offset-1"
                      )}
                      {...register(meta.key, { valueAsNumber: true })}
                    />
                    <span className="text-sm text-[#737373] dark:text-[#a1a1aa] font-semibold w-5">
                      %
                    </span>
                  </div>
                </div>
                <div className={cn("h-2.5 w-full rounded-full overflow-hidden", meta.track, meta.darkTrack)}>
                  <motion.div
                    className={cn("h-full rounded-full", meta.color)}
                    initial={false}
                    animate={{ width: `${Math.min(value, 100)}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium text-right tabular-nums">
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
              ? "border-[#e8e8e8] bg-[#fafafa] dark:border-[#2a2a2e] dark:bg-[#1a1a1e]"
              : "border-[#e54d4d]/30 bg-[#e54d4d]/5 dark:border-[#e54d4d]/20 dark:bg-[#e54d4d]/10"
          )}
        >
          <span className="text-sm font-semibold text-[#17181c] dark:text-white">
            Total
          </span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-lg font-extrabold tabular-nums",
                isValid
                  ? "text-[#17181c] dark:text-white"
                  : "text-[#e54d4d]"
              )}
            >
              {total}%
            </span>
            {!isValid && (
              <span className="text-xs text-[#e54d4d] font-medium">
                {total > 100
                  ? `Excede en ${total - 100}%`
                  : `Faltan ${100 - total}%`}
              </span>
            )}
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-[#e54d4d] font-medium">
            {errors.root.message}
          </p>
        )}

        <div className="flex items-center flex-wrap gap-3 pt-1">
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
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
                feedback.type === "success"
                  ? "text-[var(--color-wants)]"
                  : "text-[#e54d4d]"
              )}
              role="status"
            >
              {feedback.text}
            </span>
          )}
        </div>
      </form>

      {/* Preview */}
      <div className="pt-5 border-t border-[#e8e8e8] dark:border-[#2a2a2e] space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
          Vista previa
        </p>
        <div className="h-8 w-full rounded-full overflow-hidden flex bg-[#f5f5f5] dark:bg-[#1a1a1e]">
          {categoryMeta.map((meta) => {
            const value = values[meta.key] ?? 0;
            return (
              <div
                key={meta.key}
                className={cn(
                  "h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300",
                  meta.color
                )}
                style={{ width: `${value}%` }}
              >
                {value > 8 ? `${value}%` : ""}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
          {categoryMeta.map((meta) => (
            <div key={meta.key} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", meta.color)} />
              <span>{meta.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
