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
      className="space-y-4"
    >
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Configura tu presupuesto
        </h2>
        <p className="text-[11px] sm:text-sm text-white/60 max-w-xs mx-auto leading-relaxed">
          ¿Cuánto dinero recibes al mes?
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="budgetName" className="text-[11px] sm:text-sm text-white/70">Nombre del presupuesto</Label>
          <Input
            id="budgetName"
            value={budgetName}
            onChange={(e) => onBudgetNameChange(e.target.value)}
            placeholder="Ej. Mi Presupuesto Mensual"
            className="h-10 text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="income" className="text-[11px] sm:text-sm text-white/70">Ingreso mensual total</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-white/50 pointer-events-none">
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
              className="pl-7 h-10 text-base font-semibold bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          {income > 0 && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium mt-2 text-[#26be15]"
            >
              {formatCOP(income)} COP
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
