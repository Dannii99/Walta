import type { Verdict } from "@/lib/simulation-engine";

export interface SimulationInputRow {
  price: number;
  downPayment: number;
  term: number;
  rate: number;
  formula?: string;
}

export interface SimulationResultRow {
  monthlyPayment: number;
  verdict: string;
  availableAfter: number;
  totalInterest: number;
  totalCost: number;
}

export type DbVerdict = "APPROVED" | "WARNING" | "REJECTED";

export const VERDICT_LABELS: Record<DbVerdict, string> = {
  APPROVED: "Aprobado",
  WARNING: "Advertencia",
  REJECTED: "Rechazado",
};

export const VERDICT_PILL: Record<DbVerdict, string> = {
  APPROVED: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WARNING: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  REJECTED: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
};

export const ENGINE_TO_DB: Record<Verdict, DbVerdict> = {
  SAFE: "APPROVED",
  TIGHT: "WARNING",
  RISKY: "REJECTED",
  NOT_RECOMMENDED: "REJECTED",
};

export const DB_TO_ENGINE: Record<DbVerdict, Verdict> = {
  APPROVED: "SAFE",
  WARNING: "TIGHT",
  REJECTED: "RISKY",
};

export const TYPE_LABELS: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

export const TYPE_ICON_BG: Record<string, string> = {
  VEHICLE: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  PERSONAL: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  HOUSING: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  OTHER: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export const FORMULA_LABELS: Record<string, string> = {
  french_ea: "Francesa (EA)",
  nominal_monthly: "NAMV mensual",
};

export function labelOr(value: string, map: Record<string, string>): string {
  return map[value] ?? value;
}

export function parseSimulationInputs(raw: unknown): SimulationInputRow {
  if (!raw || typeof raw !== "object") {
    return { price: 0, downPayment: 0, term: 0, rate: 0, formula: "french_ea" };
  }
  const r = raw as Record<string, unknown>;
  return {
    price: Number(r.price ?? 0),
    downPayment: Number(r.downPayment ?? 0),
    term: Number(r.term ?? 0),
    rate: Number(r.rate ?? 0),
    formula: typeof r.formula === "string" ? r.formula : "french_ea",
  };
}

export function parseSimulationResult(raw: unknown): SimulationResultRow {
  if (!raw || typeof raw !== "object") {
    return {
      monthlyPayment: 0,
      verdict: "WARNING",
      availableAfter: 0,
      totalInterest: 0,
      totalCost: 0,
    };
  }
  const r = raw as Record<string, unknown>;
  return {
    monthlyPayment: Number(r.monthlyPayment ?? 0),
    verdict: String(r.verdict ?? "WARNING"),
    availableAfter: Number(r.availableAfter ?? 0),
    totalInterest: Number(r.totalInterest ?? 0),
    totalCost: Number(r.totalCost ?? 0),
  };
}
