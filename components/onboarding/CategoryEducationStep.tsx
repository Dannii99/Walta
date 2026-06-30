"use client";

import { motion } from "framer-motion";
import { Home, Gamepad2, PiggyBank, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_DATA = [
  {
    type: "NEEDS",
    label: "Necesidades",
    subtitle: "Lo esencial para vivir",
    icon: Home,
    color: "#26be15",
    bg: "bg-[#26be15]/10 dark:bg-[#26be15]/20",
    border: "border-[#26be15]/30",
    examples: ["Arriendo / Hipoteca", "Mercado / Comida", "Transporte", "Servicios públicos"],
  },
  {
    type: "WANTS",
    label: "Deseos",
    subtitle: "Lo que disfrutas",
    icon: Gamepad2,
    color: "#e7964d",
    bg: "bg-[#e7964d]/10 dark:bg-[#e7964d]/20",
    border: "border-[#e7964d]/30",
    examples: ["Restaurantes / Café", "Streaming / Suscripciones", "Compras no esenciales", "Salidas / Entretenimiento"],
  },
  {
    type: "SAVINGS",
    label: "Ahorros",
    subtitle: "Tu futuro",
    icon: PiggyBank,
    color: "#617dd5",
    bg: "bg-[#617dd5]/10 dark:bg-[#617dd5]/20",
    border: "border-[#617dd5]/30",
    examples: ["Fondo de emergencia", "Inversiones", "Metas (viaje, auto)", "Aportes pensión"],
  },
  {
    type: "DEBT",
    label: "Deudas",
    subtitle: "Lo que debes pagar",
    icon: CreditCard,
    color: "#9333ea",
    bg: "bg-[#9333ea]/10 dark:bg-[#9333ea]/20",
    border: "border-[#9333ea]/30",
    examples: ["Tarjeta de crédito", "Préstamo personal", "Cuota vehicular", "Créditos bancarios"],
  },
] as const;

interface CategoryEducationStepProps {
  onContinue: () => void;
  isLoading?: boolean;
}

export function CategoryEducationStep({ onContinue, isLoading = false }: CategoryEducationStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Tus categorías
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Walta organiza tus gastos en 4 grupos. Cada gasto que registres irá a uno de estos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TYPE_DATA.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.article
              key={item.type}
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay: index * 0.08, ease: "easeOut" } }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={cn(
                "relative group p-5 sm:p-6 rounded-2xl border transition-all duration-300",
                item.bg,
                item.border,
                "hover:border-[currentColor] hover:shadow-lg"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    item.bg,
                  )}
                >
                  <Icon className="h-6 w-6" style={{ color: item.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-lg" style={{ color: item.color }}>
                    {item.label}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {item.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground/80">
                        <span
                          className="flex h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-xl bg-muted/50 p-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">12 categorías</span> predefinidas listas para usar.
          Podrás editarlas y ponerles límite cuando quieras en{" "}
          <span className="font-semibold text-foreground">Reglas</span>.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        disabled={isLoading}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creando tu presupuesto...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            Continuar al dashboard
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
