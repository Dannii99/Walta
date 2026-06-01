import type { Recurrence } from "@/types";

export const RECURRENCE_LABELS: Record<Recurrence, string> = {
  MONTHLY: "Mensual",
  BIWEEKLY: "Quincenal",
  ONE_TIME: "Única",
};

export const RECURRENCE_MULTIPLIER: Record<Recurrence, number> = {
  MONTHLY: 1,
  BIWEEKLY: 2,
  ONE_TIME: 1,
};

export function getMonthlyEquivalent(amount: number, recurrence: Recurrence): number {
  return amount * RECURRENCE_MULTIPLIER[recurrence];
}
