"use client";

import { useEffect, useRef } from "react";
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

export function IncomeStep({
  budgetName,
  income,
  onBudgetNameChange,
  onIncomeChange,
}: IncomeStepProps) {
  const incomeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    incomeRef.current?.focus();
  }, []);

  const displayIncome = income > 0
    ? income.toLocaleString("es-CO")
    : "";

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    onIncomeChange(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Configura tu presupuesto
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          ¿Cuánto dinero recibes al mes? Usaremos esto para tus cálculos.
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
              ref={incomeRef}
              type="text"
              inputMode="numeric"
              value={displayIncome}
              onChange={handleIncomeChange}
              placeholder="3.000.000"
              className="pl-7 h-11 text-base font-semibold"
            />
          </div>
          {income > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {formatCOP(income)} COP
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
