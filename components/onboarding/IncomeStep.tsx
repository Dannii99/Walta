"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    const num = raw ? parseInt(raw, 10) : 0;
    onIncomeChange(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Configura tu presupuesto
        </h2>
        <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          ¿Cuánto dinero recibes al mes?
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="budgetName" className="text-[11px] sm:text-sm text-muted-foreground dark:text-white/70">Nombre del presupuesto</Label>
          <Input
            id="budgetName"
            value={budgetName}
            onChange={(e) => onBudgetNameChange(e.target.value)}
            placeholder="Ej. Mi Presupuesto Mensual"
            maxLength={50}
            className="h-10 text-sm bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground/50 dark:placeholder:text-white/30"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="income" className="text-[11px] sm:text-sm text-muted-foreground dark:text-white/70">
            Ingreso mensual total
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/60 dark:text-white/40 pointer-events-none">
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
                maxLength={13}
                className="pl-7 pr-12 h-10 text-base font-semibold bg-muted/50 dark:bg-white/5 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground/50 dark:placeholder:text-white/30 tabular-nums focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all duration-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50 dark:text-white/30 pointer-events-none select-none">
                COP
              </span>
            </div>
          </div>
        </div>
      </motion.div>
  );
}
