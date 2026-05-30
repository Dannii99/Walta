import { dinero, toDecimal, add, subtract, multiply, toSnapshot, type Dinero } from "dinero.js";

const currencyCOP = {
  code: "COP",
  base: 10,
  exponent: 2,
};

/**
 * Crea un objeto Dinero desde un valor en centavos (entero)
 */
export function createMoney(amount: number): Dinero<number> {
  return dinero({ amount, currency: currencyCOP });
}

/**
 * Crea un objeto Dinero desde un valor decimal (ej. 123456.78)
 */
export function createMoneyFromDecimal(amount: number): Dinero<number> {
  const cents = Math.round(amount * 100);
  return dinero({ amount: cents, currency: currencyCOP });
}

/**
 * Formatea un Dinero a string en formato colombiano:
 * $ 1.234.567,89
 */
export function formatMoney(money: Dinero<number>): string {
  const decimal = toDecimal(money, ({ value }) => value);
  const num = parseFloat(decimal);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Formatea un número directamente a COP
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Suma dos Dinero
 */
export function addMoney(a: Dinero<number>, b: Dinero<number>): Dinero<number> {
  return add(a, b);
}

/**
 * Resta dos Dinero
 */
export function subtractMoney(
  a: Dinero<number>,
  b: Dinero<number>
): Dinero<number> {
  return subtract(a, b);
}

/**
 * Multiplica un Dinero por un factor
 */
export function multiplyMoney(
  money: Dinero<number>,
  factor: number
): Dinero<number> {
  return multiply(money, factor);
}

/**
 * Divide un Dinero por un divisor (usando conversión a número para evitar API inestable)
 */
export function divideMoney(
  money: Dinero<number>,
  divisor: number
): Dinero<number> {
  const decimal = toDecimal(money, ({ value }) => value);
  const result = parseFloat(decimal) / divisor;
  return createMoneyFromDecimal(result);
}

/**
 * Compara si a > b
 */
export function isGreaterThan(a: Dinero<number>, b: Dinero<number>): boolean {
  const snapA = toSnapshot(a);
  const snapB = toSnapshot(b);
  return snapA.amount > snapB.amount;
}

/**
 * Compara si a < b
 */
export function isLessThan(a: Dinero<number>, b: Dinero<number>): boolean {
  const snapA = toSnapshot(a);
  const snapB = toSnapshot(b);
  return snapA.amount < snapB.amount;
}

/**
 * Obtiene el valor numérico (decimal) de un Dinero
 */
export function toNumber(money: Dinero<number>): number {
  const decimal = toDecimal(money, ({ value }) => value);
  return parseFloat(decimal);
}
