import type { CategoryType } from "@/types";

export interface PredefinedCategory {
  name: string;
  type: CategoryType;
}

export const PREDEFINED_CATEGORIES: PredefinedCategory[] = [
  { name: "Arriendo", type: "NEEDS" },
  { name: "Administración", type: "NEEDS" },
  { name: "Mercado/Supermercado", type: "NEEDS" },
  { name: "Restaurantes (hogar)", type: "NEEDS" },
  { name: "Energía eléctrica", type: "NEEDS" },
  { name: "Agua", type: "NEEDS" },
  { name: "Gas", type: "NEEDS" },
  { name: "Internet/Teléfono", type: "NEEDS" },
  { name: "Transporte público", type: "NEEDS" },
  { name: "Gasolina", type: "NEEDS" },
  { name: "Salud/Medicinas", type: "NEEDS" },
  { name: "Seguros", type: "NEEDS" },
  { name: "Créditos / Préstamos", type: "NEEDS" },
  { name: "Gastos bancarios", type: "NEEDS" },
  { name: "Ocio/Entretenimiento", type: "WANTS" },
  { name: "Restaurantes (salir)", type: "WANTS" },
  { name: "Café/Snacks", type: "WANTS" },
  { name: "Ropa", type: "WANTS" },
  { name: "Compras personales", type: "WANTS" },
  { name: "Hobbies", type: "WANTS" },
  { name: "Suscripciones", type: "WANTS" },
  { name: "Viajes", type: "WANTS" },
  { name: "Tecnología", type: "WANTS" },
  { name: "Fondo de emergencia", type: "SAVINGS" },
  { name: "Inversiones", type: "SAVINGS" },
  { name: "Aportes/Pensiones", type: "SAVINGS" },
  { name: "Otros", type: "SAVINGS" },
];

export const OTHER_CATEGORY_KEY = "__other__";
