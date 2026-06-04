import "server-only";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  buildEventId,
  DEFAULT_PAGE_SIZE,
  parseLoanType,
  parseSimulationInputs,
  parseSimulationResult,
  parseSimulationType,
  type LoanCreatedEvent,
  type LoanExtraPaymentEvent,
  type LoanPaidOffEvent,
  type LoanPaymentEvent,
  type SimulationCreatedEvent,
  type TimelineCursor,
  type TimelineEvent,
  type TimelineEventType,
  type TimelinePage,
} from "@/lib/timeline-types";

function eventPrimaryTimestamp(event: TimelineEvent): Date {
  return event.occurredAt;
}

export interface RawSimulationForTimeline {
  id: string;
  type: string;
  title: string;
  inputs: unknown;
  result: unknown;
  createdAt: Date;
}

export interface RawLoanPaymentForTimeline {
  id: string;
  amount: unknown;
  principalPaid: unknown;
  interestPaid: unknown;
  paidDate: Date;
}

export interface RawLoanExtraForTimeline {
  id: string;
  amount: unknown;
  date: Date;
  note: string | null;
}

export interface RawLoanForTimeline {
  id: string;
  title: string;
  type: string;
  principal: unknown;
  termMonths: number;
  monthlyPayment: unknown;
  simulationId: string | null;
  totalInterest: unknown;
  status: string;
  paidInstallments: number;
  createdAt: Date;
  updatedAt: Date;
  payments: RawLoanPaymentForTimeline[];
  extraPayments: RawLoanExtraForTimeline[];
}

export function buildTimelineEvents(
  simulations: RawSimulationForTimeline[],
  loans: RawLoanForTimeline[],
  types: ReadonlySet<TimelineEventType> | null
): TimelineEvent[] {
  const want = (t: TimelineEventType) => types === null || types.has(t);
  const events: TimelineEvent[] = [];

  if (want("SIMULATION_CREATED")) {
    for (const sim of simulations) {
      const result = parseSimulationResult(sim.result);
      const inputs = parseSimulationInputs(sim.inputs);
      const simulationType = parseSimulationType(sim.type);
      const event: SimulationCreatedEvent = {
        id: buildEventId("SIMULATION_CREATED", sim.id),
        type: "SIMULATION_CREATED",
        occurredAt: sim.createdAt,
        simulationId: sim.id,
        simulationType,
        title: sim.title,
        monthlyPayment: result.monthlyPayment,
        verdict: result.verdict,
        totalCost: result.totalCost,
        price: inputs.price,
        term: inputs.term,
      };
      events.push(event);
    }
  }

  for (const loan of loans) {
    const loanType = parseLoanType(loan.type);

    if (want("LOAN_CREATED")) {
      const event: LoanCreatedEvent = {
        id: buildEventId("LOAN_CREATED", loan.id),
        type: "LOAN_CREATED",
        occurredAt: loan.createdAt,
        loanId: loan.id,
        title: loan.title,
        loanType,
        principal: Number(loan.principal),
        termMonths: loan.termMonths,
        monthlyPayment: Number(loan.monthlyPayment),
        simulationId: loan.simulationId,
      };
      events.push(event);
    }

    if (want("LOAN_PAYMENT")) {
      loan.payments.forEach((payment, index) => {
        const event: LoanPaymentEvent = {
          id: buildEventId(
            "LOAN_PAYMENT",
            loan.id,
            `${payment.paidDate.toISOString()}:${index}`
          ),
          type: "LOAN_PAYMENT",
          occurredAt: payment.paidDate,
          loanId: loan.id,
          loanTitle: loan.title,
          installmentNumber: index + 1,
          totalInstallments: loan.termMonths,
          amount: Number(payment.amount),
          principalPaid: Number(payment.principalPaid),
          interestPaid: Number(payment.interestPaid),
        };
        events.push(event);
      });
    }

    if (want("LOAN_EXTRA_PAYMENT")) {
      for (const extra of loan.extraPayments) {
        const event: LoanExtraPaymentEvent = {
          id: buildEventId("LOAN_EXTRA_PAYMENT", extra.id),
          type: "LOAN_EXTRA_PAYMENT",
          occurredAt: extra.date,
          loanId: loan.id,
          loanTitle: loan.title,
          amount: Number(extra.amount),
          note: extra.note,
        };
        events.push(event);
      }
    }

    if (want("LOAN_PAID_OFF") && loan.paidInstallments >= loan.termMonths) {
      const lastPayment = loan.payments[loan.payments.length - 1];
      const paidOffAt = lastPayment ? lastPayment.paidDate : new Date(loan.updatedAt);
      const event: LoanPaidOffEvent = {
        id: buildEventId("LOAN_PAID_OFF", loan.id),
        type: "LOAN_PAID_OFF",
        occurredAt: paidOffAt,
        loanId: loan.id,
        loanTitle: loan.title,
        totalInterest: Number(loan.totalInterest),
        termMonths: loan.termMonths,
      };
      events.push(event);
    }
  }

  return events;
}

export function sortAndPaginateEvents(
  events: TimelineEvent[],
  limit: number,
  cursor: TimelineCursor | null
): { page: TimelineEvent[]; nextCursor: TimelineCursor | null; hasMore: boolean; total: number } {
  const sorted = [...events].sort((a, b) => {
    const diff = eventPrimaryTimestamp(b).getTime() - eventPrimaryTimestamp(a).getTime();
    if (diff !== 0) return diff;
    return a.id.localeCompare(b.id);
  });

  let startIndex = 0;
  if (cursor) {
    const cursorTime = new Date(cursor.occurredAt).getTime();
    startIndex = sorted.findIndex((e) => {
      const eTime = eventPrimaryTimestamp(e).getTime();
      if (eTime !== cursorTime) return eTime < cursorTime;
      return e.id.localeCompare(cursor.id) < 0;
    });
    if (startIndex === -1) startIndex = sorted.length;
  }

  const page = sorted.slice(startIndex, startIndex + limit);
  const last = page[page.length - 1];
  const hasMore = startIndex + limit < sorted.length;
  const nextCursor: TimelineCursor | null =
    hasMore && last
      ? {
          occurredAt: eventPrimaryTimestamp(last).toISOString(),
          id: last.id,
        }
      : null;

  return { page, nextCursor, hasMore, total: sorted.length };
}

export interface GetTimelineOptions {
  limit?: number;
  cursor?: TimelineCursor | null;
  types?: readonly TimelineEventType[] | null;
}

export async function getTimelineEvents(
  userId: string,
  options: GetTimelineOptions = {}
): Promise<TimelinePage> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return { events: [], nextCursor: null, hasMore: false, total: 0 };
  }

  const limit = Math.max(1, Math.min(options.limit ?? DEFAULT_PAGE_SIZE, 100));
  const typesFilter =
    options.types && options.types.length > 0
      ? new Set<TimelineEventType>(options.types)
      : null;
  const cursor = options.cursor ?? null;

  const [simulations, loans] = await Promise.all([
    typesFilter === null || typesFilter.has("SIMULATION_CREATED")
      ? prisma.simulation.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([] as Awaited<ReturnType<typeof prisma.simulation.findMany>>),
    prisma.loan.findMany({
      where: { userId },
      include: {
        payments: { orderBy: { paidDate: "asc" } },
        extraPayments: { orderBy: { date: "asc" } },
      },
    }),
  ]);

  const allEvents = buildTimelineEvents(
    simulations as unknown as RawSimulationForTimeline[],
    loans as unknown as RawLoanForTimeline[],
    typesFilter
  );

  const { page, nextCursor, hasMore, total } = sortAndPaginateEvents(
    allEvents,
    limit,
    cursor
  );

  return { events: page, nextCursor, hasMore, total };
}
