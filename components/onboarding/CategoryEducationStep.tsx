"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItemWithProvider,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const CATEGORY_ITEMS = [
  {
    id: "NEEDS",
    label: "Necesidades",
    subtitle: "Gastos esenciales y deudas",
    color: "#26be15",
    rgb: "38,190,21",
    examples: [
      "Arriendo / Hipoteca",
      "Mercado / Comida",
      "Transporte",
      "Servicios publicos",
      "Tarjeta de credito",
      "Prestamos",
      "Cuota vehicular",
    ],
    totalCats: 6,
  },
  {
    id: "WANTS",
    label: "Deseos",
    subtitle: "Lo que disfrutas",
    color: "#e7964d",
    rgb: "231,150,77",
    examples: [
      "Restaurantes / Cafe",
      "Streaming / Suscripciones",
      "Compras no esenciales",
      "Salidas / Entretenimiento",
    ],
    totalCats: 4,
  },
  {
    id: "SAVINGS",
    label: "Ahorros",
    subtitle: "Tu futuro financiero",
    color: "#617dd5",
    rgb: "97,125,213",
    examples: [
      "Fondo de emergencia",
      "Inversiones",
      "Metas (viaje, auto)",
      "Aportes pension",
    ],
    totalCats: 2,
  },
];

function NeedsSvg() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        cx="16" cy="18" r="12"
        stroke="#26be15" strokeWidth="1"
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0 }}
      />
      <motion.circle
        cx="16" cy="18" r="12"
        stroke="#26be15" strokeWidth="1"
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
      />
      <motion.path
        d="M6 18L16 8l10 10"
        stroke="#26be15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <path d="M8 16v10h6v-6h4v6h6V16" stroke="#26be15" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="14" y="10" width="4" height="4" rx="1" fill="#26be15" opacity="0.4" />
      <motion.path
        d="M16 8l10 10" stroke="white" strokeWidth="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}

function WantsSvg() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.rect
        x="4" y="12" width="24" height="10" rx="4"
        stroke="#e7964d" strokeWidth="1.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: "16px 17px" }}
      />
      <motion.circle
        cx="12" cy="17" r="3" fill="#e7964d" opacity="0.3"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="12" cy="15" r="1" fill="#e7964d" opacity="0.6" />
      <circle cx="12" cy="19" r="1" fill="#e7964d" opacity="0.6" />
      <circle cx="10" cy="17" r="1" fill="#e7964d" opacity="0.6" />
      <circle cx="14" cy="17" r="1" fill="#e7964d" opacity="0.6" />
      <motion.circle
        cx="20" cy="15" r="1.5" fill="#e7964d" opacity="0.2"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.circle
        cx="22" cy="17" r="1.5" fill="#e7964d" opacity="0.2"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.circle
        cx="20" cy="19" r="1.5" fill="#e7964d" opacity="0.2"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
      />
      <motion.circle
        cx="26" cy="9" r="1" fill="#e7964d"
        animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="29" cy="12" r="0.7" fill="#e7964d"
        animate={{ scale: [0, 1.2, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </svg>
  );
}

function SavingsSvg() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="16" cy="19" rx="10" ry="7" stroke="#617dd5" strokeWidth="1.5" />
        <circle cx="11" cy="16" r="1.5" fill="#617dd5" opacity="0.3" />
        <ellipse cx="16" cy="12" rx="3" ry="2" stroke="#617dd5" strokeWidth="1" />
        <path d="M12.5 12l-2-3" stroke="#617dd5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19.5 12l2-3" stroke="#617dd5" strokeWidth="1.5" strokeLinecap="round" />
        <motion.path
          d="M26 19c2-1 2-3 1-4"
          stroke="#617dd5" strokeWidth="1" strokeLinecap="round"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <rect x="15" y="13" width="2" height="1" rx="0.5" fill="#617dd5" opacity="0.5" />
      </motion.g>
      <motion.g
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 20, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
      >
        <circle cx="23" cy="10" r="3" fill="#617dd5" opacity="0.4" />
        <text x="22" y="12" fill="white" fontSize="4" textAnchor="middle">$</text>
      </motion.g>
    </svg>
  );
}

const SVG_ICONS = {
  NEEDS: NeedsSvg,
  WANTS: WantsSvg,
  SAVINGS: SavingsSvg,
} as const;

interface CategoryEducationStepProps {
  onContinue: () => void;
  isLoading?: boolean;
}

export function CategoryEducationStep({ onContinue, isLoading = false }: CategoryEducationStepProps) {
  const [openItem, setOpenItem] = useState("NEEDS");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-5"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-center space-y-1.5"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Tus categorias
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Walta organiza tus gastos en 3 grupos simples. Toca cada uno para ver ejemplos.
        </p>
      </motion.div>

      <Accordion
        type="single"
        collapsible
        value={openItem}
        onValueChange={(val) => setOpenItem(val as string)}
        className="w-full"
      >
        {CATEGORY_ITEMS.map((item, index) => {
          const SvgIcon = SVG_ICONS[item.id as keyof typeof SVG_ICONS];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + index * 0.1, ease: "easeOut" }}
            >
              <AccordionItemWithProvider
                value={item.id}
                className="mb-3 border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <AccordionTrigger
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    openItem === item.id
                      ? "shadow-inner"
                      : "hover:bg-muted/50"
                  )}
                  style={
                    openItem === item.id
                      ? { backgroundColor: `rgba(${item.rgb},0.06)`, borderColor: item.color }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: openItem === item.id ? `${item.color}15` : undefined,
                      }}
                    >
                      <SvgIcon />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-extrabold text-base tracking-tight"
                          style={{ color: item.color }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${item.color}15`,
                            color: item.color,
                          }}
                        >
                          {item.totalCats} cats
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: `rgba(${item.rgb},0.04)` }}
                  >
                    <ul className="space-y-2">
                      {item.examples.map((example, i) => (
                        <motion.li
                          key={example}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span
                            className="flex h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-foreground/80 font-medium">{example}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-[11px] text-muted-foreground font-medium">
                        <span className="font-semibold" style={{ color: item.color }}>
                          {item.totalCats}
                        </span>{" "}
                        categorias {item.id === "NEEDS" ? "(incluye deudas)" : ""}
                        {item.id === "NEEDS" ? "" : "disponibles"}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItemWithProvider>
            </motion.div>
          );
        })}
      </Accordion>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-2xl border border-muted bg-gradient-to-br from-muted/40 to-muted/20 p-5 text-center"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">12 categorias</span> predefinidas listas para usar.
          Cuando gustes, editalas y ponles limite en{" "}
          <span className="font-bold text-foreground">Reglas</span>.
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