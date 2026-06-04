import {
  calculateFrenchEA,
  calculateNominalMonthly,
} from "@/lib/simulation-engine";
import type { LoanFormula } from "@/types";
import type { LoanHealth } from "@/lib/credit-types";

export type { LoanHealth } from "@/lib/credit-types";

export interface LoanSummary {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
}

export function getLoanSummary(
  principal: number,
  rate: number,
  termMonths: number,
  formula: LoanFormula
): LoanSummary {
  const monthlyPayment =
    formula === "nominal_monthly"
      ? calculateNominalMonthly(principal, rate, termMonths)
      : calculateFrenchEA(principal, rate, termMonths);

  const totalCost = monthlyPayment * termMonths;
  const totalInterest = totalCost - principal;

  return { monthlyPayment, totalCost, totalInterest };
}

export const HEALTH_THRESHOLDS = {
  comfortable: 0.3,
  tight: 0.5,
  risky: 0.7,
} as const;

export const LOAN_HEALTH_CONFIG: Record<
  LoanHealth,
  { label: string; color: string; badge: string; description: string }
> = {
  HEALTHY: {
    label: "Saludable",
    color: "text-emerald-600 dark:text-emerald-400",
    badge:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    description: "La cuota representa menos del 30% de tu dinero disponible.",
  },
  WARN: {
    label: "Ajustado",
    color: "text-amber-600 dark:text-amber-400",
    badge:
      "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    description: "La cuota está entre el 30% y 50% de tu dinero disponible.",
  },
  DEFAULTED: {
    label: "Riesgoso",
    color: "text-rose-600 dark:text-rose-400",
    badge:
      "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    description: "La cuota supera el 50% de tu dinero disponible.",
  },
};

export function getLoanHealthFromCapacity(
  monthlyPayment: number,
  availableMoney: number
): { health: LoanHealth; percentage: number } {
  if (availableMoney <= 0 || monthlyPayment > availableMoney) {
    return { health: "DEFAULTED", percentage: 100 };
  }

  const percentage = (monthlyPayment / availableMoney) * 100;

  if (percentage <= HEALTH_THRESHOLDS.comfortable * 100) {
    return { health: "HEALTHY", percentage };
  }
  if (percentage <= HEALTH_THRESHOLDS.tight * 100) {
    return { health: "WARN", percentage };
  }
  return { health: "DEFAULTED", percentage };
}
