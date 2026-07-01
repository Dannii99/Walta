"use client";

import { motion } from "framer-motion";
import { CategoryStack } from "./CategoryStack";

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
          Walta organiza tus gastos en 3 grupos.
        </p>
      </motion.div>

      <div className="flex justify-center mb-0">
        <CategoryStack />
      </div>

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
