"use client";

import { motion } from "framer-motion";

export function OnboardingIllustration() {
  return (
    <div className="relative w-full max-w-[380px] mx-auto" aria-hidden>
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <linearGradient id="ob-phone-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--card)" />
            <stop offset="100%" stopColor="var(--card)" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="ob-glow-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#26be15" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#26be15" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="ob-bar-needs" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#26be15" />
            <stop offset="100%" stopColor="#23ad1b" />
          </linearGradient>
          <linearGradient id="ob-bar-wants" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e7964d" />
            <stop offset="100%" stopColor="#d4823a" />
          </linearGradient>
          <linearGradient id="ob-bar-savings" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#617dd5" />
            <stop offset="100%" stopColor="#4a68c0" />
          </linearGradient>
          <linearGradient id="ob-coin-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26be15" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a8a0e" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Capa 1: Fondo radial glow */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <circle cx="200" cy="150" r="120" fill="url(#ob-glow-grad)" />
        </motion.g>

        {/* Capa 2: Elementos orbitantes (monedas/tarjetas) */}
        <motion.g
          style={{ transformOrigin: "200px 150px" }}
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: -15, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Moneda/ícono flotante #1 — arriba derecha */}
          <motion.g
            animate={{ y: [0, -7, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0,
            }}
          >
            <circle cx="120" cy="60" r="18" fill="url(#ob-coin-grad)" />
            <circle cx="120" cy="60" r="14" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
            <path d="M120 53 L120 67 M114 60 L126 60" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </motion.g>

          {/* Chip/tarjeta flotante #2 — izquierda */}
          <motion.g
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <rect x="40" y="160" width="48" height="32" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
            <rect x="48" y="170" width="16" height="3" rx="1.5" fill="#26be15" />
            <rect x="48" y="178" width="24" height="2.5" rx="1.25" fill="var(--muted-foreground)" opacity="0.5" />
            <circle cx="80" cy="184" r="3" fill="#26be15" opacity="0.4" />
          </motion.g>

          {/* Indicador flotante #3 — derecha abajo */}
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <circle cx="310" cy="220" r="16" fill="#26be15" fillOpacity="0.15" stroke="#26be15" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M304 220 L308 224 L316 216" stroke="#26be15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>

          {/* Pequeño punto decorativo #4 — arriba izquierda */}
          <motion.g
            animate={{ y: [0, 5, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <circle cx="70" cy="95" r="5" fill="#617dd5" fillOpacity="0.35" stroke="#617dd5" strokeWidth="0.8" strokeOpacity="0.3" />
          </motion.g>

          {/* Pequeño punto decorativo #5 — derecha */}
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <circle cx="330" cy="130" r="4" fill="#e7964d" fillOpacity="0.4" stroke="#e7964d" strokeWidth="0.8" strokeOpacity="0.3" />
          </motion.g>
        </motion.g>

        {/* Capa 3: Celular central */}
        <motion.g
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          {/* Cuerpo del teléfono */}
          <rect
            x="150"
            y="50"
            width="100"
            height="200"
            rx="16"
            fill="url(#ob-phone-grad)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
          {/* Notch */}
          <rect x="185" y="58" width="30" height="4" rx="2" fill="var(--muted)" />
          {/* Borde interior sutil */}
          <rect x="157" y="72" width="86" height="170" rx="10" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.4" />

          {/* — Contenido de la pantalla — */}

          {/* Header: saldo disponible */}
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <text x="165" y="92" fill="var(--muted-foreground)" fontSize="6" fontWeight="400" fontFamily="inherit" opacity="0.6">
            </text>
            <rect x="165" y="86" width="24" height="4" rx="2" fill="var(--muted-foreground)" opacity="0.35" />
            <rect x="165" y="94" width="42" height="6" rx="3" fill="var(--foreground)" opacity="0.75" />
          </motion.g>

          {/* Tarjeta de salud: barra 50/30/20 */}
          <motion.g
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
            style={{ transformOrigin: "200px 118px" }}
          >
            {/* Barra Needs (verde) — 50% */}
            <rect x="165" y="115" width="24" height="6" rx="3" fill="url(#ob-bar-needs)" />
            {/* Barra Wants (amber) — 30% */}
            <rect x="189" y="115" width="14.4" height="6" rx="0" fill="url(#ob-bar-wants)" />
            {/* Barra Savings (blue) — 20% */}
            <rect x="203.4" y="115" width="9.6" height="6" rx="3" fill="url(#ob-bar-savings)" />
          </motion.g>

          {/* Mini cards: 2 tarjetas dentro del phone */}
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            {/* Card fila #1 */}
            <rect x="165" y="130" width="36" height="5" rx="2.5" fill="var(--muted)" />
            <rect x="165" y="138" width="18" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.3" />

            <rect x="203" y="130" width="40" height="5" rx="2.5" fill="var(--muted)" />
            <rect x="203" y="138" width="20" height="3" rx="1.5" fill="var(--muted-foreground)" opacity="0.3" />
          </motion.g>

          {/* Donut chart mini */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.85 }}
          >
            <circle cx="180" cy="165" r="14" fill="none" stroke="var(--muted)" strokeWidth="4" />
            <motion.circle
              cx="180"
              cy="165"
              r="14"
              fill="none"
              stroke="#26be15"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDasharray: "57 88" }}
              animate={{ strokeDasharray: "57 88" }}
              transform="rotate(-90 180 165)"
            />
            <rect x="175" y="162" width="10" height="6" rx="3" fill="var(--foreground)" opacity="0.65" />
          </motion.g>

          {/* Mini línea de tendencia */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <path
              d="M200 175 L210 168 L220 172 L230 160 L240 164"
              fill="none"
              stroke="#26be15"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M200 175 L210 168 L220 172 L230 160 L240 164"
              fill="none"
              stroke="#26be15"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.95, ease: "easeOut" }}
            />
            <circle cx="240" cy="164" r="2" fill="#26be15" />
          </motion.g>

          {/* Indicator dots abajo */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          >
            <circle cx="180" cy="205" r="2.5" fill="#26be15" />
            <circle cx="200" cy="205" r="2.5" fill="var(--muted-foreground)" opacity="0.35" />
            <circle cx="220" cy="205" r="2.5" fill="var(--muted-foreground)" opacity="0.35" />
          </motion.g>
        </motion.g>

        {/* Capa 4: Brillo del teléfono */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <rect x="155" y="55" width="30" height="190" rx="14" fill="white" />
        </motion.g>
      </svg>
    </div>
  );
}