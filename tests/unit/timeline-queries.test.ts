import { describe, it, expect } from "vitest";
import {
  buildTimelineEvents,
  sortAndPaginateEvents,
  type RawLoanForTimeline,
  type RawSimulationForTimeline,
} from "@/server/queries/timeline-queries";
import { TIMELINE_EVENT_TYPES, type TimelineEventType } from "@/lib/timeline-types";

const ALL_TYPES = new Set<TimelineEventType>(TIMELINE_EVENT_TYPES);

function makeSimulation(
  overrides: Partial<RawSimulationForTimeline> = {}
): RawSimulationForTimeline {
  return {
    id: "sim-1",
    type: "VEHICLE",
    title: "Carro 2026",
    inputs: { price: 50_000_000, downPayment: 8_000_000, term: 72, rate: 0.1718, formula: "french_ea" },
    result: { monthlyPayment: 1_018_463.5, verdict: "APPROVED", availableAfter: 0, totalInterest: 26_289_376, totalCost: 76_289_376 },
    createdAt: new Date("2026-01-15T10:00:00Z"),
    ...overrides,
  };
}

function makeLoan(
  overrides: Partial<RawLoanForTimeline> = {}
): RawLoanForTimeline {
  return {
    id: "loan-1",
    title: "Carro 2026",
    type: "VEHICLE",
    principal: 47_000_000,
    termMonths: 72,
    monthlyPayment: 1_018_463.5,
    simulationId: "sim-1",
    totalInterest: 26_289_376,
    status: "ACTIVE",
    paidInstallments: 5,
    createdAt: new Date("2026-01-20T10:00:00Z"),
    updatedAt: new Date("2026-06-15T10:00:00Z"),
    payments: [
      { id: "pay-1", amount: 1_018_463.5, principalPaid: 800_000, interestPaid: 218_463.5, paidDate: new Date("2026-02-15T10:00:00Z") },
      { id: "pay-2", amount: 1_018_463.5, principalPaid: 815_000, interestPaid: 203_463.5, paidDate: new Date("2026-03-15T10:00:00Z") },
      { id: "pay-3", amount: 1_018_463.5, principalPaid: 830_000, interestPaid: 188_463.5, paidDate: new Date("2026-04-15T10:00:00Z") },
    ],
    extraPayments: [
      { id: "extra-1", amount: 2_000_000, date: new Date("2026-05-10T10:00:00Z"), note: "Abono especial" },
    ],
    ...overrides,
  };
}

describe("buildTimelineEvents", () => {
  it("normalizes one simulation into a SIMULATION_CREATED event", () => {
    const events = buildTimelineEvents([makeSimulation()], [], ALL_TYPES);
    expect(events).toHaveLength(1);
    const event = events[0];
    if (event.type !== "SIMULATION_CREATED") throw new Error("wrong type");
    expect(event.simulationId).toBe("sim-1");
    expect(event.monthlyPayment).toBe(1_018_463.5);
    expect(event.verdict).toBe("APPROVED");
    expect(event.price).toBe(50_000_000);
    expect(event.term).toBe(72);
    expect(event.title).toBe("Carro 2026");
    expect(event.id).toBe("SIMULATION_CREATED:sim-1");
  });

  it("normalizes one loan into 5 events (created + 3 payments + 1 extra)", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    expect(events).toHaveLength(5);
    const types = events.map((e) => e.type).sort();
    expect(types).toEqual([
      "LOAN_CREATED",
      "LOAN_EXTRA_PAYMENT",
      "LOAN_PAYMENT",
      "LOAN_PAYMENT",
      "LOAN_PAYMENT",
    ]);
  });

  it("emits a LOAN_PAID_OFF synthetic event when paidInstallments >= termMonths", () => {
    const loan = makeLoan({ paidInstallments: 72, termMonths: 72 });
    const events = buildTimelineEvents([], [loan], ALL_TYPES);
    const types = events.map((e) => e.type);
    expect(types).toContain("LOAN_PAID_OFF");
  });

  it("does NOT emit LOAN_PAID_OFF when paidInstallments < termMonths", () => {
    const events = buildTimelineEvents([], [makeLoan({ paidInstallments: 5 })], ALL_TYPES);
    expect(events.map((e) => e.type)).not.toContain("LOAN_PAID_OFF");
  });

  it("uses last payment date as LOAN_PAID_OFF occurredAt", () => {
    const loan = makeLoan({
      paidInstallments: 72,
      termMonths: 72,
      payments: [
        { id: "p-1", amount: 1_000_000, principalPaid: 900_000, interestPaid: 100_000, paidDate: new Date("2025-12-15T10:00:00Z") },
      ],
    });
    const events = buildTimelineEvents([], [loan], ALL_TYPES);
    const paidOff = events.find((e) => e.type === "LOAN_PAID_OFF");
    expect(paidOff?.occurredAt.toISOString()).toBe("2025-12-15T10:00:00.000Z");
  });

  it("uses loan.updatedAt for LOAN_PAID_OFF when there are no payments", () => {
    const loan = makeLoan({
      paidInstallments: 72,
      termMonths: 72,
      payments: [],
      updatedAt: new Date("2026-05-20T10:00:00Z"),
    });
    const events = buildTimelineEvents([], [loan], ALL_TYPES);
    const paidOff = events.find((e) => e.type === "LOAN_PAID_OFF");
    expect(paidOff?.occurredAt.toISOString()).toBe("2026-05-20T10:00:00.000Z");
  });

  it("filters out events whose type is not in the type set", () => {
    const events = buildTimelineEvents(
      [makeSimulation()],
      [makeLoan()],
      new Set<TimelineEventType>(["LOAN_PAYMENT"])
    );
    expect(events.every((e) => e.type === "LOAN_PAYMENT")).toBe(true);
  });

  it("returns LOAN_PAYMENT events with sequential installment numbers", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const payments = events
      .filter((e) => e.type === "LOAN_PAYMENT")
      .sort((a, b) => a.occurredAt.getTime() - b.occurredAt.getTime());
    expect(payments.map((p) => p.installmentNumber)).toEqual([1, 2, 3]);
  });

  it("preserves the loan's simulationId on LOAN_CREATED for cross-linking", () => {
    const events = buildTimelineEvents([], [makeLoan({ simulationId: "sim-42" })], ALL_TYPES);
    const created = events.find((e) => e.type === "LOAN_CREATED");
    if (!created || created.type !== "LOAN_CREATED") throw new Error("missing");
    expect(created.simulationId).toBe("sim-42");
  });

  it("parses numeric string fields from Prisma Decimal-like values", () => {
    const events = buildTimelineEvents(
      [],
      [makeLoan({ principal: "47000000.00", monthlyPayment: "1018463.50" })],
      ALL_TYPES
    );
    const created = events.find((e) => e.type === "LOAN_CREATED");
    if (!created || created.type !== "LOAN_CREATED") throw new Error("missing");
    expect(created.principal).toBe(47_000_000);
    expect(created.monthlyPayment).toBe(1_018_463.5);
  });

  it("falls back to safe defaults for malformed simulation result/inputs", () => {
    const events = buildTimelineEvents(
      [makeSimulation({ result: "garbage", inputs: null })],
      [],
      ALL_TYPES
    );
    const sim = events[0];
    if (sim.type !== "SIMULATION_CREATED") throw new Error("wrong type");
    expect(sim.monthlyPayment).toBe(0);
    expect(sim.verdict).toBe("WARNING");
    expect(sim.totalCost).toBe(0);
    expect(sim.price).toBe(0);
    expect(sim.term).toBe(0);
  });
});

describe("sortAndPaginateEvents", () => {
  it("sorts events in descending chronological order (newest first)", () => {
    const loan = makeLoan();
    const sim = makeSimulation({ createdAt: new Date("2026-06-01T10:00:00Z") });
    const events = buildTimelineEvents([sim], [loan], ALL_TYPES);
    const { page } = sortAndPaginateEvents(events, 100, null);
    for (let i = 0; i < page.length - 1; i++) {
      const a = page[i].occurredAt.getTime();
      const b = page[i + 1].occurredAt.getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("returns total = full event count even when paginated", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { total } = sortAndPaginateEvents(events, 2, null);
    expect(total).toBe(5);
  });

  it("returns hasMore=true when more events exist after the page", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { hasMore } = sortAndPaginateEvents(events, 2, null);
    expect(hasMore).toBe(true);
  });

  it("returns hasMore=false when page fits all events", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { hasMore } = sortAndPaginateEvents(events, 100, null);
    expect(hasMore).toBe(false);
  });

  it("returns nextCursor pointing to the last item in the page", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { page, nextCursor } = sortAndPaginateEvents(events, 2, null);
    expect(nextCursor).not.toBeNull();
    expect(nextCursor?.id).toBe(page[page.length - 1].id);
  });

  it("returns nextCursor=null on the last page", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { nextCursor } = sortAndPaginateEvents(events, 100, null);
    expect(nextCursor).toBeNull();
  });

  it("respects the cursor and returns events strictly after it", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const firstPage = sortAndPaginateEvents(events, 2, null);
    const secondPage = sortAndPaginateEvents(events, 100, firstPage.nextCursor!);
    expect(secondPage.page.length).toBeGreaterThan(0);
    const firstPageIds = new Set(firstPage.page.map((e) => e.id));
    for (const ev of secondPage.page) {
      expect(firstPageIds.has(ev.id)).toBe(false);
    }
  });

  it("returns empty page and null cursor when cursor is past the end", () => {
    const events = buildTimelineEvents([], [makeLoan()], ALL_TYPES);
    const { page, nextCursor, hasMore } = sortAndPaginateEvents(events, 100, {
      occurredAt: "1990-01-01T00:00:00.000Z",
      id: "nonexistent",
    });
    expect(page).toHaveLength(0);
    expect(nextCursor).toBeNull();
    expect(hasMore).toBe(false);
  });
});
