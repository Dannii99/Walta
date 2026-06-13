"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Zap } from "lucide-react";

interface SimulatorQuickAccessProps {
  reducedMotion?: boolean;
}

export function SimulatorQuickAccess({ reducedMotion }: SimulatorQuickAccessProps) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#26be15] to-[#23ad1b] text-white shadow-md shadow-[#26be15]/20">
          <Calculator className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3 w-3 text-[#26be15]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#26be15]">
              Acceso rápido
            </span>
          </div>
          <h3 className="text-sm md:text-base font-bold text-[#17181c] dark:text-white leading-tight">
            Simula antes de comprometerte
          </h3>
          <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium leading-relaxed">
            Usa tu dinero disponible para saber si una compra es viable sin desbalancear tu presupuesto.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="bg-gradient-to-r from-[#17181c] to-[#333438] text-white hover:from-[#25262c] hover:to-[#3d3e43] w-full sm:w-auto h-11 px-5 text-sm font-semibold shadow-md"
      >
        <Link href="/simulations">
          Ir al simulador
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </Button>
    </motion.div>
  );
}
