"use client";

import { useState } from "react";
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
  const [displayIncome, setDisplayIncome] = useState(
    income > 0 ? income.toString() : ""
  );

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    const num = raw ? parseInt(raw, 10) : 0;
    setDisplayIncome(raw);
    onIncomeChange(num);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configura tu presupuesto</h2>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="income">Ingreso mensual total</Label>
          <Input
            id="income"
            type="text"
            inputMode="numeric"
            value={displayIncome}
            onChange={handleIncomeChange}
            placeholder="3000000"
          />
          {income > 0 && (
            <p className="text-sm text-muted-foreground">
              {formatCOP(income)}
            </p>
          )}
        </div>

        {income > 0 && (
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium mb-1">Resumen:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>Necesidades (50%): {formatCOP(income * 0.5)}</li>
              <li>Deseos (30%): {formatCOP(income * 0.3)}</li>
              <li>Ahorros (20%): {formatCOP(income * 0.2)}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
