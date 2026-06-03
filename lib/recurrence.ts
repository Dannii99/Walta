import type { Recurrence } from "@/types";

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  MONTHLY: "Mensual",
  BIWEEKLY: "Quincenal",
  ONE_TIME: "Única",
};

export const RECURRENCE_DESCRIPTIONS: Record<Recurrence, string> = {
  MONTHLY: "Cada mes",
  BIWEEKLY: "Cada 15 días",
  ONE_TIME: "Una vez",
};

export const RECURRENCE_MULTIPLIER: Record<Recurrence, number> = {
  MONTHLY: 1,
  BIWEEKLY: 2,
  ONE_TIME: 1,
};

export function getMonthlyEquivalent(
  amount: number,
  recurrence: string | null | undefined
): number {
  const multiplier = RECURRENCE_MULTIPLIER[recurrence as Recurrence] ?? 1;
  if (!Number.isFinite(amount) || !Number.isFinite(multiplier)) return 0;
  return amount * multiplier;
}

export function getNextOccurrence(
  date: Date,
  recurrence: string | null | undefined
): Date | null {
  if (!date || isNaN(date.getTime())) return null;
  if (recurrence === "ONE_TIME") return null;
  const next = new Date(date);
  if (recurrence === "MONTHLY") {
    next.setMonth(next.getMonth() + 1);
  } else if (recurrence === "BIWEEKLY") {
    next.setDate(next.getDate() + 15);
  } else {
    return null;
  }
  return next;
}

export function formatDateForInput(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatNextOccurrenceLabel(
  date: Date | string | null | undefined,
  recurrence: string | null | undefined
): string {
  const next = getNextOccurrence(
    typeof date === "string" ? new Date(date) : date ?? new Date(),
    recurrence
  );
  if (!next) return "—";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(next);
}
