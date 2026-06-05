import { describe, it, expect } from "vitest";
import {
  classify,
  computeSavingsHealth,
  type SavingsHealthStatus,
} from "@/lib/savings-health";

describe("classify()", () => {
  it("returns 'deficit' when rate < 0 (expenses > income)", () => {
    expect(classify(-60, 20)).toBe("deficit");
    expect(classify(-0.001, 20)).toBe("deficit");
  });

  it("returns 'critical' when 0 <= rate < 10", () => {
    expect(classify(0, 20)).toBe("critical");
    expect(classify(4, 20)).toBe("critical");
    expect(classify(9.99, 20)).toBe("critical");
  });

  it("returns 'warming' when ruleTargetPct <= rate < 60 and rate is below rule threshold", () => {
    expect(classify(10, 20)).toBe("warming");
    expect(classify(15, 20)).toBe("warming");
    expect(classify(19, 20)).toBe("warming");
  });

  it("returns 'warming' when 10 <= rate < ruleTargetPct (custom rule 30)", () => {
    expect(classify(10, 30)).toBe("warming");
    expect(classify(20, 30)).toBe("warming");
    expect(classify(29, 30)).toBe("warming");
  });

  it("returns 'healthy' when ruleTargetPct <= rate < 60 (default rule)", () => {
    expect(classify(20, 20)).toBe("healthy");
    expect(classify(40, 20)).toBe("healthy");
    expect(classify(59, 20)).toBe("healthy");
  });

  it("returns 'healthy' when 20 <= rate < 60 (custom rule 30)", () => {
    expect(classify(30, 30)).toBe("healthy");
    expect(classify(41, 30)).toBe("healthy");
    expect(classify(59, 30)).toBe("healthy");
  });

  it("returns 'aggressive' when 60 <= rate <= 100", () => {
    expect(classify(60, 20)).toBe("aggressive");
    expect(classify(80, 20)).toBe("aggressive");
    expect(classify(100, 20)).toBe("aggressive");
  });

  it("returns 'extraordinary' when rate > 100 (expenses negative)", () => {
    expect(classify(101, 20)).toBe("extraordinary");
    expect(classify(150, 20)).toBe("extraordinary");
  });
});

describe("computeSavingsHealth()", () => {
  it("returns the SavingsHealthInfo bundle", () => {
    const result = computeSavingsHealth(5000, 2000, 20);
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("rate");
    expect(result).toHaveProperty("barFillPct");
    expect(result).toHaveProperty("barClass");
    expect(result).toHaveProperty("label");
    expect(result).toHaveProperty("emoji");
    expect(result).toHaveProperty("Icon");
    expect(result).toHaveProperty("message");
  });

  it("computes rate = (income - expenses) / income * 100", () => {
    expect(computeSavingsHealth(5000, 2500, 20).rate).toBe(50);
    expect(computeSavingsHealth(1000, 100, 20).rate).toBe(90);
    expect(computeSavingsHealth(1000, 900, 20).rate).toBe(10);
    expect(computeSavingsHealth(1000, 1000, 20).rate).toBe(0);
  });

  it("returns deficit status for zero income (rate = 0)", () => {
    const result = computeSavingsHealth(0, 0, 20);
    expect(result.status).toBe("deficit");
    expect(result.rate).toBe(0);
  });

  it("returns deficit status when expenses > income", () => {
    const result = computeSavingsHealth(5000, 8000, 20);
    expect(result.status).toBe("deficit");
    expect(result.rate).toBe(-60);
    expect(result.label).toBe("Déficit");
    expect(result.emoji).toBe("😟");
  });

  it("produces negative rate when expenses > income", () => {
    expect(computeSavingsHealth(5000, 8000, 20).rate).toBe(-60);
  });

  it("caps barFillPct at 100 even when rate > 100", () => {
    const result = computeSavingsHealth(1000, -500, 20);
    expect(result.rate).toBe(150);
    expect(result.barFillPct).toBe(100);
  });

  it("keeps barFillPct at 0 when rate < 0", () => {
    const result = computeSavingsHealth(5000, 8000, 20);
    expect(result.rate).toBe(-60);
    expect(result.barFillPct).toBe(0);
  });

  it("maps rate exactly at 0 to barFillPct 0", () => {
    const result = computeSavingsHealth(5000, 5000, 20);
    expect(result.rate).toBe(0);
    expect(result.barFillPct).toBe(0);
  });

  it("returns deficit status for zero income (income 0 + expenses 0)", () => {
    const result = computeSavingsHealth(0, 0, 20);
    expect(result.status).toBe("deficit");
  });

  it("returns critical status for rate < 10", () => {
    const result = computeSavingsHealth(1000, 950, 20);
    expect(result.status).toBe("critical");
    expect(result.label).toBe("Muy bajo");
    expect(result.emoji).toBe("😟");
  });

  it("returns warming status for 10 <= rate < ruleTargetPct", () => {
    const result = computeSavingsHealth(1000, 850, 20);
    expect(result.status).toBe("warming");
    expect(result.label).toBe("Calentando");
    expect(result.emoji).toBe("😐");
  });

  it("returns healthy status for ruleTargetPct <= rate < 60", () => {
    const result = computeSavingsHealth(1000, 500, 20);
    expect(result.status).toBe("healthy");
    expect(result.label).toBe("Saludable");
    expect(result.emoji).toBe("😊");
  });

  it("returns aggressive status for 60 <= rate <= 100", () => {
    const result = computeSavingsHealth(1000, 200, 20);
    expect(result.status).toBe("aggressive");
    expect(result.label).toBe("Agresivo");
    expect(result.emoji).toBe("💪");
  });

  it("returns extraordinary status for rate > 100", () => {
    const result = computeSavingsHealth(1000, -500, 20);
    expect(result.status).toBe("extraordinary");
    expect(result.label).toBe("Extraordinario");
    expect(result.emoji).toBe("🌟");
  });

  it("uses rose barClass for deficit and critical", () => {
    expect(computeSavingsHealth(0, 0, 20).barClass).toContain("rose");
    expect(computeSavingsHealth(1000, 950, 20).barClass).toContain("rose");
  });

  it("uses amber barClass for warming", () => {
    expect(computeSavingsHealth(1000, 850, 20).barClass).toContain("amber");
  });

  it("uses emerald barClass for healthy and aggressive", () => {
    expect(computeSavingsHealth(1000, 500, 20).barClass).toContain("emerald");
    expect(computeSavingsHealth(1000, 200, 20).barClass).toContain("emerald");
  });

  it("uses blue barClass for extraordinary", () => {
    expect(computeSavingsHealth(1000, -500, 20).barClass).toContain("blue");
  });

  it("message is non-empty for every status", () => {
    const cases: { income: number; expenses: number; rule: number }[] = [
      { income: 0, expenses: 0, rule: 20 },
      { income: 5000, expenses: 8000, rule: 20 },
      { income: 1000, expenses: 950, rule: 20 },
      { income: 1000, expenses: 850, rule: 20 },
      { income: 1000, expenses: 500, rule: 20 },
      { income: 1000, expenses: 200, rule: 20 },
      { income: 1000, expenses: -500, rule: 20 },
    ];
    for (const c of cases) {
      const result = computeSavingsHealth(c.income, c.expenses, c.rule);
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it("deficit message is distinct from critical message", () => {
    const deficit = computeSavingsHealth(5000, 8000, 20);
    const critical = computeSavingsHealth(1000, 950, 20);
    expect(deficit.message).not.toBe(critical.message);
  });

  it("respects custom ruleTargetPct for boundary transitions", () => {
    const withRule30 = computeSavingsHealth(1000, 700, 30);
    expect(withRule30.status).toBe("healthy");

    const withRule20 = computeSavingsHealth(1000, 700, 20);
    expect(withRule20.status).toBe("healthy");
  });

  it("returns aggressive status when expenses reduced to push rate >= 60 (default rule)", () => {
    const withRule20 = computeSavingsHealth(1000, 300, 20);
    expect(withRule20.rate).toBe(70);
    expect(withRule20.status).toBe("aggressive");
  });
});

describe("SavingsHealthStatus union coverage", () => {
  it("classify() yields the 6 valid statuses", () => {
    const validStatuses: SavingsHealthStatus[] = [
      "deficit",
      "critical",
      "warming",
      "healthy",
      "aggressive",
      "extraordinary",
    ];
    const seen = new Set<string>();
    for (const rate of [-60, 5, 15, 30, 80, 150]) {
      seen.add(classify(rate, 20));
    }
    expect([...seen].sort()).toEqual([...validStatuses].sort());
  });
});
