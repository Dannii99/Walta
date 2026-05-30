/**
 * Calcula el pago mensual de un préstamo usando la fórmula de amortización estándar.
 * @param principal - Monto del préstamo (después de cuota inicial)
 * @param annualRate - Tasa de interés efectivo anual (EA)
 * @param termMonths - Plazo en meses
 * @returns Pago mensual redondeado a 2 decimales
 */
export function calculateLoanPayment(
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
