"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";

export function SimulatorQuickAccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5 md:p-6 shadow-lg ring-1 ring-indigo-500/10"
    >
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-3xl" />
      <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-2xl" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <Calculator className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Acceso rápido
              </p>
            </div>
            <h3 className="text-base md:text-lg font-extrabold tracking-tight text-foreground/90">
              Simula antes de comprometerte
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
              Usa tu dinero disponible para saber si una compra grande es viable sin desbalancear tu presupuesto.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-md shadow-purple-500/30 sm:w-auto w-full"
        >
          <Link href="/simulations">
            Ir al simulador
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
