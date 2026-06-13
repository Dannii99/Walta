"use client";

import { motion } from "framer-motion";
import { Wallet, BarChart3, Sparkles, Lock, Heart, Gift } from "lucide-react";
import { FeaturePill } from "./FeaturePill";
import { TrustChip } from "./TrustChip";

const FEATURES = [
  {
    icon: Wallet,
    title: "Regla 50/30/20",
    description: "Categorías automáticas según tus ingresos",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Salud al instante",
    description: "Métricas claras de tu mes en curso",
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
  {
    icon: Sparkles,
    title: "Simula decisiones",
    description: "Préstamos y créditos antes de actuar",
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
];

const TRUST = [
  { icon: Lock, label: "Sin tarjeta" },
  { icon: Heart, label: "Tus datos quedan contigo" },
  { icon: Gift, label: "Gratis en beta" },
];

export function LoginHero() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative hidden md:flex flex-col justify-between overflow-hidden border-r border-stone-200/60 dark:border-stone-800 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 p-10 lg:p-14"
      aria-label="Información sobre Walta"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:via-violet-500/10 dark:to-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-500/15 dark:from-pink-500/10 dark:to-rose-500/10 blur-2xl" />

      <div className="relative space-y-8">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="h-12 w-12 shrink-0"
          >
            <img
              src="/logo/Walta_App_dark.svg"
              alt="Walta"
              className="h-full w-full hidden dark:block"
            />
            <img
              src="/logo/Walta_App_light.svg"
              alt="Walta"
              className="h-full w-full block dark:hidden"
            />
          </motion.div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
              Walta
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mt-1">
              Tu dinero, más claro.
            </p>
          </div>
        </div>

        <div className="space-y-3 max-w-md">
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
            Toma el control de tu dinero de forma visual.
          </h1>
          <p className="text-sm xl:text-[15px] text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
            Visualiza tu salud financiera, simula decisiones importantes y cuida
            cada peso con la regla 50/30/20.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-w-md">
          {FEATURES.map((f) => (
            <FeaturePill key={f.title} {...f} />
          ))}
        </div>
      </div>

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {TRUST.map((t) => (
            <TrustChip key={t.label} {...t} />
          ))}
        </div>
        <p className="text-[10px] font-medium text-stone-500 dark:text-stone-400">
          © 2026 Walta. Hecho con cuidado para tu bolsillo.
        </p>
      </div>
    </motion.aside>
  );
}
