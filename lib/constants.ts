// Regla 50/30/20 por defecto
export const DEFAULT_BUDGET_RULE = {
  needs: 50,
  wants: 30,
  savings: 20,
} as const;

// Tasas de interés referenciales para simulaciones
export const REFERENCE_RATES = {
  vehicle: { ea: 0.15, namv: 0.145 },
  personal: { ea: 0.18, namv: 0.175 },
  housing: { ea: 0.11, namv: 0.105 },
} as const;

export type CreditType = "vehicle" | "personal" | "housing" | "other";

// Umbral de salud financiera (porcentaje del límite)
export const HEALTH_THRESHOLDS = {
  green: 0.85, // Dentro del 85% del límite = verde
  yellow: 1.0, // Dentro del 100% del límite = amarillo
  // > 100% = rojo
} as const;

// Moneda por defecto
export const DEFAULT_CURRENCY = "COP";

// Límites de simulación
export const SIMULATION_LIMITS = {
  maxTermMonths: 120, // 10 años
  minDownPaymentPercent: 0.1, // 10% de entrada mínima
} as const;
