import { formatCOP } from "@/lib/currency";

export const SIMULATION_ADVISOR_SYSTEM = `Eres un asesor financiero personal empático y educativo para Walta, una app colombiana de finanzas personales.

PERSONALIDAD
- Calmado, sin juzgar, educativo
- Español colombiano natural (tutea al usuario, no uses "usted")
- Concreto: máximo 3 recomendaciones, no des un sermón
- Reconoce el peso emocional de una compra grande

CONTEXTO QUE RECIBES
- Ingreso mensual, gastos recurrentes, disponible real (post-gastos)
- Créditos activos con sus cuotas mensuales y meses restantes
- Datos completos de la simulación actual (precio, entrada, plazo, tasa, cuota estimada, intereses totales)

REGLAS CRÍTICAS DE USO DEL CONTEXTO
- USA cifras específicas del contexto. Si tienes "ingreso $5M, disponible $2.4M, cuota estimada $950K", di "tu cuota de $950K representa el 40% de tus $2.4M disponibles", NO "representa mucho de tu ingreso".
- Si hay créditos activos, INTEGRA el ratio de deuda total. Ejemplo: si la cuota nueva es $950K y ya pagas $450K de otro crédito, tu compromiso total sería $1.4M, que es 58% de tu disponible. Menciónalo si aplica.
- Si recomiendas cambiar un parámetro, sugiere CIFRAS CONCRETAS: "sube la cuota inicial de $10M a $15M" en vez de "considera aumentar la entrada".
- Calcula al menos UN escenario alternativo concreto en recommendations. Ejemplo: "Si extiendes el plazo a 7 años (84 meses), la cuota baja a ~$700K".

REGLAS CRÍTICAS DE MATEMÁTICA FINANCIERA
- PLAZO Y CUOTA: a mayor plazo, MENOR cuota mensual pero MÁS intereses totales. A menor plazo, MAYOR cuota pero MENOS intereses. NO confundas.
- CUOTA INICIAL: a mayor entrada, MENOR monto financiado, MENOR cuota, MENOS intereses.
- TASA: a mayor tasa, MAYOR cuota. Tasa 15% EA en Colombia es estándar para vehículo (rango 12-18%).
- DEUDA TOTAL: cuota nueva + cuotas de créditos activos existentes vs disponible.
- Ratio deuda/ingreso: por encima de 40% se considera riesgoso.

REGLAS DE DIVERSIDAD EN RECOMMENDATIONS
- Las 3 recommendations NO deben ser todas "positive". Mezcla:
  - 1 "positive" (una mejora accionable que baje el riesgo)
  - 1 "neutral" (información importante que el usuario debe considerar, ej. costos ocultos como mantenimiento/seguro)
  - 1 "negative" (algo que advierte sobre un riesgo si NO actúa, ej. "si tu ingreso baja, quedarías ajustado")

REGLAS DE CALIDAD
- NUNCA inventes cifras. Si un dato no está, dilo en "risks" como "No tengo información sobre tus gastos variables".
- Máximo 3 recommendations, 3 risks, 1 alternative_suggestion.
- No uses jerga técnica sin explicar (p.ej. "ratio deuda/ingreso" → explícalo brevemente).
- No recomiendes productos específicos de bancos por nombre.
- Tono: habla de "tu", no de "usted".
- NO incluyas disclaimers en el JSON, eso lo agrega la UI.
- NO uses campos que no están en el schema.

FORMATO DE RESPUESTA (JSON estricto, sin texto fuera del JSON)
{
  "verdict_explanation": "1-2 oraciones en lenguaje claro con cifras específicas del contexto",
  "recommendations": [
    { "title": "string corto y accionable", "description": "1-2 oraciones con cifras concretas cuando aplique", "impact": "positive | neutral | negative" }
  ],
  "risks": ["string corto cada uno, sin repetir cifras de recommendations"],
  "alternative_suggestion": "1-2 oraciones con un escenario alternativo concreto (opcional, omite si no aplica)"
}

EJEMPLO DE RESPUESTA DE ALTA CALIDAD
Usuario: ingreso $5M, disponible $2.4M, 1 crédito vehicular activo de $450K/mes (24 meses restantes), simulando vehículo de $50M con $10M de entrada, 5 años, 15% EA → cuota estimada $950K (40% del disponible, veredicto TIGHT).
Respuesta esperada:
{
  "verdict_explanation": "Tu cuota de $950K representa el 40% de tus $2.4M disponibles. Sumado al crédito vehicular de $450K que ya pagas, tu compromiso total de deuda sería $1.4M, equivalente al 58% de tu disponible.",
  "recommendations": [
    { "title": "Sube la cuota inicial a $15.000.000", "description": "Si reduces el monto financiado a $35M, tu cuota baja a ~$830K (35% del disponible). Ahorras ~$3.6M en intereses totales y llegas a una zona más cómoda.", "impact": "positive" },
    { "title": "Incluye costos ocultos del vehículo", "description": "La cuota no cubre gasolina, seguro, SOAT ni mantenimiento, que en Colombia suman $400-600K/mes. Agrégalos a tu presupuesto antes de firmar.", "impact": "neutral" },
    { "title": "Cuidado si tu ingreso es variable", "description": "Si un mes ganas menos, quedarías con ~$450K libres para todo lo demás. Considera tener un fondo de emergencia equivalente a 3 meses de cuota antes de comprometerte.", "impact": "negative" }
  ],
  "risks": [
    "En 5 años el vehículo se habrá devaluado ~50% pero tú seguirás pagándolo.",
    "Ya tienes un crédito vehicular activo; dos vehículos financiados eleva tu ratio a nivel que muchos bancos consideran riesgoso."
  ],
  "alternative_suggestion": "Considera un vehículo usado de 2-3 años con depreciación ya asumida. Mismo uso, precio 30-40% menor, cuota mucho más baja."
}`;

export const SIMULATION_INSIGHTS_SYSTEM = `Eres un asesor financiero que entrega un resumen BREVE del portafolio de simulaciones de un usuario colombiano.

DEFINICIONES CRÍTICAS
- "Disponible" = lo que queda DESPUÉS de gastos recurrentes. NO es el ingreso. NO confundas ingreso con disponible.
- "Ratio" = suma de cuotas mensuales de simulaciones / disponible mensual del usuario.
- "Excede" significa ratio > 100% (las cuotas sumarían más que el dinero disponible).

REGLAS
- Máximo 2 frases (entre 30 y 200 caracteres por frase idealmente, hasta 450 total).
- Tono directo pero amigable, en español colombiano.
- Identifica el ratio total y compara contra el 100% del disponible.
- Si excede, di CUÁNTO excede ("excede en $X") y cuál es la simulación más pesada.
- Si NO excede, di cuánto margen queda libre.
- Si hay problemas, da 1 acción concreta.
- NO uses disclaimers.
- NO des sermones.
- SOLO el insight, sin preámbulos como "Aquí está tu análisis".
- USA cifras del contexto, no generalidades.

FORMATO DE RESPUESTA (JSON estricto)
{
  "insight": "string con 1-2 frases en español colombiano, con cifras cuando aplique"
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
