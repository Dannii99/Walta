import { formatCOP } from "@/lib/currency";

export const SIMULATION_ADVISOR_SYSTEM = `Eres un asesor financiero personal empático y educativo para Walta, una app colombiana de finanzas personales.

PERSONALIDAD
- Calmado, sin juzgar, educativo
- Español colombiano natural (tutea al usuario, no uses "usted")
- Concreto: máximo 3 recomendaciones, no des un sermón
- Reconoce el peso emocional de una compra grande

CONTEXTO QUE RECIBES
- Ingreso mensual, gastos recurrentes, disponible real
- Créditos activos con sus cuotas (si los hay)
- Datos completos de la simulación actual
- "Disponible" = lo que queda después de gastos recurrentes

REGLAS CRÍTICAS
- NUNCA inventes cifras. Solo usa los números del contexto provisto.
- Si un dato no está disponible, dilo explícitamente en "risks".
- Máximo 3 recommendations, 3 risks, 1 alternative_suggestion.
- No uses jerga técnica sin explicar (p.ej. "ratio deuda/ingreso" → explícalo brevemente).
- No recomiendes productos específicos de bancos por nombre.
- Tono: habla de "tu", no de "usted".
- NO incluyas disclaimers en el JSON, eso lo agrega la UI.
- NO uses campos que no están en el schema.

FORMATO DE RESPUESTA (JSON estricto, sin texto fuera del JSON)
{
  "verdict_explanation": "1-2 oraciones en lenguaje claro que expliquen el veredicto y el impacto en el día a día",
  "recommendations": [
    { "title": "string corto y accionable", "description": "1-2 oraciones", "impact": "positive | neutral | negative" }
  ],
  "risks": ["string corto cada uno, sin repetir cifras de recommendations"],
  "alternative_suggestion": "1-2 oraciones (opcional, omite el campo si no aplica)"
}`;

export const SIMULATION_INSIGHTS_SYSTEM = `Eres un asesor financiero que entrega un resumen BREVE del portafolio de simulaciones de un usuario colombiano.

REGLAS
- Máximo 2 frases (entre 30 y 200 palabras en total).
- Tono directo pero amigable, en español colombiano.
- Identifica el ratio total comprometido vs disponible.
- Señala la simulación más riesgosa si aplica.
- Si el portafolio está bien, dilo.
- Si hay problemas, da 1 acción concreta.
- NO uses disclaimers.
- NO des sermones.
- SOLO el insight, sin preámbulos como "Aquí está tu análisis".

FORMATO DE RESPUESTA (JSON estricto)
{
  "insight": "string con 1-2 frases en español colombiano"
}`;

export interface ActiveLoanContext {
  type: string;
  monthlyPayment: number;
  remainingMonths: number;
}

export interface SimulationContext {
  type: string;
  title: string;
  price: number;
  downPayment: number;
  principal: number;
  termMonths: number;
  termYears: number;
  rate: number;
  formula: string;
  monthlyPayment: number;
  percentage: number;
  verdict: string;
  remainingAfter: number;
  totalInterest: number;
  totalCost: number;
}

export interface AdvisorContext {
  income: number;
  available: number;
  recommendedMax: number;
  activeLoansTotal: number;
  activeLoans: ActiveLoanContext[];
  simulation: SimulationContext;
}

export interface SimulationSummary {
  type: string;
  monthlyPayment: number;
  verdict: string;
}

export interface InsightsContext {
  simulations: SimulationSummary[];
  totalMonthly: number;
  available: number;
  ratio: number;
}

const TYPE_LABELS: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal / Libre inversión",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

const VERDICT_LABELS: Record<string, string> = {
  SAFE: "Seguro",
  TIGHT: "Ajustado",
  RISKY: "Riesgoso",
  NOT_RECOMMENDED: "No recomendado",
  APPROVED: "Aprobado",
  WARNING: "Advertencia",
  REJECTED: "Rechazado",
};

const FORMULA_LABELS: Record<string, string> = {
  french_ea: "Francesa (EA)",
  nominal_monthly: "NAMV mensual",
};

function labelOr(value: string, map: Record<string, string>): string {
  return map[value] ?? value;
}

export function buildAdvisorUserPrompt(context: AdvisorContext): string {
  const { simulation, activeLoans, income, available, recommendedMax, activeLoansTotal } = context;

  const activeLoansText =
    activeLoans.length === 0
      ? "ninguno"
      : activeLoans
          .map(
            (l) =>
              `${labelOr(l.type, TYPE_LABELS)} (${formatCOP(l.monthlyPayment)}/mes, ${l.remainingMonths} meses restantes)`
          )
          .join("; ");

  return `CONTEXTO FINANCIERO DEL USUARIO
- Ingreso mensual: ${formatCOP(income)}
- Disponible mensual (después de gastos recurrentes): ${formatCOP(available)}
- Máximo recomendado para nueva deuda (30% del disponible): ${formatCOP(recommendedMax)}
- Total cuota mensual de créditos activos: ${formatCOP(activeLoansTotal)}
- Créditos activos: ${activeLoansText}

SIMULACIÓN A ANALIZAR
- Tipo: ${labelOr(simulation.type, TYPE_LABELS)}
- Título: ${simulation.title}
- Precio: ${formatCOP(simulation.price)}
- Cuota inicial: ${formatCOP(simulation.downPayment)}
- Monto a financiar: ${formatCOP(simulation.principal)}
- Plazo: ${simulation.termMonths} meses (${simulation.termYears} años)
- Tasa: ${(simulation.rate * 100).toFixed(2)}% EA
- Fórmula: ${FORMULA_LABELS[simulation.formula] ?? simulation.formula}
- Cuota mensual estimada: ${formatCOP(simulation.monthlyPayment)}
- Porcentaje del disponible: ${simulation.percentage.toFixed(1)}%
- Veredicto interno: ${labelOr(simulation.verdict, VERDICT_LABELS)}
- Después de pagar, quedaría libre: ${formatCOP(simulation.remainingAfter)}
- Total intereses: ${formatCOP(simulation.totalInterest)}
- Costo total: ${formatCOP(simulation.totalCost)}

Analiza esta decisión financiera y responde SOLO con el JSON estructurado.`;
}

export function buildInsightsUserPrompt(context: InsightsContext): string {
  const { simulations, totalMonthly, available, ratio } = context;

  const detail =
    simulations.length === 0
      ? "sin simulaciones"
      : simulations
          .map(
            (s) =>
              `${labelOr(s.type, TYPE_LABELS)} (${formatCOP(s.monthlyPayment)}/mes, ${labelOr(s.verdict, VERDICT_LABELS)})`
          )
          .join("; ");

  const exceedsText = ratio > 100 ? " (EXCEDE EL DISPONIBLE)" : "";

  return `PORTAFOLIO DE SIMULACIONES DEL USUARIO
- Total simulaciones: ${simulations.length}
- Detalle: ${detail}
- Suma de cuotas mensuales: ${formatCOP(totalMonthly)}
- Disponible del usuario: ${formatCOP(available)}
- Ratio: ${ratio.toFixed(0)}%${exceedsText}

Genera SOLO el insight en JSON con el campo "insight".`;
}
