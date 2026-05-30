import { describe, it, expect } from "vitest";
import {
  calculateLoanPayment,
  getVerdict,
} from "@/lib/simulation-engine";

describe("calculateLoanPayment", () => {
  it("calculates payment for $100M COP, 15% EA, 5 years", () => {
    // principal = 100_000_000, annualRate = 0.15, termMonths = 60
    const payment = calculateLoanPayment(100_000_000, 0.15, 60);
    // Monthly rate = (1 + 0.15)^(1/12) - 1 ≈ 0.0117149
    // Payment ≈ 2,379,000 (approximate)
    expect(payment).toBeGreaterThan(2_300_000);
    expect(payment).toBeLessThan(2_500_000);
  });

  it("returns 0 for zero principal", () => {
    expect(calculateLoanPayment(0, 0.15, 60)).toBe(0);
  });

  it("returns 0 for zero term", () => {
    expect(calculateLoanPayment(100_000_000, 0.15, 0)).toBe(0);
  });

  it("returns 0 for negative principal", () => {
    expect(calculateLoanPayment(-100_000, 0.15, 60)).toBe(0);
  });

  it("handles zero interest rate correctly", () => {
    const payment = calculateLoanPayment(100_000_000, 0, 60);
    expect(payment).toBe(1_666_666.67);
  });

  it("calculates payment for $50M COP, 12% EA, 3 years", () => {
    const payment = calculateLoanPayment(50_000_000, 0.12, 36);
    expect(payment).toBeGreaterThan(1_600_000);
    expect(payment).toBeLessThan(1_700_000);
  });
});

describe("getVerdict", () => {
  it("returns SAFE when payment is <= 30% of available", () => {
    const result = getVerdict(300_000, 1_000_000);
    expect(result.verdict).toBe("SAFE");
    expect(result.percentage).toBe(30);
  });

  it("returns TIGHT when payment is 31-50% of available", () => {
    const result = getVerdict(400_000, 1_000_000);
    expect(result.verdict).toBe("TIGHT");
    expect(result.percentage).toBe(40);
  });

  it("returns RISKY when payment is 51-70% of available", () => {
    const result = getVerdict(600_000, 1_000_000);
    expect(result.verdict).toBe("RISKY");
    expect(result.percentage).toBe(60);
  });

  it("returns NOT_RECOMMENDED when payment is > 70% of available", () => {
    const result = getVerdict(800_000, 1_000_000);
    expect(result.verdict).toBe("NOT_RECOMMENDED");
    expect(result.percentage).toBe(80);
  });

  it("returns NOT_RECOMMENDED when available is zero", () => {
    const result = getVerdict(100_000, 0);
    expect(result.verdict).toBe("NOT_RECOMMENDED");
    expect(result.percentage).toBe(100);
  });

  it("returns NOT_RECOMMENDED when available is negative", () => {
    const result = getVerdict(100_000, -500_000);
    expect(result.verdict).toBe("NOT_RECOMMENDED");
    expect(result.percentage).toBe(100);
  });

  it("returns NOT_RECOMMENDED when payment exceeds available", () => {
    const result = getVerdict(1_500_000, 1_000_000);
    expect(result.verdict).toBe("NOT_RECOMMENDED");
    expect(result.percentage).toBe(100);
  });

  it("returns SAFE at exact 30% boundary", () => {
    const result = getVerdict(300_000, 1_000_000);
    expect(result.verdict).toBe("SAFE");
  });

  it("returns TIGHT at exact 50% boundary", () => {
    const result = getVerdict(500_000, 1_000_000);
    expect(result.verdict).toBe("TIGHT");
  });

  it("returns RISKY at exact 70% boundary", () => {
    const result = getVerdict(700_000, 1_000_000);
    expect(result.verdict).toBe("RISKY");
  });
});
