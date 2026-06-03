"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight } from "lucide-react";

export function SimulatorQuickAccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
          <Calculator className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.2} />
        </div>
        <div className="space-y-0.5 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Acceso rápido
          </p>
          <h3 className="text-sm md:text-base font-bold text-stone-900 dark:text-stone-50 leading-tight">
            Simula antes de comprometerte
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium leading-relaxed">
            Usa tu dinero disponible para saber si una compra grande es viable sin desbalancear tu presupuesto.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 sm:w-auto w-full"
      >
        <Link href="/simulations">
          Ir al simulador
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </Button>
    </motion.div>
  );
}
