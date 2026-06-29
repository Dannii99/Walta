"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCOP } from "@/lib/currency";

interface IncomeStepProps {
  budgetName: string;
  income: number;
  onBudgetNameChange: (name: string) => void;
  onIncomeChange: (income: number) => void;
}

const RULE = { needs: 50, wants: 30, savings: 20 };
const COLORS = {
  needs: { bar: "#26be15", tint: "bg-emerald-50 dark:bg-emerald-950/20" },
  wants: { bar: "#e7964d", tint: "bg-amber-50 dark:bg-amber-950/20" },
  savings: { bar: "#617dd5", tint: "bg-blue-50 dark:bg-blue-950/20" },
};

export function IncomeStep({
  budgetName,
  income,
  onBudgetNameChange,
  onIncomeChange,
}: IncomeStepProps) {
  const displayIncome = income > 0
    ? income.toLocaleString("es-CO")
    : "";

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    onIncomeChange(num);
  };

  const breakdown = useMemo(
    () => [
      {
        label: "Necesidades",
        pct: RULE.needs,
        amount: income * (RULE.needs / 100),
        color: COLORS.needs.bar,
      },
      {
        label: "Deseos",
        pct: RULE.wants,
        amount: income * (RULE.wants / 100),
        color: COLORS.wants.bar,
      },
      {
        label: "Ahorros",
        pct: RULE.savings,
        amount: income * (RULE.savings / 100),
        color: COLORS.savings.bar,
      },
    ],
    [income]
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Configura tu presupuesto</h2>
        <p className="text-muted-foreground text-sm">
          Usaremos este ingreso para calcular tus categorías sugeridas
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budgetName">Nombre del presupuesto</Label>
          <Input
            id="budgetName"
            value={budgetName}
            onChange={(e) => onBudgetNameChange(e.target.value)}
            placeholder="Ej. Mi Presupuesto Mensual"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="income">Ingreso mensual total</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none">
              $
            </span>
            <Input
              id="income"
              type="text"
              inputMode="numeric"
              value={displayIncome}
              onChange={handleIncomeChange}
              placeholder="3.000.000"
              className="pl-7 h-11 text-base font-semibold"
            />
          </div>
          {income > 0 && (
            <p className="text-sm text-muted-foreground font-medium">
              {formatCOP(income)} COP
            </p>
          )}
        </div>

        {/* Preview visual de la regla 50/30/20 */}
        {income > 0 && (
          <motion.div
            className="rounded-xl border border-border p-4 space-y-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Distribución 50/30/20
            </p>

            {/* Barra combinada */}
            <div className="flex h-3 rounded-full overflow-hidden">
              {breakdown.map((item) => (
                <motion.div
                  key={item.label}
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </div>

            {/* Detalle por categoría */}
            <div className="space-y-2">
              {breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {item.pct}%
                    </span>
                  </div>
                  <span className="text-xs font-bold tabular-nums">
                    {formatCOP(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}