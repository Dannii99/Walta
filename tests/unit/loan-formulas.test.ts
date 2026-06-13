import { describe, it, expect } from "vitest";
import {
  calculateFrenchPayment,
  resolveMonthlyRate,
} from "@/lib/loan-formulas";

describe("calculateFrenchPayment", () => {
  it("returns 0 when termMonths <= 0", () => {
    expect(calculateFrenchPayment(100_000, 0.01, 0)).toBe(0);
    expect(calculateFrenchPayment(100_000, 0.01, -5)).toBe(0);
  });

  it("returns 0 when principal <= 0", () => {
    expect(calculateFrenchPayment(0, 0.01, 12)).toBe(0);
    expect(calculateFrenchPayment(-1000, 0.01, 12)).toBe(0);
  });

  it("returns principal / n when monthlyRate is 0 (zero interest)", () => {
    expect(calculateFrenchPayment(120_000, 0, 12)).toBe(10_000);
    expect(calculateFrenchPayment(1_000_000, 0, 60)).toBeCloseTo(16_666.67, 2);
  });

  it("matches a known reference: $10M @ 1% monthly over 12 months", () => {
    // (1.01)^12 = 1.126825 → 10M * 0.01 * 1.126825 / 0.126825 ≈ 888_488.49
    const payment = calculateFrenchPayment(10_000_000, 0.01, 12);
    expect(payment).toBeCloseTo(888_488, 0);
  });

  it("matches a known reference: $50M @ 0.5% monthly over 60 months", () => {
    // (1.005)^60 = 1.348850 → 50M * 0.005 * 1.348850 / 0.348850 ≈ 966_640.08
    const payment = calculateFrenchPayment(50_000_000, 0.005, 60);
    expect(payment).toBeCloseTo(966_640, 0);
  });

  it("payment > principal/n when rate > 0 (includes interest)", () => {
    const principal = 12_000_000;
    const payment = calculateFrenchPayment(principal, 0.01, 12);
    expect(payment).toBeGreaterThan(principal / 12);
  });

  it("payment is monotonically increasing in monthlyRate for fixed P, n", () => {
    const p = 1_000_000;
    const n = 24;
    const a = calculateFrenchPayment(p, 0.005, n);
    const b = calculateFrenchPayment(p, 0.01, n);
    const c = calculateFrenchPayment(p, 0.02, n);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });

  it("payment is monotonically increasing in termMonths for fixed P, i", () => {
    const p = 1_000_000;
    const i = 0.01;
    const a = calculateFrenchPayment(p, i, 6);
    const b = calculateFrenchPayment(p, i, 12);
    const c = calculateFrenchPayment(p, i, 36);
    expect(a).toBeGreaterThan(b);
    expect(b).toBeGreaterThan(c);
  });

  it("handles very small rates without dividing by zero", () => {
    const payment = calculateFrenchPayment(1_000_000, 1e-10, 12);
    expect(Number.isFinite(payment)).toBe(true);
    expect(payment).toBeGreaterThan(0);
  });

  it("handles long terms (240 months) without overflow", () => {
    const payment = calculateFrenchPayment(100_000_000, 0.015, 240);
    expect(Number.isFinite(payment)).toBe(true);
    expect(payment).toBeGreaterThan(0);
  });
});

describe("resolveMonthlyRate", () => {
  it("computes EA monthly rate as (1 + annual)^(1/12) - 1", () => {
    const m = resolveMonthlyRate(0.15, "french_ea");
    expect(m).toBeCloseTo(Math.pow(1.15, 1 / 12) - 1, 10);
  });

  it("computes nominal monthly rate as annual / 12", () => {
    const m = resolveMonthlyRate(0.15, "nominal_monthly");
    expect(m).toBeCloseTo(0.0125, 10);
  });

  it("EA monthly rate is always less than nominal monthly rate for the same annual", () => {
    const ea = resolveMonthlyRate(0.15, "french_ea");
    const nom = resolveMonthlyRate(0.15, "nominal_monthly");
    expect(ea).toBeLessThan(nom);
  });

  it("returns 0 when annual is 0", () => {
    expect(resolveMonthlyRate(0, "french_ea")).toBe(0);
    expect(resolveMonthlyRate(0, "nominal_monthly")).toBe(0);
  });
});
