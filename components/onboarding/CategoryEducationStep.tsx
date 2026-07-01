"use client";

import { motion } from "framer-motion";
import { CategoryStack } from "./CategoryStack";

export function CategoryEducationStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-center space-y-1.5"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Tus categorias
        </h2>
        <p className="text-[11px] sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Walta organiza tus gastos en 3 grupos.
        </p>
      </motion.div>

      <div className="flex justify-center pt-6">
        <CategoryStack />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-2xl border border-border/50 dark:border-white/10 bg-muted/50 dark:bg-white/5 p-4 text-center"
      >
        <p className="text-[11px] sm:text-sm leading-relaxed text-muted-foreground dark:text-white/60">
          <span className="font-bold text-foreground dark:text-white">12 categorias</span> predefinidas listas para usar.
          Cuando gustes, editalas y ponles limite en{" "}
          <span className="font-bold text-foreground dark:text-white">Reglas</span>.
        </p>
      </motion.div>
    </motion.div>
  );
}
