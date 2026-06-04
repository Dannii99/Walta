import type { Loan, LoanStatus, LoanType, LoanFormula } from "@/types";

export type { LoanType, LoanStatus, LoanFormula };

export type LoanHealth = "HEALTHY" | "WARN" | "DEFAULTED";

export interface LoanInputRow {
  price: number;
  downPayment: number;
  term: number;
  rate: number;
  formula: LoanFormula;
}

export interface LoanResultRow {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  health: LoanHealth;
  percentageOfBudget: number;
}

export const LOAN_TYPES: readonly LoanType[] = [
  "VEHICLE",
  "PERSONAL",
  "HOUSING",
  "OTHER",
] as const;

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

export const LOAN_TYPE_ICON_BG: Record<LoanType, string> = {
  VEHICLE: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  PERSONAL: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  HOUSING: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  OTHER: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export const LOAN_STATUSES: readonly LoanStatus[] = [
  "ACTIVE",
  "PAID_OFF",
  "DEFAULTED",
] as const;

export const LOAN_STATUS_LABELS: Record<LoanStatus, string> = {
  ACTIVE: "Activo",
  PAID_OFF: "Pagado",
  DEFAULTED: "En mora",
};

export const LOAN_STATUS_CONFIG: Record<
  LoanStatus,
  { label: string; badge: string; description: string; ringClass: string }
> = {
  ACTIVE: {
    label: "Activo",
    badge:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    description: "El crédito se está pagando según lo acordado.",
    ringClass: "ring-emerald-500/30",
  },
  PAID_OFF: {
    label: "Pagado",
    badge:
      "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    description: "El crédito fue cancelado en su totalidad.",
    ringClass: "ring-blue-500/30",
  },
  DEFAULTED: {
    label: "En mora",
    badge:
      "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900",
    description: "Hay cuotas vencidas sin pago registradas.",
    ringClass: "ring-red-500/30",
  },
};

export const LOAN_FORMULA_LABELS: Record<LoanFormula, string> = {
  french_ea: "Francesa (EA)",
  nominal_monthly: "NAMV mensual",
};

export function labelOr(value: string, map: Record<string, string>): string {
  return map[value] ?? value;
}

export function loanTypeLabel(type: string): string {
  return labelOr(type, LOAN_TYPE_LABELS);
}

export function loanStatusLabel(status: string): string {
  return labelOr(status, LOAN_STATUS_LABELS);
}

export function loanFormulaLabel(formula: string): string {
  return labelOr(formula, LOAN_FORMULA_LABELS);
}

export function loanStatusConfig(status: string) {
  return (
    LOAN_STATUS_CONFIG[status as LoanStatus] ?? {
      label: status,
      badge: "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700",
      description: "Estado desconocido.",
      ringClass: "ring-stone-500/30",
    }
  );
}

export function loanTypeIconBg(type: string): string {
  return (
    LOAN_TYPE_ICON_BG[type as LoanType] ??
    "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
  );
}

export function parseLoanInputs(raw: unknown): LoanInputRow {
  if (!raw || typeof raw !== "object") {
    return { price: 0, downPayment: 0, term: 0, rate: 0, formula: "french_ea" };
  }
  const r = raw as Record<string, unknown>;
  const formula =
    typeof r.formula === "string" && (r.formula === "french_ea" || r.formula === "nominal_monthly")
      ? (r.formula as LoanFormula)
      : "french_ea";
  return {
    price: Number(r.price ?? 0),
    downPayment: Number(r.downPayment ?? 0),
    term: Number(r.term ?? 0),
    rate: Number(r.rate ?? 0),
    formula,
  };
}

export function parseLoanResult(raw: unknown): LoanResultRow {
  if (!raw || typeof raw !== "object") {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: 0,
      health: "HEALTHY",
      percentageOfBudget: 0,
    };
  }
  const r = raw as Record<string, unknown>;
  return {
    monthlyPayment: Number(r.monthlyPayment ?? 0),
    totalInterest: Number(r.totalInterest ?? 0),
    totalCost: Number(r.totalCost ?? 0),
    health: (r.health as LoanHealth) ?? "HEALTHY",
    percentageOfBudget: Number(r.percentageOfBudget ?? 0),
  };
}

export function parseLoan<T = Loan>(raw: T): T & { fees: import("@/types").FeeItem[] } {
  const r = raw as T & { fees?: unknown };
  return {
    ...r,
    fees: Array.isArray(r.fees) ? (r.fees as import("@/types").FeeItem[]) : [],
  };
}
