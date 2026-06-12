"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptySimulationsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-8 md:p-12"
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#26be15]/20 to-[#617dd5]/20 dark:from-[#26be15]/10 dark:to-[#617dd5]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-[#617dd5]/20 to-[#26be15]/20 dark:from-[#617dd5]/10 dark:to-[#26be15]/10 blur-3xl" />

      <div className="relative space-y-5 max-w-lg">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#17181c] to-[#333438] text-white">
          <Calculator className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-tight">
            Simula antes de comprometerte
          </h2>
          <p className="text-sm md:text-[15px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
            ¿Estás pensando en un carro, una vivienda o un crédito personal?
            Evalúa el impacto en tu presupuesto antes de tomar la decisión.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          {[
            "Cálculo de cuota mensual en tiempo real",
            "Análisis de cuánto puedes comprometerte",
            "Recomendaciones inteligentes con IA",
            "Convierte simulaciones en seguimiento de crédito",
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[#17181c] dark:text-white">
              <div className="h-1.5 w-1.5 rounded-full bg-[#26be15]" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3">
          <Button
            asChild
            className="bg-[#26be15] hover:bg-[#23ad1b] text-white shadow-sm"
          >
            <Link href="/simulations/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Crear primera simulación
            </Link>
          </Button>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#617dd5] dark:text-[#617dd5]">
            <Sparkles className="h-3 w-3" />
            Con análisis IA
          </div>
        </div>
      </div>
    </motion.div>
  );
}
