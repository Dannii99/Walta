"use client";

import { motion } from "framer-motion";

interface IncomeHeroProps {
  income: number;
}

export function IncomeHero({ income }: IncomeHeroProps) {
  if (income <= 0) return null;

  const formatted = income.toLocaleString("es-CO");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight"
          style={{
            background: "linear-gradient(135deg, #26be15 0%, #1a8a0e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ${formatted}
        </span>
        <span className="text-sm font-medium text-white/50 self-end mb-0.5">COP</span>
      </div>
    </motion.div>
  );
}
