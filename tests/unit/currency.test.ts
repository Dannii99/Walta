import { describe, it, expect } from "vitest";
import {
  createMoney,
  createMoneyFromDecimal,
  formatMoney,
  formatCOP,
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney,
  toNumber,
} from "@/lib/currency";

describe("createMoney", () => {
  it("creates Dinero from cents", () => {
    const money = createMoney(123456);
    expect(toNumber(money)).toBe(1234.56);
  });

  it("creates Dinero from zero cents", () => {
    const money = createMoney(0);
    expect(toNumber(money)).toBe(0);
  });
});

describe("createMoneyFromDecimal", () => {
  it("creates Dinero from decimal", () => {
    const money = createMoneyFromDecimal(1234.56);
    expect(toNumber(money)).toBe(1234.56);
  });

  it("rounds to 2 decimals", () => {
    const money = createMoneyFromDecimal(1234.567);
    expect(toNumber(money)).toBeCloseTo(1234.57, 2);
  });
});

describe("formatMoney", () => {
  it("formats COP with Colombian pattern (no decimals)", () => {
    const money = createMoneyFromDecimal(1234567);
    const formatted = formatMoney(money);
    expect(formatted).toContain("$");
    expect(formatted).toContain("1.234.567");
    expect(formatted).not.toContain(",");
  });

  it("rounds fractional values to whole pesos", () => {
    const money = createMoneyFromDecimal(1234567.89);
    const formatted = formatMoney(money);
    expect(formatted).toContain("1.234.568");
    expect(formatted).not.toContain(",");
  });

  it("formats zero correctly", () => {
    const money = createMoney(0);
    const formatted = formatMoney(money);
    expect(formatted).toContain("$");
    expect(formatted).toContain("0");
    expect(formatted).not.toContain(",");
  });
});

describe("formatCOP", () => {
  it("formats number directly to COP (no decimals)", () => {
    const formatted = formatCOP(1234567);
    expect(formatted).toContain("$");
    expect(formatted).toContain("1.234.567");
    expect(formatted).not.toContain(",");
  });

  it("rounds fractional values to whole pesos", () => {
    const formatted = formatCOP(1234567.89);
    expect(formatted).toContain("1.234.568");
    expect(formatted).not.toContain(",");
  });
});

describe("addMoney", () => {
  it("adds two Dinero values", () => {
    const a = createMoneyFromDecimal(1000);
    const b = createMoneyFromDecimal(500);
    const result = addMoney(a, b);
    expect(toNumber(result)).toBe(1500);
  });
});

describe("subtractMoney", () => {
  it("subtracts two Dinero values", () => {
    const a = createMoneyFromDecimal(1000);
    const b = createMoneyFromDecimal(300);
    const result = subtractMoney(a, b);
    expect(toNumber(result)).toBe(700);
  });
});

describe("multiplyMoney", () => {
  it("multiplies Dinero by factor", () => {
    const money = createMoneyFromDecimal(1000);
    const result = multiplyMoney(money, 3);
    expect(toNumber(result)).toBe(3000);
  });
});

describe("divideMoney", () => {
  it("divides Dinero by divisor", () => {
    const money = createMoneyFromDecimal(1000);
    const result = divideMoney(money, 4);
    expect(toNumber(result)).toBe(250);
  });
});
