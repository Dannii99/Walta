"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface IncomeHeroProps {
  income: number;
}

export function IncomeHero({ income }: IncomeHeroProps) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 200, damping: 35 });
  const formatted = useTransform(spring, (v) => {
    const clamped = Math.max(0, Math.round(v));
    return clamped.toLocaleString("es-CO");
  });
  const prevRef = useRef(0);

  useEffect(() => {
    const prev = prevRef.current;
    const diff = Math.abs(income - prev);
    const threshold = Math.max(prev * 0.3, 500_000);

    if (diff > threshold) {
      count.jump(income);
    } else {
      count.set(income);
    }
    prevRef.current = income;
  }, [income, count]);

  if (income <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tabular-nums tracking-tight"
          style={{
            background: "linear-gradient(135deg, #26be15 0%, #1a8a0e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          $<motion.span>{formatted}</motion.span>
        </span>
        <span className="text-sm font-medium text-white/50 self-end mb-0.5">COP</span>
      </div>
    </motion.div>
  );
}
