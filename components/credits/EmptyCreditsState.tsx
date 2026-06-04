"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, FilePlus, ClipboardPlus, Shield, TrendingDown, CalendarCheck } from "lucide-react";

export function EmptyCreditsState() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/20 dark:bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative p-8 md:p-12 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg"
        >
          <Wallet className="h-8 w-8" strokeWidth={2.2} />
        </motion.div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Módulo de créditos
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
            Aún no tienes créditos registrados
          </h2>
          <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Empieza a controlar tus préstamos con seguimiento automático, abonos a capital y progreso visual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-2">
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 p-4 space-y-1.5">
            <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs font-bold text-stone-900 dark:text-stone-50">
              Sin sobreendeudamiento
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Visualiza el impacto de cada crédito en tu presupuesto.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 p-4 space-y-1.5">
            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-bold text-stone-900 dark:text-stone-50">
              Reduce intereses
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Simula abonos a capital y ve el ahorro en tiempo real.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 p-4 space-y-1.5">
            <CalendarCheck className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            <p className="text-xs font-bold text-stone-900 dark:text-stone-50">
              Calendario claro
            </p>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
              Cronograma de amortización con fechas y saldos.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/credits/new?mode=new"
            className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold rounded-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            Crear nuevo crédito
          </Link>
          <Link
            href="/credits/new?mode=ongoing"
            className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-50 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            <ClipboardPlus className="h-4 w-4" />
            Agregar existente
          </Link>
        </div>
      </div>
    </div>
  );
}
