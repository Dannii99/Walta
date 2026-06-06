import {
  Shield,
  ShieldCheck,
  Heart,
  FileCheck,
  Search,
  BadgePercent,
  FileText,
  Landmark,
  Truck,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import type { FeeItem } from "@/types";

export const ANNUAL_TO_MONTHLY = 12;

export function getFeeIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower.includes("seguro") || lower.includes("insurance") || lower.includes("riesgo") || lower.includes("vida")) {
    if (lower.includes("check") || lower.includes("aprobado")) return ShieldCheck;
    if (lower.includes("vida") || lower.includes("life")) return Heart;
    return Shield;
  }
  if (lower.includes("aval") || lower.includes("garantía") || lower.includes("fiador")) {
    return FileCheck;
  }
  if (lower.includes("estudio") || lower.includes("análisis") || lower.includes("investigación")) {
    return Search;
  }
  if (lower.includes("comisión") || lower.includes("cargo") || lower.includes("fee") || lower.includes("intereses")) {
    return BadgePercent;
  }
  if (lower.includes("matrícula") || lower.includes("registro") || lower.includes("documento")) {
    return FileText;
  }
  if (lower.includes("banco") || lower.includes("entidad") || lower.includes("administración")) {
    return Landmark;
  }
  if (lower.includes("mensajería") || lower.includes("transporte") || lower.includes("envío")) {
    return Truck;
  }
  return Receipt;
}

/**
 * Returns the **monthly equivalent** of all fees with type "monthly".
 *
 * IMPORTANT model: for `type === "monthly"`, the `amount` field stores the
 * ANNUAL cost (e.g. an annual insurance of $1,200,000). This function divides
 * by 12 to obtain the per-month contribution to the loan's installment.
 *
 * For `type === "upfront"`, the amount is a one-time charge and is excluded
 * from the monthly total.
 */
export function calculateTotalMonthlyFees(fees: FeeItem[]): number {
  return fees
    .filter((f) => f.type === "monthly")
    .reduce((sum, f) => sum + f.amount / ANNUAL_TO_MONTHLY, 0);
}

/** Returns the sum of all one-time (upfront) fees. */
export function calculateTotalUpfrontFees(fees: FeeItem[]): number {
  return fees
    .filter((f) => f.type === "upfront")
    .reduce((sum, f) => sum + f.amount, 0);
}

/**
 * Lightweight structural type for anything that carries a monthlyPayment + an
 * array of fees. Matches the shape of:
 *   - Loan (with `fees: LoanFee[]`)
 *   - Partial<Loan> (in tests, queries, etc.)
 *   - Theorethical cases where `fees` is a Json object.
 *
 * Each fee only needs `amount` (Decimal-like) and `type` to be computed.
 */
export interface MonthlyPaymentCarrier {
  monthlyPayment: { toString(): string } | number | string;
  fees?: ReadonlyArray<{
    amount: { toString(): string } | number | string;
    type: string;
  }> | null;
}

/**
 * Returns the **effective monthly payment** the user actually pays each month:
 *   parseFloat(loan.monthlyPayment) + sum(monthly fees) / 12
 *
 * This is the source of truth for "cuota real" everywhere the UI displays a
 * monthly quota that should include deferred monthly fees (e.g. insurance,
 * administration). It does NOT mutate anything; pure function.
 *
 * Edge cases:
 *   - No `fees` array (or empty) → returns the bank cuota unchanged.
 *   - `type` !== "monthly" → ignored (only "monthly" fees contribute).
 *   - Decimal/number/string `amount` accepted; coerced via Number() and divided
 *     by ANNUAL_TO_MONTHLY (12) so a stored annual value of $3,600,000 →
 *     $300,000/mes.
 */
export function getEffectiveMonthlyPayment(
  carrier: MonthlyPaymentCarrier
): number {
  const base = Number(carrier.monthlyPayment);
  const fees = carrier.fees ?? [];
  const monthlyFeesContribution = fees.reduce((sum, f) => {
    if (f.type !== "monthly") return sum;
    return sum + Number(f.amount) / ANNUAL_TO_MONTHLY;
  }, 0);
  return base + monthlyFeesContribution;
}
