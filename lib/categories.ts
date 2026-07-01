import type { CategoryType } from "@/types";

export interface PredefinedCategory {
  name: string;
  type: CategoryType;
  icon: string;
  description: string;
}

export const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  { name: "Hogar", type: "NEEDS", icon: "Home", description: "Arriendo, administración, servicios (agua, gas, luz)" },
  { name: "Alimentación", type: "NEEDS", icon: "UtensilsCrossed", description: "Mercado, supermercado, comida del hogar" },
  { name: "Transporte", type: "NEEDS", icon: "Car", description: "Gasolina, transporte público, parqueo" },
  { name: "Salud", type: "NEEDS", icon: "HeartPulse", description: "Medicinas, consultas, seguros médicos" },
  { name: "Servicios", type: "NEEDS", icon: "Wifi", description: "Internet, teléfono, TV, streaming" },
  { name: "Deudas", type: "NEEDS", icon: "CreditCard", description: "Préstamos, créditos, gastos bancarios" },
  { name: "Ocio", type: "WANTS", icon: "Utensils", description: "Restaurantes, café, salir, snacks" },
  { name: "Compras", type: "WANTS", icon: "ShoppingBag", description: "Ropa, tecnología, compras personales" },
  { name: "Entretenimiento", type: "WANTS", icon: "Film", description: "Hobbies, suscripciones, juegos" },
  { name: "Viajes", type: "WANTS", icon: "Plane", description: "Viajes, escapadas, turismo" },
  { name: "Ahorro", type: "SAVINGS", icon: "PiggyBank", description: "Fondo de emergencia, metas" },
  { name: "Inversiones", type: "SAVINGS", icon: "TrendingUp", description: "Inversiones, aportes, pensiones" },
];

export const OTHER_CATEGORY_KEY = "__other__";

export const CATEGORY_MAP: Record<string, string> = {
  "Vivienda/Arriendo": "Hogar",
  "Arriendo": "Hogar",
  "Administración": "Hogar",
  "Energía eléctrica": "Hogar",
  "Agua": "Hogar",
  "Gas": "Hogar",
  "Mercado/Supermercado": "Alimentación",
  "Restaurantes (hogar)": "Alimentación",
  "Transporte público": "Transporte",
  "Gasolina": "Transporte",
  "Salud/Medicinas": "Salud",
  "Seguros": "Salud",
  "Internet/Teléfono": "Servicios",
  "Créditos / Préstamos": "Deudas",
  "Gastos bancarios": "Deudas",
  "Restaurantes (salir)": "Ocio",
  "Café/Snacks": "Ocio",
  "Ropa": "Compras",
  "Compras personales": "Compras",
  "Tecnología": "Compras",
  "Ocio/Entretenimiento": "Entretenimiento",
  "Hobbies": "Entretenimiento",
  "Suscripciones": "Entretenimiento",
  "Viajes": "Viajes",
  "Fondo de emergencia": "Ahorro",
  "Ahorro de emergencia": "Ahorro",
  "Otros": "Ahorro",
  "Inversiones": "Inversiones",
  "Aportes/Pensiones": "Inversiones",
  "Aportes / Pensiones": "Inversiones",
};