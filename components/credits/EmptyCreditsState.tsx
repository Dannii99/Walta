"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, FilePlus, ClipboardPlus, Shield, TrendingDown, CalendarCheck } from "lucide-react";

export function EmptyCreditsState() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#17181c]">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#26be15]/20 dark:bg-[#26be15]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#617dd5]/20 dark:bg-[#617dd5]/10 blur-3xl pointer-events-none" />

      <div className="relative p-8 md:p-12 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#26be15] to-[#1e9b11] text-white flex items-center justify-center shadow-lg"
        >
          <Wallet className="h-8 w-8" strokeWidth={2.2} />
        </motion.div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#26be15] dark:text-[#26be15]">
            Módulo de créditos
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
            Aún no tienes créditos registrados
          </h2>
          <p className="text-sm md:text-base text-[#737373] dark:text-[#a1a1aa] max-w-md mx-auto">
            Empieza a controlar tus préstamos con seguimiento automático, abonos a capital y progreso visual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-2">
          <div className="rounded-2xl bg-[#f5f5f5] dark:bg-white/5 p-4 space-y-1.5">
            <Shield className="h-4 w-4 text-[#23ad1b] dark:text-[#23ad1b]" />
            <p className="text-xs font-bold text-[#17181c] dark:text-white">
              Sin sobreendeudamiento
            </p>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
              Visualiza el impacto de cada crédito en tu presupuesto.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f5f5f5] dark:bg-white/5 p-4 space-y-1.5">
            <TrendingDown className="h-4 w-4 text-[#617dd5] dark:text-[#617dd5]" />
            <p className="text-xs font-bold text-[#17181c] dark:text-white">
              Reduce intereses
            </p>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
              Simula abonos a capital y ve el ahorro en tiempo real.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f5f5f5] dark:bg-white/5 p-4 space-y-1.5">
            <CalendarCheck className="h-4 w-4 text-[#617dd5] dark:text-[#617dd5]" />
            <p className="text-xs font-bold text-[#17181c] dark:text-white">
              Calendario claro
            </p>
            <p className="text-[11px] text-[#737373] dark:text-[#a1a1aa] leading-snug">
              Cronograma de amortización con fechas y saldos.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Link
            href="/credits/new?mode=new"
            className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold rounded-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5] shadow-sm transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            Crear nuevo crédito
          </Link>
          <Link
            href="/credits/new?mode=ongoing"
            className="inline-flex items-center gap-1.5 h-10 px-5 text-sm font-semibold rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e] transition-colors"
          >
            <ClipboardPlus className="h-4 w-4" />
            Agregar existente
          </Link>
        </div>
      </div>
    </div>
  );
}
