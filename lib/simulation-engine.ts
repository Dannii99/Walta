/**
 * Calcula el pago mensual de un préstamo usando la fórmula de amortización francesa (EA).
 * @param principal - Monto del préstamo (después de cuota inicial)
 * @param annualRate - Tasa de interés efectivo anual (EA)
 * @param termMonths - Plazo en meses
 * @returns Pago mensual redondeado a 2 decimales
 */
export function calculateFrenchEA(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) {
    return 0;
  }

  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

  if (monthlyRate === 0) {
    return Number((principal / termMonths).toFixed(2));
  }

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return Number(payment.toFixed(2));
}

/**
 * Alias backwards-compatible de calculateFrenchEA.
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  return calculateFrenchEA(principal, annualRate, termMonths);
}

/**
 * Calcula el pago mensual usando tasa nominal mensual (NAMV / 12).
 * @param principal - Monto del préstamo
 * @param annualNAMV - Tasa nominal anual mes vencido
 * @param termMonths - Plazo en meses
 * @returns Pago mensual redondeado a 2 decimales
 */
export function calculateNominalMonthly(
  principal: number,
  annualNAMV: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const monthlyRate = annualNAMV / 12;
  if (monthlyRate === 0) return Number((principal / termMonths).toFixed(2));
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Number(payment.toFixed(2));
}

// getLoanSummary ahora vive en lib/credit-engine.ts.
// Re-exportado aquí para mantener compatibilidad con imports existentes.
export { getLoanSummary } from "@/lib/credit-engine";

export type Verdict = "SAFE" | "TIGHT" | "RISKY" | "NOT_RECOMMENDED";

/**
 * Determina el veredicto de una simulación basado en el porcentaje del pago mensual
 * respecto al dinero disponible.
 *
 * - SAFE: ≤30% del disponible
 * - TIGHT: 31-50% del disponible
 * - RISKY: 51-70% del disponible
 * - NOT_RECOMMENDED: >70% o fondos insuficientes
 */
export function getVerdict(
  monthlyPayment: number,
  availableMoney: number
): { verdict: Verdict; percentage: number } {
  if (availableMoney <= 0 || monthlyPayment > availableMoney) {
    return { verdict: "NOT_RECOMMENDED", percentage: 100 };
  }

  const percentage = (monthlyPayment / availableMoney) * 100;

  if (percentage <= 30) {
    return { verdict: "SAFE", percentage };
  }
  if (percentage <= 50) {
    return { verdict: "TIGHT", percentage };
  }
  if (percentage <= 70) {
    return { verdict: "RISKY", percentage };
  }

  return { verdict: "NOT_RECOMMENDED", percentage };
}

export const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; badge: string; description: string }
> = {
  SAFE: {
    label: "Seguro",
    color: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    description: "El pago mensual representa menos del 30% de tus fondos disponibles.",
  },
  TIGHT: {
    label: "Ajustado",
    color: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    description: "El pago mensual representa entre 30% y 50% de tus fondos. Ten cuidado.",
  },
  RISKY: {
    label: "Riesgoso",
    color: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-900",
    description: "El pago mensual supera el 50% de tus fondos. No recomendado.",
  },
  NOT_RECOMMENDED: {
    label: "No Recomendado",
    color: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
    description: "El pago mensual supera tus fondos disponibles o es mayor al 70%.",
  },
};

// Re-export DB-level helpers for backward compatibility
export { ENGINE_TO_DB as verdictToDb, DB_TO_ENGINE } from "@/lib/simulation-types";
export type { DbVerdict } from "@/lib/simulation-types";
