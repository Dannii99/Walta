"use client";

import { motion, useReducedMotion } from "framer-motion";

interface IncomeFlowSVGProps {
  income: number;
  className?: string;
}

const MAX_INCOME = 10_000_000;

export function IncomeFlowSVG({ income, className }: IncomeFlowSVGProps) {
  const reducedMotion = useReducedMotion();
  const fillPct = Math.min(income / MAX_INCOME, 1);
  const fillH = 38 * fillPct;
  const fillY = 60 + (38 - fillH);

  return (
    <svg
      viewBox="0 0 40 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="f-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
        <linearGradient id="f-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26be15" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a8a0e" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="f-arrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26be15" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#26be15" stopOpacity="0.1" />
        </linearGradient>
        <clipPath id="f-clip">
          <rect x="10" y="60" width="20" height="38" rx="5" />
        </clipPath>
      </defs>

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Arrow stem */}
        <line x1="20" y1="18" x2="20" y2="52" stroke="url(#f-arrow)" strokeWidth="2" strokeDasharray="3 3" />

        {/* Arrow head */}
        <polygon points="20,54 17,47 23,47" fill="#26be15" fillOpacity="0.6" />

        {/* Particles */}
        <motion.circle
          cx="18" cy="24" r="1.8" fill="#26be15" opacity={0.7}
          animate={reducedMotion ? undefined : {
            cy: ["22", "50"],
            opacity: [0.7, 0],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeIn", delay: 0 }}
        />
        <motion.circle
          cx="22" cy="24" r="1.4" fill="#4ade80" opacity={0.5}
          animate={reducedMotion ? undefined : {
            cy: ["22", "50"],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn", delay: 0.35 }}
        />
        <motion.circle
          cx="17" cy="24" r="1.2" fill="#26be15" opacity={0.4}
          animate={reducedMotion ? undefined : {
            cy: ["22", "50"],
            opacity: [0.4, 0],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeIn", delay: 0.7 }}
        />

        {/* Glass container */}
        <rect x="10" y="60" width="20" height="38" rx="5" fill="url(#f-glass)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Top rim highlight */}
        <rect x="11" y="61" width="18" height="3" rx="1.5" fill="white" opacity="0.06" />

        {/* Fill level */}
        <motion.rect
          x="11" y={fillY} width="18" height={fillH} rx={3}
          fill="url(#f-fill)"
          initial={false}
          animate={{ y: fillY, height: fillH }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Fill shimmer */}
        {fillPct > 0 && (
          <motion.rect
            x="11" y={Math.max(fillY, 67)} width="18" height="2" rx="1"
            fill="white" opacity={0.15}
            animate={reducedMotion ? undefined : {
              opacity: [0.15, 0.04, 0.15],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.g>
    </svg>
  );
}
