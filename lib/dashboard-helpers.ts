import type { CategoryType } from "@/types";

export type HealthStatus = "healthy" | "warning" | "critical" | "deficit";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function formatMonthName(date: Date = new Date()): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatRuleName(rule: { needs: number; wants: number; savings: number } | null): string {
  if (!rule) return "50/30/20";
  return `${rule.needs}/${rule.wants}/${rule.savings}`;
}

export function computeHealthStatus(
  income: number,
  expenses: number,
  available: number
): HealthStatus {
  if (income <= 0) return "deficit";
  if (available < 0) return "deficit";
  const pct = (expenses / income) * 100;
  if (pct > 100) return "deficit";
  if (pct > 90) return "critical";
  if (pct > 80) return "warning";
  return "healthy";
}

export function getDynamicMessage(
  status: HealthStatus,
  available: number,
  expensesPct: number
): string {
  switch (status) {
    case "healthy":
      return "Vas bien. Tienes margen para decidir con calma este mes.";
    case "warning":
      return `Estás cerca del límite. Llevas ${expensesPct}% de tus ingresos.`;
    case "critical":
      return "Cuidado. Tus gastos están presionando tu presupuesto.";
    case "deficit":
      if (available < 0) {
        return "Estás en déficit este mes. Revisa los gastos no esenciales.";
      }
      return "Aún no registras ingresos. Agrega tu salario para empezar.";
  }
}

export interface HealthBadgeInfo {
  label: string;
  shortLabel: string;
  gradient: string;
  text: string;
  bg: string;
  border: string;
  ring: string;
}

export function getHealthBadge(status: HealthStatus): HealthBadgeInfo {
  switch (status) {
    case "healthy":
      return {
        label: "Saludable",
        shortLabel: "OK",
        gradient: "from-emerald-500 to-teal-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        ring: "ring-emerald-500/30",
      };
    case "warning":
      return {
        label: "Ajustado",
        shortLabel: "Atención",
        gradient: "from-amber-500 to-orange-500",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        ring: "ring-amber-500/30",
      };
    case "critical":
      return {
        label: "Riesgoso",
        shortLabel: "Crítico",
        gradient: "from-orange-500 to-rose-500",
        text: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
        ring: "ring-orange-500/30",
      };
    case "deficit":
      return {
        label: "Déficit",
        shortLabel: "Déficit",
        gradient: "from-rose-600 to-red-600",
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
        ring: "ring-rose-500/30",
      };
  }
}

export function getHeroGradient(status: HealthStatus): {
  card: string;
  blobA: string;
  blobB: string;
  numberGradient: string;
} {
  switch (status) {
    case "healthy":
      return {
        card: "from-emerald-50 via-teal-50 to-cyan-50",
        blobA: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
        blobB: "from-lime-500/10 to-emerald-500/10",
        numberGradient: "from-emerald-700 via-teal-700 to-cyan-700",
      };
    case "warning":
      return {
        card: "from-amber-50 via-orange-50 to-yellow-50",
        blobA: "from-amber-500/20 via-orange-500/20 to-yellow-500/20",
        blobB: "from-orange-500/10 to-rose-500/10",
        numberGradient: "from-amber-700 via-orange-700 to-yellow-700",
      };
    case "critical":
      return {
        card: "from-orange-50 via-rose-50 to-pink-50",
        blobA: "from-orange-500/20 via-rose-500/20 to-pink-500/20",
        blobB: "from-rose-500/10 to-red-500/10",
        numberGradient: "from-orange-700 via-rose-700 to-pink-700",
      };
    case "deficit":
      return {
        card: "from-rose-100 via-red-50 to-rose-50",
        blobA: "from-rose-500/25 via-red-500/20 to-rose-600/20",
        blobB: "from-red-500/15 to-rose-500/15",
        numberGradient: "from-rose-700 via-red-700 to-rose-800",
      };
  }
}

export function getRecommendation(
  needsPct: number,
  wantsPct: number,
  savingsPct: number,
  needsSpent: number,
  wantsSpent: number,
  savingsRate: number
): string {
  const needsOver = needsSpent > needsPct;
  const wantsOver = wantsSpent > wantsPct;
  const savingsOver = savingsRate < savingsPct;

  if (wantsOver && !needsOver) {
    return "Estás gastando más de lo recomendado en deseos. Podrías mover una parte a ahorro o necesidades.";
  }
  if (needsOver && !wantsOver) {
    return "Tus necesidades superan el límite. Revisa si hay gastos fijos que puedas renegociar.";
  }
  if (savingsOver) {
    if (savingsRate < 10) {
      return "Tu capacidad de ahorro es muy baja. Prioriza reservar este mes.";
    }
    return "Casi llegas a tu meta de ahorro. Un pequeño ajuste y lo logras.";
  }
  if (needsOver && wantsOver) {
    return "Varios rubros están por encima de su límite. Haz una pausa y revisa prioridades.";
  }
  if (savingsRate >= 60) {
    return "Eres un ahorrador agresivo. No descuides tu calidad de vida.";
  }
  return "Tu distribución está dentro de los rangos recomendados. Buen trabajo.";
}

export interface CategoryIconEntry {
  keywords: string[];
  iconName: string;
}

export const CATEGORY_ICON_MAP: CategoryIconEntry[] = [
  { keywords: ["arriendo", "alquiler", "renta"], iconName: "Home" },
  { keywords: ["administración", "admin"], iconName: "Building" },
  { keywords: ["mercado", "supermercado"], iconName: "ShoppingCart" },
  { keywords: ["restaurante", "comida", "hogar"], iconName: "UtensilsCrossed" },
  { keywords: ["energía", "luz", "electricidad"], iconName: "Zap" },
  { keywords: ["agua"], iconName: "Droplet" },
  { keywords: ["gas"], iconName: "Flame" },
  { keywords: ["internet", "teléfono", "telefono", "celular"], iconName: "Wifi" },
  { keywords: ["transporte", "metro", "bus"], iconName: "Bus" },
  { keywords: ["gasolina", "combustible"], iconName: "Fuel" },
  { keywords: ["salud", "medicina", "medicinas", "farmacia"], iconName: "HeartPulse" },
  { keywords: ["seguro"], iconName: "Shield" },
  { keywords: ["crédito", "credito", "préstamo", "prestamo"], iconName: "CreditCard" },
  { keywords: ["banco", "bancario", "comisión", "comision"], iconName: "Landline" },
  { keywords: ["ocio", "entretenimiento", "cine", "teatro"], iconName: "Tv" },
  { keywords: ["café", "cafe", "snack"], iconName: "Coffee" },
  { keywords: ["ropa", "vestimenta", "zapatos"], iconName: "Shirt" },
  { keywords: ["compra", "personal"], iconName: "ShoppingBag" },
  { keywords: ["hobbie", "deporte", "gimnasio", "gym"], iconName: "Dumbbell" },
  { keywords: ["suscripc", "netflix", "spotify"], iconName: "Repeat" },
  { keywords: ["viaje", "turismo", "vacacion"], iconName: "Plane" },
  { keywords: ["tecnología", "tecnologia", "electrónico"], iconName: "Smartphone" },
  { keywords: ["emergencia", "fondo"], iconName: "PiggyBank" },
  { keywords: ["invers"], iconName: "TrendingUp" },
  { keywords: ["pension", "pensión", "aporte"], iconName: "Briefcase" },
  { keywords: ["otro", "otros"], iconName: "Tag" },
];

export function getCategoryIconName(categoryName: string): string {
  const lower = categoryName.toLowerCase();
  for (const entry of CATEGORY_ICON_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.iconName;
    }
  }
  return "Tag";
}

export const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};
