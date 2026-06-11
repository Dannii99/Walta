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
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 p-8 md:p-12 shadow-xl ring-1 ring-black/5 dark:ring-white/5"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-3xl" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-500/15 blur-2xl" />

      <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/30 ring-4 ring-white/40 dark:ring-stone-900/40">
          <Wallet className="h-10 w-10" strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Empieza en 1 minuto
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 dark:from-gray-100 dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            Aún no hay movimientos
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-medium leading-relaxed max-w-lg mx-auto">
            Agrega tu primer gasto para ver tu salud financiera, el desglose por categoría y recomendaciones personalizadas.
          </p>
        </div>

        <Button
          onClick={() => setOpenAddModal(true)}
          size="lg"
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/20"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar tu primer gasto
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 w-full">
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-stone-900/60 backdrop-blur p-3 border border-[#E8E5E0]/80 dark:border-stone-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-sm">
              <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground/90 dark:text-stone-100">Salud 50/30/20</p>
              <p className="text-[11px] text-muted-foreground dark:text-stone-400 leading-snug">
                Visualiza tu regla al instante
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-stone-900/60 backdrop-blur p-3 border border-[#E8E5E0]/80 dark:border-stone-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-sm">
              <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground/90 dark:text-stone-100">Distribución clara</p>
              <p className="text-[11px] text-muted-foreground dark:text-stone-400 leading-snug">
                Sabe a dónde va tu dinero
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-white/60 dark:bg-stone-900/60 backdrop-blur p-3 border border-[#E8E5E0]/80 dark:border-stone-800">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground/90 dark:text-stone-100">Recomendaciones</p>
              <p className="text-[11px] text-muted-foreground dark:text-stone-400 leading-snug">
                Tips para mejorar tu mes
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
