"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { Plus, Sparkles, Wallet, BarChart3, ShieldCheck } from "lucide-react";

export function DashboardEmptyState() {
  const { setOpenAddModal } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f0fdf4] via-[#fafafa] to-[#f5f5f5] dark:from-[#1a1a1e] dark:via-[#17181c] dark:to-[#0c0d10] p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-[#26be15]/10 dark:ring-white/5"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-[#26be15]/20 via-[#23ad1b]/15 to-[#617dd5]/10 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gradient-to-br from-[#e7964d]/10 to-[#e54d4d]/10 blur-2xl" />

      <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#26be15] to-[#23ad1b] text-white shadow-xl shadow-[#26be15]/30 ring-4 ring-white/40 dark:ring-[#17181c]/40">
          <Wallet className="h-10 w-10" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#26be15]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#26be15]">
              Empieza en 1 minuto
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
            Aún no hay movimientos
          </h2>
          <p className="text-sm md:text-base text-[#737373] dark:text-[#a1a1aa] font-medium leading-relaxed max-w-lg mx-auto">
            Agrega tu primer gasto para ver tu salud financiera, el desglose por categoría y recomendaciones personalizadas.
          </p>
        </div>

        <Button
          onClick={() => setOpenAddModal(true)}
          size="lg"
          className="bg-gradient-to-r from-[#17181c] to-[#333438] hover:from-[#25262c] hover:to-[#3d3e43] text-white shadow-lg ring-1 ring-black/10"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar tu primer gasto
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 w-full">
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-[#17181c]/60 backdrop-blur p-3 border border-[#e8e8e8]/80 dark:border-[#26272b]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#23ad1b] to-[#26be15] text-white shadow-sm">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#17181c] dark:text-white">Salud 50/30/20</p>
              <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
                Visualiza tu regla al instante
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-[#17181c]/60 backdrop-blur p-3 border border-[#e8e8e8]/80 dark:border-[#26272b]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#617dd5] to-[#26be15] text-white shadow-sm">
              <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#17181c] dark:text-white">Distribución clara</p>
              <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
                Sabe a dónde va tu dinero
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-[#17181c]/60 backdrop-blur p-3 border border-[#e8e8e8]/80 dark:border-[#26272b]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#e7964d] to-[#e54d4d] text-white shadow-sm">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#17181c] dark:text-white">Recomendaciones</p>
              <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
                Tips para mejorar tu mes
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
