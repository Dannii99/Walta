/**
 * Pure financial formulas for loan amortization.
 *
 * Kept separate from `loan-engine.ts` to remain importable from both server
 * (recalc engine) and client (simulator) without dragging in the Prisma
 * model types.
 *
 * All inputs are plain `number`s; the callers are responsible for coercing
 * `Decimal`/string fields via `Number(...)` or `parseFloat(...)` before
 * passing them in.
 */

/**
 * French amortization formula: returns the periodic (monthly) payment `C`
 * for a loan of `principal` `P` over `n` periods at periodic rate `i`:
 *
 *   C = P * [ i * (1 + i)^n ] / [ (1 + i)^n - 1 ]
 *
 * Edge cases:
 *   - `monthlyRate === 0` → simple division: `P / n` (no interest).
 *   - `n <= 0`            → returns 0 (defensive; caller should validate).
 *   - Tiny rates          → uses double-precision math, accurate to ~6 decimals.
 *
 * @param principal    Outstanding balance at the start of the new phase.
 * @param monthlyRate  Periodic (monthly) rate, decimal (e.g. 0.015 = 1.5%).
 * @param termMonths   Number of monthly installments in the new phase.
 */
export function calculateFrenchPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): number {
  if (termMonths <= 0) return 0;
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / termMonths;

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Resolves the periodic (monthly) rate from an annual rate and a formula
 * selector. Mirrors the rate computation in `generateAmortizationSchedule` so
 * the simulator and the engine agree on the same number.
 *
 *   - `french_ea`         → `monthly = (1 + annual)^(1/12) - 1`
 *   - `nominal_monthly`   → `monthly = annual / 12`
 */
export function resolveMonthlyRate(
  annualRate: number,
  formula: "french_ea" | "nominal_monthly"
): number {
  if (formula === "french_ea") {
    return Math.pow(1 + annualRate, 1 / 12) - 1;
  }
  return annualRate / 12;
}
