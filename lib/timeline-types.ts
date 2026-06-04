import { z } from "zod";
import type { SimulationInputs, SimulationResult } from "@/types";

export const TIMELINE_EVENT_TYPES = [
  "SIMULATION_CREATED",
  "LOAN_CREATED",
  "LOAN_PAYMENT",
  "LOAN_EXTRA_PAYMENT",
  "LOAN_PAID_OFF",
] as const;

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number];

export const TIMELINE_EVENT_LABELS: Record<TimelineEventType, string> = {
  SIMULATION_CREATED: "Simulación creada",
  LOAN_CREATED: "Crédito creado",
  LOAN_PAYMENT: "Cuota pagada",
  LOAN_EXTRA_PAYMENT: "Abono a capital",
  LOAN_PAID_OFF: "Crédito pagado",
};

export const TIMELINE_EVENT_LABELS_PLURAL: Record<TimelineEventType, string> = {
  SIMULATION_CREATED: "Simulaciones",
  LOAN_CREATED: "Créditos",
  LOAN_PAYMENT: "Cuotas",
  LOAN_EXTRA_PAYMENT: "Abonos",
  LOAN_PAID_OFF: "Pagos finalizados",
};

const simulationResultSchema = z.object({
  monthlyPayment: z.number().nonnegative(),
  verdict: z.enum(["APPROVED", "WARNING", "REJECTED"] as const),
  availableAfter: z.number(),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().nonnegative(),
});

const simulationInputsSchema = z.object({
  price: z.number().nonnegative(),
  downPayment: z.number().nonnegative(),
  term: z.number().int().nonnegative(),
  rate: z.number().nonnegative(),
  formula: z.string().optional(),
});

const simulationTypeSchema = z.enum([
  "VEHICLE",
  "PERSONAL",
  "HOUSING",
  "OTHER",
] as const);

export interface BaseTimelineEvent {
  id: string;
  type: TimelineEventType;
  occurredAt: Date;
}

export interface SimulationCreatedEvent extends BaseTimelineEvent {
  type: "SIMULATION_CREATED";
  simulationId: string;
  simulationType: z.infer<typeof simulationTypeSchema>;
  title: string;
  monthlyPayment: number;
  verdict: "APPROVED" | "WARNING" | "REJECTED";
  totalCost: number;
  price: number;
  term: number;
}

export interface LoanCreatedEvent extends BaseTimelineEvent {
  type: "LOAN_CREATED";
  loanId: string;
  title: string;
  loanType: z.infer<typeof simulationTypeSchema>;
  principal: number;
  termMonths: number;
  monthlyPayment: number;
  simulationId: string | null;
}

export interface LoanPaymentEvent extends BaseTimelineEvent {
  type: "LOAN_PAYMENT";
  loanId: string;
  loanTitle: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  principalPaid: number;
  interestPaid: number;
}

export interface LoanExtraPaymentEvent extends BaseTimelineEvent {
  type: "LOAN_EXTRA_PAYMENT";
  loanId: string;
  loanTitle: string;
  amount: number;
  note: string | null;
}

export interface LoanPaidOffEvent extends BaseTimelineEvent {
  type: "LOAN_PAID_OFF";
  loanId: string;
  loanTitle: string;
  totalInterest: number;
  termMonths: number;
}

export type TimelineEvent =
  | SimulationCreatedEvent
  | LoanCreatedEvent
  | LoanPaymentEvent
  | LoanExtraPaymentEvent
  | LoanPaidOffEvent;

export const timelineEventTypesSchema = z.array(
  z.enum(TIMELINE_EVENT_TYPES as unknown as [TimelineEventType, ...TimelineEventType[]])
);

export const cursorSchema = z.object({
  occurredAt: z.string().datetime(),
  id: z.string().min(1),
});

export type TimelineCursor = z.infer<typeof cursorSchema>;

export interface TimelinePage {
  events: TimelineEvent[];
  nextCursor: TimelineCursor | null;
  hasMore: boolean;
  total: number;
}

export const DEFAULT_PAGE_SIZE = 30;

export function parseSimulationResult(raw: unknown): SimulationResult {
  const parsed = simulationResultSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }
  return {
    monthlyPayment: 0,
    verdict: "WARNING",
    availableAfter: 0,
    totalInterest: 0,
    totalCost: 0,
  };
}

export function parseSimulationInputs(raw: unknown): SimulationInputs {
  const parsed = simulationInputsSchema.safeParse(raw);
  if (parsed.success) {
    return parsed.data;
  }
  return { price: 0, downPayment: 0, term: 0, rate: 0, formula: "french_ea" };
}

export function parseSimulationType(
  raw: unknown
): z.infer<typeof simulationTypeSchema> {
  const parsed = simulationTypeSchema.safeParse(raw);
  return parsed.success ? parsed.data : "OTHER";
}

export function parseLoanType(
  raw: unknown
): z.infer<typeof simulationTypeSchema> {
  return parseSimulationType(raw);
}

export function buildEventId(
  type: TimelineEventType,
  entityId: string,
  suffix?: string
): string {
  return suffix ? `${type}:${entityId}:${suffix}` : `${type}:${entityId}`;
}
