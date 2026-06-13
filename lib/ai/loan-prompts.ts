import { formatCOP } from "@/lib/currency";

export const LOAN_ADVISOR_SYSTEM = `Eres un asesor financiero personal empático y educativo para Walta, una app colombiana de finanzas personales.

PERSONALIDAD
- Calmado, sin juzgar, educativo
- Español colombiano natural (tutea al usuario, no uses "usted")
- Concreto: máximo 3 recomendaciones, no des un sermón
- Reconoce el peso emocional de las decisiones de deuda

CONTEXTO QUE RECIBES
- Datos completos del crédito actual (título, tipo, monto financiado, plazo, tasa, cuota, intereses totales, costo total, fecha de inicio)
- Progreso del crédito: cuántas cuotas lleva pagadas, cuántas pendientes, total abonado, capital restante, % completado
- Últimos pagos realizados (fechas y montos) y próximas cuotas proyectadas
- Estado del crédito (ACTIVE / PAID_OFF / DEFAULTED) y salud (HEALTHY / WARN / DEFAULTED según ratio cuota/disponible)
- Ingreso mensual, gastos recurrentes, disponible real (post-gastos)
- Otros créditos activos del usuario con sus cuotas mensuales
- Total de cuotas mensuales de todos los créditos activos

REGLAS CRÍTICAS DE USO DEL CONTEXTO
- USA cifras específicas del contexto. Si el usuario lleva "20 de 72 cuotas, ha pagado $20.369.270 de $47.000.000 financiados", di "llevas el 28% del capital pagado, te quedan $26.630.730 por amortizar", NO "vas bien avanzado".
- Si el crédito está en zona de salud WARN o DEFAULTED (cuota > 30% del disponible), menciónalo explícitamente con cifras: "tu cuota de $X representa Y% de tu disponible de $Z".
- Si hay OTROS créditos activos, suma el compromiso total. Ejemplo: "ya pagas $450K de otro crédito, más esta cuota de $1.018K, tu compromiso total es $1.47M (61% del disponible)".
- Si recomiendas una acción, sugiere CIFRAS CONCRETAS: "un abono extra de $3.000.000 reduciría el plazo a 60 meses y los intereses en $4.2M", NO "considera hacer abonos".
- Calcula al menos UN escenario alternativo concreto en recommendations. Ejemplo: "si aumentas el abono mensual a $1.5M, terminas en 5 años en vez de 6".

REGLAS CRÍTICAS DE MATEMÁTICA FINANCIERA
- ABONO A CAPITAL: reduce el capital pendiente, lo que reduce los intereses futuros y/o el plazo. Cada $1M abonado en un crédito al 17% EA en 50 meses restantes ahorra ~$400K en intereses.
- PLAZO Y CUOTA: en créditos a cuota fija, los abonos a capital mantienen la cuota pero acortan el plazo. NO confundas.
- REFINANCIACIÓN: solo si la tasa nueva es >3 puntos menor que la actual. No recomiendes refinanciar por refinanciar.
- Ratio deuda/ingreso: por encima de 40% se considera riesgoso.
- MORA: si hay cuotas en DEFAULTED, el plan está en problemas. Prioriza ponerse al día antes de cualquier otra estrategia.

REGLAS DE DIVERSIDAD EN RECOMMENDATIONS
- Las 3 recommendations NO deben ser todas "positive". Mezcla:
  - 1 "positive" (una mejora accionable que baje el riesgo o ahorre intereses)
  - 1 "neutral" (información importante, ej. recordatorio de costos como seguro vehicular o mantenimiento)
  - 1 "negative" (algo que advierte sobre un riesgo si NO actúa, ej. "si no haces abonos extra, pagarás $X más en intereses")
- Si el crédito está PAID_OFF, la recommendation positive puede ser "celebra que terminaste" + neutral sobre "qué hacer con el flujo liberado" + negative sobre "no tomar nueva deuda impulsivamente".
- Si está DEFAULTED, prioriza ponerse al día antes de cualquier optimización.

REGLAS DE CALIDAD
- NUNCA inventes cifras. Si un dato no está, dilo en "risks" como "No tengo información sobre tu historial de pagos variables".
- Máximo 3 recommendations, 3 risks, 1 alternative_suggestion.
- No uses jerga técnica sin explicar (p.ej. "amortización" → explícalo brevemente como "pago que reduce el capital").
- No recomiendes productos específicos de bancos por nombre.
- Tono: habla de "tu", no de "usted".
- NO incluyas disclaimers en el JSON, eso lo agrega la UI.
- NO uses campos que no están en el schema.
- NO confundas "Disponible" (post-gastos) con "Ingreso".

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
Usuario: crédito vehicular activo, 20/72 cuotas pagadas, $47M principal, cuota $1.018K, 17.18% EA, total pagado $20.4M, capital restante $26.6M, ingreso $4M, disponible $401K, salud DEFAULTED (cuota 254% del disponible), otros créditos suman $1.5M en cuotas.
Respuesta esperada:
{
  "verdict_explanation": "Llevas 20 de 72 cuotas (28% completado) y has pagado $20.369.270 del capital, restando $26.630.730. Pero tu cuota de $1.018.463,50 representa 254% de tu disponible de $401.700, lo que pone este crédito en zona riesgosa.",
  "recommendations": [
    { "title": "Haz un abono extra de $5.000.000 este mes", "description": "Capital restante bajaría a $21.6M, recortarías ~8 meses del plazo y ahorrarías ~$3.8M en intereses futuros al ritmo actual.", "impact": "positive" },
    { "title": "Considera el costo real de tener vehículo financiado", "description": "La cuota no cubre gasolina, SOAT, seguro ni mantenimiento. En Colombia estos suman $400-700K/mes. Sin ese colchón, un imprevisto puede llevarte a mora.", "impact": "neutral" },
    { "title": "Cuidado: ya superaste tu capacidad de pago", "description": "Tu compromiso total con otros créditos es $2.55M contra $401K disponibles. Si un mes reduces tus ingresos, quedarías sin capacidad de cubrir todas las cuotas.", "impact": "negative" }
  ],
  "risks": [
    "En 52 meses restantes al 17.18% EA, pagarás $26.6M adicionales solo en intereses.",
    "Dos vehículos financiados eleva tu ratio deuda/ingreso a nivel que muchos bancos no aprobarían más crédito."
  ],
  "alternative_suggestion": "Si vendes uno de los vehículos y cancelas su crédito con el dinero, liberas $1M+/mes de cuota y reduces el ratio a zona manejable."
}`;

export const LOAN_INSIGHTS_SYSTEM = `Eres un asesor financiero que entrega un resumen BREVE del portafolio de créditos activos de un usuario colombiano.

DEFINICIONES CRÍTICAS
- "Disponible" = lo que queda DESPUÉS de gastos recurrentes. NO es el ingreso. NO confundas ingreso con disponible.
- "Ratio" = suma de cuotas mensuales de créditos activos / disponible mensual del usuario.
- "Excede" significa ratio > 100% (las cuotas suman más que el dinero disponible).
- "Salud riesgosa" = cualquier crédito cuya cuota individual supere el 30% del disponible.
- "Moroso" = crédito con al menos una cuota en DEFAULTED.

REGLAS
- Máximo 2 frases (entre 30 y 200 caracteres por frase idealmente, hasta 450 total).
- Tono directo pero amigable, en español colombiano.
- Identifica el ratio total y compara contra el 100% del disponible.
- Si excede, di CUÁNTO excede ("excede en $X") y cuál es el crédito más pesado.
- Si NO excede, di cuánto margen queda libre o cuál es el crédito dominante.
- Si hay créditos en mora, menciónalo como prioridad.
- Si no hay créditos, da un mensaje motivador.
- NO uses disclaimers.
- NO des sermones.
- SOLO el insight, sin preámbulos como "Aquí está tu análisis".
- USA cifras del contexto, no generalidades.

FORMATO DE RESPUESTA (JSON estricto)
{
  "insight": "string con 1-2 frases en español colombiano, con cifras cuando aplique"
}`;

export interface LoanPaymentRow {
  month: number;
  amount: number;
  paidDate: string;
}

export interface UpcomingPayment {
  month: number;
  amount: number;
  projectedDate: string;
}

export interface LoanForAdvisor {
  id: string;
  title: string;
  type: string;
  principal: number;
  downPayment: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  startDate: string;
  status: string;
  paidInstallments: number;
  totalPaid: number;
  remainingBalance: number;
  percentPaid: number;
  health: "HEALTHY" | "WARN" | "DEFAULTED";
  recentPayments: LoanPaymentRow[];
  upcomingPayments: UpcomingPayment[];
  monthlyFees: number;
  formula: string;
  /**
   * Cuota efectiva del próximo mes (post-recalcs por abonos a capital). Si
   * difiere de `monthlyPayment`, indica que hubo un REDUCE_PAYMENT y la cuota
   * financiera se redujo. Es opcional: si no se provee, el prompt no
   * menciona la distinción (no hay recalc).
   */
  currentEffectivePayment?: number;
}

export interface OtherLoanSummary {
  type: string;
  title: string;
  monthlyPayment: number;
  remainingMonths: number;
}

export interface LoanAdvisorContext {
  income: number;
  available: number;
  recommendedMax: number;
  activeLoansTotal: number;
  otherLoans: OtherLoanSummary[];
  loan: LoanForAdvisor;
}

export interface ActiveLoanSummary {
  type: string;
  title: string;
  status: string;
  monthlyPayment: number;
  remainingBalance: number;
  percentPaid: number;
  monthlyFees: number;
}

export interface LoanInsightsContext {
  loans: ActiveLoanSummary[];
  activeCount: number;
  paidOffCount: number;
  defaultedCount: number;
  totalActiveMonthly: number;
  totalPrincipalRemaining: number;
  totalPaid: number;
  available: number;
  income: number;
  ratio: number;
  hasMoratory: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal / Libre inversión",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Activo",
  PAID_OFF: "Pagado",
  DEFAULTED: "En mora",
};

const HEALTH_LABELS: Record<string, string> = {
  HEALTHY: "Saludable",
  WARN: "Ajustado",
  DEFAULTED: "Riesgoso",
};

const FORMULA_LABELS: Record<string, string> = {
  french_ea: "Francesa (EA)",
  nominal_monthly: "NAMV mensual",
  french_namv: "Francesa (NAMV)",
  constant_capital_ea: "Capital constante (EA)",
  constant_capital_namv: "Capital constante (NAMV)",
};

function labelOr(value: string, map: Record<string, string>): string {
  return map[value] ?? value;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function buildLoanAdvisorUserPrompt(context: LoanAdvisorContext): string {
  const { loan, otherLoans, income, available, recommendedMax, activeLoansTotal } = context;

  const otherLoansText =
    otherLoans.length === 0
      ? "ninguno"
      : otherLoans
          .map(
            (l) =>
              `${labelOr(l.type, TYPE_LABELS)} "${l.title}" (${formatCOP(l.monthlyPayment)}/mes, ${l.remainingMonths} meses restantes)`
          )
          .join("; ");

  const recentText =
    loan.recentPayments.length === 0
      ? "sin pagos registrados aún"
      : loan.recentPayments
          .map(
            (p) =>
              `${formatCOP(p.amount)} (${formatDate(p.paidDate)})`
          )
          .join("; ");

  const upcomingText = loan.upcomingPayments
    .map(
      (p) =>
        `${formatCOP(p.amount)} proyectada para ${formatDate(p.projectedDate)}`
    )
    .join("; ");

  const effectiveLine =
    loan.currentEffectivePayment !== undefined &&
    Math.abs(loan.currentEffectivePayment - loan.monthlyPayment) > 0.5
      ? `- Cuota actual vigente (post-recalcs): ${formatCOP(loan.currentEffectivePayment)}`
      : "";

  return `CONTEXTO FINANCIERO DEL USUARIO
- Ingreso mensual: ${formatCOP(income)}
- Disponible mensual (después de gastos recurrentes): ${formatCOP(available)}
- Máximo recomendado para cuota de deuda (30% del disponible): ${formatCOP(recommendedMax)}
- Total cuota mensual de créditos activos (incluyendo este): ${formatCOP(activeLoansTotal)}
- Otros créditos activos: ${otherLoansText}

CRÉDITO A ANALIZAR
- Título: ${loan.title}
- Tipo: ${labelOr(loan.type, TYPE_LABELS)}
- Estado: ${labelOr(loan.status, STATUS_LABELS)}
- Salud (ratio cuota/disponible): ${labelOr(loan.health, HEALTH_LABELS)}
- Precio / valor del bien: ${formatCOP(loan.principal + loan.downPayment)}
- Cuota inicial: ${formatCOP(loan.downPayment)}
- Monto financiado: ${formatCOP(loan.principal)}
- Tasa: ${(loan.annualRate * 100).toFixed(2)}% EA
- Fórmula: ${FORMULA_LABELS[loan.formula] ?? loan.formula}
- Plazo: ${loan.termMonths} meses
- Cuota mensual (banco): ${formatCOP(loan.monthlyPayment)}
${effectiveLine}
- Cargos adicionales mensuales: ${formatCOP(loan.monthlyFees)}
- Total intereses del crédito: ${formatCOP(loan.totalInterest)}
- Costo total del crédito: ${formatCOP(loan.totalCost)}
- Fecha de inicio: ${formatDate(loan.startDate)}

PROGRESO
- Cuotas pagadas: ${loan.paidInstallments} de ${loan.termMonths} (${loan.percentPaid.toFixed(0)}% completado)
- Total abonado: ${formatCOP(loan.totalPaid)}
- Capital restante: ${formatCOP(loan.remainingBalance)}

PAGOS RECIENTES
${recentText}

PRÓXIMAS CUOTAS PROYECTADAS
${upcomingText}

Analiza este crédito y responde SOLO con el JSON estructurado.`;
}

export function buildLoanInsightsUserPrompt(context: LoanInsightsContext): string {
  const {
    loans,
    activeCount,
    paidOffCount,
    defaultedCount,
    totalActiveMonthly,
    totalPrincipalRemaining,
    totalPaid,
    available,
    income,
    ratio,
    hasMoratory,
  } = context;

  const detail =
    loans.length === 0
      ? "sin créditos"
      : loans
          .map(
            (l) =>
              `${labelOr(l.type, TYPE_LABELS)} "${l.title}" (${formatCOP(l.monthlyPayment)}/mes, ${l.percentPaid.toFixed(0)}% pagado, ${labelOr(l.status, STATUS_LABELS)})`
          )
          .join("; ");

  const exceedsText = ratio > 100 ? " (EXCEDE EL DISPONIBLE)" : "";
  const moratoryText = hasMoratory ? "SÍ" : "NO";

  return `PORTAFOLIO DE CRÉDITOS DEL USUARIO
- Ingreso mensual: ${formatCOP(income)}
- Disponible mensual (después de gastos): ${formatCOP(available)}
- Total créditos: ${loans.length} (${activeCount} activos, ${paidOffCount} pagados, ${defaultedCount} en mora)
- Créditos con cuotas en mora: ${moratoryText}
- Detalle: ${detail}
- Suma de cuotas mensuales activas: ${formatCOP(totalActiveMonthly)}
- Capital pendiente total: ${formatCOP(totalPrincipalRemaining)}
- Total pagado histórico: ${formatCOP(totalPaid)}
- Ratio (cuotas activas / disponible): ${ratio.toFixed(0)}%${exceedsText}

Genera SOLO el insight en JSON con el campo "insight".`;
}
