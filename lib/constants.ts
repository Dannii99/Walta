// Regla 50/30/20 por defecto
export const DEFAULT_BUDGET_RULE = {
  needs: 50,
  wants: 30,
  savings: 20,
} as const;

// Tasas de interés referenciales (EA - Efectivo Anual) para simulaciones
export const REFERENCE_RATES = {
  vehicle: {
    min: 0.12, // 12% EA
    max: 0.18, // 18% EA
    default: 0.15, // 15% EA
  },
  housing: {
    min: 0.08, // 8% EA
    max: 0.14, // 14% EA
    default: 0.11, // 11% EA
  },
} as const;

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
