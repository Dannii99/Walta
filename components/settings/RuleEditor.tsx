"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateBudget } from "@/server/actions/budget-actions";
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
  income: string;
}

const categoryMeta = [
  { key: "needs" as const, label: "Necesidades", color: "bg-emerald-500", textColor: "text-emerald-600" },
  { key: "wants" as const, label: "Deseos", color: "bg-amber-500", textColor: "text-amber-600" },
  { key: "savings" as const, label: "Ahorros", color: "bg-blue-500", textColor: "text-blue-600" },
];

export function RuleEditor({ budgetId, currentRule, income }: RuleEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RuleForm>({
    resolver: zodResolver(ruleSchema),
    defaultValues: currentRule,
  });

  const values = watch();
  const total = (values.needs || 0) + (values.wants || 0) + (values.savings || 0);
  const isValid = total === 100;

  const incomeNum = parseFloat(income);

  const onSubmit = async (data: RuleForm) => {
    setIsSubmitting(true);
    setSavedMessage("");
    try {
      await updateBudget(budgetId, { rule: data });
      setSavedMessage("Regla actualizada correctamente.");
    } catch {
      setSavedMessage("Error al actualizar la regla.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regla de Presupuesto</CardTitle>
        <CardDescription>
          Ajusta los porcentajes de distribucin de tu ingreso. La suma debe ser exactamente 100%.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {categoryMeta.map((meta) => {
              const value = values[meta.key] ?? 0;
              const amount = incomeNum * (value / 100);
              return (
                <div key={meta.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={meta.key} className={meta.textColor}>
                      {meta.label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={meta.key}
                        type="number"
                        min={0}
                        max={100}
                        className="w-20 text-right"
                        {...register(meta.key, { valueAsNumber: true })}
                      />
                      <span className="text-sm text-muted-foreground w-8">%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${meta.color} transition-all duration-300`}
                      style={{ width: `${Math.min(value, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    Aproximadamente: ${amount.toLocaleString("es-CO")} COP
                  </p>
                </div>
              );
            })}
          </div>

          {/* Total indicator */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <span className="text-sm font-medium">Total</span>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-bold ${isValid ? "text-emerald-600" : "text-destructive"}`}
              >
                {total}%
              </span>
              {!isValid && (
                <span className="text-xs text-destructive">
                  {total > 100 ? `Excede en ${total - 100}%` : `Faltan ${100 - total}%`}
                </span>
              )}
            </div>
          </div>

          {errors.root && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Regla"}
            </Button>
            {savedMessage && (
              <span
                className={`text-sm ${savedMessage.includes("Error") ? "text-destructive" : "text-emerald-600"}`}
              >
                {savedMessage}
              </span>
            )}
          </div>
        </form>

        {/* Visual preview */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Vista previa</h4>
          <div className="h-8 w-full rounded-full overflow-hidden flex">
            {categoryMeta.map((meta) => {
              const value = values[meta.key] ?? 0;
              return (
                <div
                  key={meta.key}
                  className={`h-full ${meta.color} flex items-center justify-center text-xs text-white font-medium transition-all duration-300`}
                  style={{ width: `${value}%` }}
                >
                  {value > 8 ? `${value}%` : ""}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {categoryMeta.map((meta) => (
              <div key={meta.key} className="flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${meta.color}`} />
                <span>{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
