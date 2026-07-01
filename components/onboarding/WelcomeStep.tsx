"use client";

import { motion } from "framer-motion";
import { Eye, Sparkles, TrendingUp } from "lucide-react";
import { OnboardingIllustration } from "./OnboardingIllustration";

const PILLARS = [
  {
    icon: Eye,
    label: "Ver",
    description: "Salud financiera al instante",
    gradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    icon: Sparkles,
    label: "Decidir",
    description: "Simula antes de comprometerte",
    gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    label: "Seguir",
    description: "Haz seguimiento de tus créditos",
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
];

export function WelcomeStep() {
  return (
    <div className="space-y-5">
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="h-10 w-10 shrink-0">
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
        </div>
      </motion.div>

      <div className="text-center space-y-2">
        <motion.h1
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          Tu dinero, <span className="text-primary">más claro.</span>
        </motion.h1>
        <motion.p
          className="text-[11px] sm:text-sm text-white/60 font-medium leading-relaxed max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        >
          Asistente visual para tu dinero, sin contabilidad.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      >
        <OnboardingIllustration />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {PILLARS.map((pillar, index) => (
          <motion.div
            key={pillar.label}
            className="flex items-start gap-2.5 rounded-xl bg-white/5 dark:bg-white/5 border border-white/10 p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 + index * 0.1 }}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${pillar.gradient}`}
            >
              <pillar.icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-tight">
                {pillar.label}
              </p>
              <p className="text-[10px] text-white/50 leading-snug mt-0.5">
                {pillar.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
