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

/**
 * Calibration status comparing the loan's calculated monthly payment
 * (capital+interest only) plus its monthly fees against the actual monthly
 * payment observed on the bank statement.
 */
export type CalibrationStatus = "MATCH" | "MINOR" | "MAJOR" | "UNKNOWN";

export interface LoanCalibration {
  calculatedMonthly: number;
  feesMonthly: number;
  expectedMonthly: number;
  actualMonthlyPayment: number | null;
  diff: number | null;
  diffPct: number | null;
  status: CalibrationStatus;
  reason: string | null;
}

const MINOR_DIFF_THRESHOLD = 1000;
const MAJOR_DIFF_THRESHOLD = 5000;

export function getLoanCalibration(
  calculatedMonthly: number,
  feesMonthly: number,
  actualMonthlyPayment: number | null
): LoanCalibration {
  const expectedMonthly = calculatedMonthly + feesMonthly;

  if (actualMonthlyPayment === null || actualMonthlyPayment <= 0) {
    return {
      calculatedMonthly,
      feesMonthly,
      expectedMonthly,
      actualMonthlyPayment: null,
      diff: null,
      diffPct: null,
      status: "UNKNOWN",
      reason: null,
    };
  }

  const diff = actualMonthlyPayment - expectedMonthly;
  const diffPct = expectedMonthly > 0 ? (diff / expectedMonthly) * 100 : 0;
  const absDiff = Math.abs(diff);

  let status: CalibrationStatus;
  let reason: string | null = null;

  if (absDiff <= MINOR_DIFF_THRESHOLD) {
    status = "MATCH";
    reason = null;
  } else if (absDiff <= MAJOR_DIFF_THRESHOLD) {
    status = "MINOR";
    reason =
      "La diferencia puede deberse a redondeos del banco, seguros incluidos en la cuota fija, o ajustes menores del extracto.";
  } else {
    status = "MAJOR";
    reason =
      "La diferencia es significativa. Verifica la tasa de interés, los cargos fijos o si el banco incluye conceptos adicionales no contemplados.";
  }

  return {
    calculatedMonthly,
    feesMonthly,
    expectedMonthly,
    actualMonthlyPayment,
    diff,
    diffPct,
    status,
    reason,
  };
}

export const CALIBRATION_CONFIG: Record<
  CalibrationStatus,
  { label: string; badge: string; description: string; icon: "check" | "warn" | "alert" | "info" }
> = {
  MATCH: {
    label: "Coincide",
    badge:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    description: "Tu cuota calculada coincide con la del extracto.",
    icon: "check",
  },
  MINOR: {
    label: "Diferencia menor",
    badge:
      "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    description: "Hay una pequeña diferencia. Probablemente seguros o redondeos.",
    icon: "warn",
  },
  MAJOR: {
    label: "Diferencia significativa",
    badge:
      "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    description: "Revisa la tasa, los cargos o conceptos extra del banco.",
    icon: "alert",
  },
  UNKNOWN: {
    label: "Sin datos del extracto",
    badge:
      "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700",
    description: "Ingresa la cuota que ves en tu extracto para verificar.",
    icon: "info",
  },
};
