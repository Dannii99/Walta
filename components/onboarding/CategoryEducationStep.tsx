"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL = 5000;

type CategoryId = "NEEDS" | "WANTS" | "SAVINGS";

interface CategoryScene {
  id: CategoryId;
  label: string;
  subtitle: string;
  color: string;
  rgb: string;
  examples: string[];
  totalCats: number;
  description: string;
}

const CATEGORIES: CategoryScene[] = [
  {
    id: "NEEDS",
    label: "Necesidades",
    subtitle: "Gastos esenciales y deudas",
    color: "#26be15",
    rgb: "38,190,21",
    description: "Todo lo que necesitas para vivir: vivienda, comida, transporte, servicios y deudas.",
    examples: ["Arriendo / Hipoteca", "Mercado / Comida", "Transporte", "Servicios", "Deudas"],
    totalCats: 6,
  },
  {
    id: "WANTS",
    label: "Deseos",
    subtitle: "Lo que disfrutas",
    color: "#e7964d",
    rgb: "231,150,77",
    description: "Gastos que mejoran tu calidad de vida: entretenimiento, compras, salidas.",
    examples: ["Restaurantes", "Streaming", "Compras", "Entretenimiento"],
    totalCats: 4,
  },
  {
    id: "SAVINGS",
    label: "Ahorros",
    subtitle: "Tu futuro financiero",
    color: "#617dd5",
    rgb: "97,125,213",
    description: "Construye tu patrimonio: emergencias, inversiones, metas grandes.",
    examples: ["Fondo emergencia", "Inversiones", "Metas", "Pension"],
    totalCats: 2,
  },
];

function NeedsIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="needs-bg" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#26be15" stopOpacity="0.18" />
          <stop offset="40%" stopColor="#14a88e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#26be15" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="needs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14a88e" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#26be15" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="needs-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26be15" />
          <stop offset="50%" stopColor="#1fad12" />
          <stop offset="100%" stopColor="#198f0a" />
        </linearGradient>
        <linearGradient id="needs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--card)" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id="needs-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5c842" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="needs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#26be15" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#1d9e0f" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#needs-sky)" />
      <circle cx="200" cy="150" r="140" fill="url(#needs-bg)" />

      {/* Ground */}
      <path d="M0 230 Q100 218 200 225 Q300 232 400 222 L400 300 L0 300 Z" fill="url(#needs-ground)" />

      {/* Radar rings */}
      <motion.circle cx="200" cy="145" r="55" stroke="#14a88e" strokeWidth="1" strokeOpacity="0.3" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0 }} />
      <motion.circle cx="200" cy="145" r="55" stroke="#26be15" strokeWidth="1" strokeOpacity="0.2" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1.8, opacity: 0 }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 1.4 }} />

      {/* Shrubs left */}
      <ellipse cx="140" cy="218" rx="16" ry="10" fill="#26be15" fillOpacity="0.15" />
      <ellipse cx="148" cy="215" rx="10" ry="7" fill="#14a88e" fillOpacity="0.12" />

      {/* Shrubs right */}
      <ellipse cx="258" cy="220" rx="14" ry="9" fill="#26be15" fillOpacity="0.12" />
      <ellipse cx="250" cy="216" rx="9" ry="6" fill="#14a88e" fillOpacity="0.1" />

      {/* Pathway */}
      <path d="M195 220 Q198 235 196 250 Q194 260 200 280" stroke="#26be15" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.08" fill="none" />

      {/* House */}
      <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* House body */}
        <path d="M134 190 L134 125 L200 82 L266 125 L266 190 Z" fill="url(#needs-wall)" stroke="var(--border)" strokeWidth="1.5" />
        {/* Roof */}
        <path d="M126 130 L200 72 L274 130" fill="url(#needs-roof)" stroke="#26be15" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Roof edge detail */}
        <path d="M126 130 L274 130" stroke="#1d9e0f" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Door */}
        <rect x="185" y="142" width="30" height="48" rx="3" fill="#e8d5a3" fillOpacity="0.6" stroke="var(--border)" strokeWidth="1" />
        <circle cx="209" cy="168" r="2.5" fill="#26be15" fillOpacity="0.6" />
        {/* Door arch */}
        <path d="M185 142 Q200 132 215 142" fill="#e8d5a3" fillOpacity="0.4" stroke="var(--border)" strokeWidth="0.5" />

        {/* Left window with warm glow */}
        <rect x="148" y="140" width="22" height="22" rx="3" fill="url(#needs-window)" stroke="#f5c842" strokeWidth="0.8" strokeOpacity="0.5" />
        <motion.rect x="148" y="140" width="22" height="22" rx="3" fill="#f5c842" fillOpacity="0.15" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        <line x1="159" y1="140" x2="159" y2="162" stroke="#f5c842" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="148" y1="151" x2="170" y2="151" stroke="#f5c842" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Right window */}
        <rect x="230" y="140" width="22" height="22" rx="3" fill="url(#needs-window)" stroke="#f5c842" strokeWidth="0.8" strokeOpacity="0.5" />
        <motion.rect x="230" y="140" width="22" height="22" rx="3" fill="#f5c842" fillOpacity="0.15" animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        <line x1="241" y1="140" x2="241" y2="162" stroke="#f5c842" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="230" y1="151" x2="252" y2="151" stroke="#f5c842" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Chimney */}
        <rect x="240" y="85" width="10" height="16" rx="1.5" fill="var(--card)" stroke="var(--border)" strokeWidth="0.8" />
      </motion.g>

      {/* Floating shield */}
      <motion.g animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} style={{ transformOrigin: "85px 100px" }}>
        <path d="M75 90 L80 85 L90 85 L95 90 L90 105 L85 110 L80 105 Z" fill="#14a88e" fillOpacity="0.12" stroke="#14a88e" strokeWidth="1" strokeOpacity="0.4" />
        <path d="M82 95 L85 100 L91 92" stroke="#14a88e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.5" />
      </motion.g>
      <motion.g animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} style={{ transformOrigin: "320px 200px" }}>
        <path d="M310 190 L315 185 L325 185 L330 190 L325 205 L320 210 L315 205 Z" fill="#26be15" fillOpacity="0.1" stroke="#26be15" strokeWidth="1" strokeOpacity="0.3" />
      </motion.g>

      {/* Floating gold coins */}
      <motion.g animate={{ y: [0, -14, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <circle cx="300" cy="85" r="11" fill="#f0c040" fillOpacity="0.15" stroke="#f0c040" strokeWidth="1" strokeOpacity="0.35" />
        <text x="296" y="89" fill="#f0c040" fillOpacity="0.6" fontSize="9" fontWeight="bold" textAnchor="middle">$</text>
      </motion.g>
      <motion.g animate={{ y: [0, -9, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}>
        <circle cx="315" cy="110" r="7" fill="#f0c040" fillOpacity="0.1" stroke="#f0c040" strokeWidth="0.8" strokeOpacity="0.25" />
      </motion.g>

      {/* Sky dots */}
      <motion.circle cx="100" cy="50" r="1.5" fill="#14a88e" fillOpacity="0.3" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.circle cx="300" cy="60" r="1" fill="#26be15" fillOpacity="0.25" animate={{ opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="250" cy="45" r="1.2" fill="#f0c040" fillOpacity="0.2" animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} />
    </svg>
  );
}

function WantsIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="wants-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#e7964d" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#e76d6d" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#c084fc" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#e7964d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wants-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#e7964d" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="wants-gift-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--card)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="wants-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e76d6d" />
          <stop offset="100%" stopColor="#e7964d" />
        </linearGradient>
        <linearGradient id="wants-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#wants-sky)" />
      <circle cx="200" cy="150" r="140" fill="url(#wants-bg)" />

      {/* Party streamers */}
      <motion.path d="M40 80 Q60 70 80 90 Q100 110 90 130" stroke="#e76d6d" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.2" animate={{ pathLength: [0, 1, 0.8, 1] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.path d="M320 60 Q340 50 350 75 Q360 100 345 120" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" fill="none" strokeOpacity="0.15" animate={{ pathLength: [0, 1, 0.7, 1] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }} />

      {/* Balloon left */}
      <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}>
        <ellipse cx="65" cy="105" rx="16" ry="20" fill="#e76d6d" fillOpacity="0.15" stroke="#e76d6d" strokeWidth="1" strokeOpacity="0.35" />
        <path d="M62 123 L60 135" stroke="#e76d6d" strokeWidth="0.8" strokeOpacity="0.3" />
      </motion.g>
      {/* Balloon right */}
      <motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <ellipse cx="335" cy="95" rx="12" ry="15" fill="#c084fc" fillOpacity="0.12" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.3" />
        <path d="M333 108 L331 120" stroke="#c084fc" strokeWidth="0.8" strokeOpacity="0.25" />
      </motion.g>

      {/* Gift box center */}
      <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        {/* Box body */}
        <rect x="150" y="125" width="100" height="75" rx="8" fill="url(#wants-gift-body)" stroke="var(--border)" strokeWidth="1.5" />
        {/* Purple lid */}
        <rect x="147" y="115" width="106" height="16" rx="5" fill="url(#wants-lid)" stroke="#c084fc" strokeWidth="1" strokeOpacity="0.5" />
        {/* Horizontal ribbon */}
        <rect x="150" y="148" width="100" height="10" fill="url(#wants-ribbon)" fillOpacity="0.3" />
        {/* Vertical ribbon */}
        <rect x="190" y="125" width="20" height="75" fill="url(#wants-ribbon)" fillOpacity="0.25" />
        {/* Bow */}
        <motion.g style={{ transformOrigin: "200px 115px" }} animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M185 108 Q178 95 185 100 Q192 105 190 115" fill="#e76d6d" fillOpacity="0.4" />
          <path d="M215 108 Q222 95 215 100 Q208 105 210 115" fill="#e76d6d" fillOpacity="0.35" />
          <circle cx="200" cy="112" r="4" fill="#e7964d" fillOpacity="0.5" />
        </motion.g>
        {/* Shine */}
        <rect x="155" y="130" width="10" height="6" rx="3" fill="white" fillOpacity="0.08" />
      </motion.g>

      {/* Sparkles */}
      <motion.circle cx="265" cy="100" r="5" fill="#f0c040" initial={{ scale: 0 }} animate={{ scale: [0, 1.6, 0], opacity: [0, 0.9, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }} />
      <motion.circle cx="280" cy="80" r="3" fill="#e76d6d" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 0], opacity: [0, 0.7, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
      <motion.circle cx="130" cy="190" r="4" fill="#c084fc" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 1.2 }} />
      <motion.circle cx="290" cy="210" r="3" fill="#f0c040" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 0], opacity: [0, 0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 1.6 }} />
      <motion.circle cx="310" cy="160" r="2.5" fill="#e7964d" initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 0], opacity: [0, 0.7, 0] }} transition={{ duration: 2.3, repeat: Infinity, delay: 2 }} />

      {/* Gold stars */}
      <motion.path d="M105 70 L108 77 L115 77 L110 82 L112 90 L105 85 L98 90 L100 82 L95 77 L102 77 Z" fill="#f0c040" fillOpacity="0.2" initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }} style={{ transformOrigin: "105px 80px" }} />
      <motion.path d="M300 40 L302 45 L308 45 L304 49 L305 55 L300 51 L295 55 L296 49 L292 45 L298 45 Z" fill="#f0c040" fillOpacity="0.15" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 0], opacity: [0, 0.4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} style={{ transformOrigin: "300px 47px" }} />

      {/* Confetti dots */}
      <motion.circle cx="160" cy="100" r="2.5" fill="#e76d6d" fillOpacity="0.4" animate={{ y: [0, -20, 0], x: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
      <motion.circle cx="240" cy="105" r="2" fill="#c084fc" fillOpacity="0.35" animate={{ y: [0, -15, 0], x: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }} />
      <motion.circle cx="200" cy="95" r="2" fill="#f0c040" fillOpacity="0.3" animate={{ y: [0, -18, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.7 }} />
    </svg>
  );
}

function SavingsIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="savings-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#617dd5" stopOpacity="0.2" />
          <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.1" />
          <stop offset="60%" stopColor="#34d399" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#617dd5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="savings-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#617dd5" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="savings-piggy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--card)" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id="savings-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0c040" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="savings-bar" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#savings-sky)" />
      <circle cx="200" cy="150" r="140" fill="url(#savings-bg)" />

      {/* Background rings */}
      <motion.circle cx="200" cy="150" r="80" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.1" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }} />
      <motion.circle cx="200" cy="150" r="80" stroke="#617dd5" strokeWidth="0.8" strokeOpacity="0.08" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.4, opacity: 0 }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeOut", delay: 2 }} />

      {/* Piggy bank */}
      <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
        <motion.g initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
          {/* Body */}
          <ellipse cx="200" cy="155" rx="52" ry="38" fill="url(#savings-piggy)" stroke="#617dd5" strokeWidth="1.5" />
          {/* Shadow under belly */}
          <ellipse cx="200" cy="178" rx="40" ry="10" fill="#617dd5" fillOpacity="0.04" />
          {/* Eye */}
          <circle cx="178" cy="145" r="5" fill="#8b5cf6" fillOpacity="0.15" />
          <circle cx="178" cy="144" r="2" fill="#617dd5" fillOpacity="0.4" />
          {/* Snout */}
          <ellipse cx="168" cy="155" rx="8" ry="6" fill="#8b5cf6" fillOpacity="0.08" stroke="#617dd5" strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx="165" cy="154" r="1.5" fill="#617dd5" fillOpacity="0.3" />
          <circle cx="171" cy="154" r="1.5" fill="#617dd5" fillOpacity="0.3" />
          {/* Ear */}
          <ellipse cx="188" cy="120" rx="8" ry="10" fill="var(--card)" stroke="#617dd5" strokeWidth="1" />
          <ellipse cx="212" cy="120" rx="8" ry="10" fill="var(--card)" stroke="#617dd5" strokeWidth="1" />
          {/* Tail */}
          <motion.path d="M252 150 c10-6 10-20 4-28" stroke="#617dd5" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          {/* Coin slot */}
          <rect x="195" y="125" width="10" height="5" rx="2" fill="#617dd5" fillOpacity="0.3" />
          {/* Legs */}
          <ellipse cx="178" cy="190" rx="8" ry="4" fill="var(--card)" stroke="#617dd5" strokeWidth="0.8" strokeOpacity="0.4" />
          <ellipse cx="222" cy="190" rx="8" ry="4" fill="var(--card)" stroke="#617dd5" strokeWidth="0.8" strokeOpacity="0.4" />
          {/* Highlight */}
          <ellipse cx="210" cy="140" rx="12" ry="8" fill="white" fillOpacity="0.06" />
        </motion.g>
      </motion.g>

      {/* Coin stack left */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <ellipse cx="125" cy="200" rx="12" ry="4" fill="url(#savings-coin)" stroke="#f0c040" strokeWidth="0.6" strokeOpacity="0.4" />
        <motion.ellipse cx="125" cy="194" rx="12" ry="4" fill="url(#savings-coin)" stroke="#f0c040" strokeWidth="0.6" strokeOpacity="0.4" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 0.5 }} style={{ transformOrigin: "125px 194px" }} />
        <motion.ellipse cx="125" cy="188" rx="12" ry="4" fill="url(#savings-coin)" stroke="#f0c040" strokeWidth="0.6" strokeOpacity="0.4" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 0.65 }} style={{ transformOrigin: "125px 188px" }} />
        <motion.ellipse cx="125" cy="182" rx="12" ry="4" fill="url(#savings-coin)" stroke="#f0c040" strokeWidth="0.6" strokeOpacity="0.4" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 0.8 }} style={{ transformOrigin: "125px 182px" }} />
        <motion.ellipse cx="125" cy="176" rx="12" ry="4" fill="url(#savings-coin)" stroke="#f0c040" strokeWidth="0.6" strokeOpacity="0.35" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 0.95 }} style={{ transformOrigin: "125px 176px" }} />
      </motion.g>

      {/* Growing bars (investment chart) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <motion.rect x="270" y="188" width="12" height="24" rx="2" fill="url(#savings-bar)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} style={{ transformOrigin: "276px 200px" }} />
        <motion.rect x="288" y="176" width="12" height="36" rx="2" fill="url(#savings-bar)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }} style={{ transformOrigin: "294px 194px" }} />
        <motion.rect x="306" y="160" width="12" height="52" rx="2" fill="url(#savings-bar)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }} style={{ transformOrigin: "312px 186px" }} />
        <motion.rect x="324" y="170" width="12" height="42" rx="2" fill="url(#savings-bar)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }} style={{ transformOrigin: "330px 191px" }} />
      </motion.g>

      {/* Trend line going up */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <path d="M265 205 L278 196 L296 200 L312 185 L328 190 L342 176" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity="0.3" />
        <motion.path d="M265 205 L278 196 L296 200 L312 185 L328 190 L342 176" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }} />
        <motion.circle cx="342" cy="176" r="3.5" fill="#34d399" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3, delay: 1.2 }} />
      </motion.g>

      {/* Floating elements */}
      <motion.g animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 }}>
        <circle cx="310" cy="75" r="10" fill="#f0c040" fillOpacity="0.12" stroke="#f0c040" strokeWidth="1" strokeOpacity="0.3" />
        <text x="306" y="79" fill="#f0c040" fillOpacity="0.5" fontSize="8" fontWeight="bold" textAnchor="middle">$</text>
      </motion.g>
      <motion.g animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
        <circle cx="75" cy="180" r="7" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="0.8" strokeOpacity="0.25" />
      </motion.g>

      {/* Rising particles */}
      <motion.circle cx="220" cy="85" r="2" fill="#34d399" fillOpacity="0.3" animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.circle cx="180" cy="70" r="1.5" fill="#22d3ee" fillOpacity="0.25" animate={{ y: [0, -12, 0], opacity: [0.1, 0.5, 0.1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="240" cy="65" r="1.8" fill="#f0c040" fillOpacity="0.2" animate={{ y: [0, -18, 0], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} />
    </svg>
  );
}

const ILLUSTRATIONS: {
  [K in CategoryId]: () => React.JSX.Element;
} = {
  NEEDS: NeedsIllustration,
  WANTS: WantsIllustration,
  SAVINGS: SavingsIllustration,
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

interface CategoryEducationStepProps {
  onContinue: () => void;
  isLoading?: boolean;
}

export function CategoryEducationStep({ onContinue, isLoading = false }: CategoryEducationStepProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % CATEGORIES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [isPaused, goNext]);

  const category = CATEGORIES[current];
  const SvgComponent = ILLUSTRATIONS[category.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="text-center space-y-1.5"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Tus categorias
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Walta organiza tus gastos en 3 grupos. Desliza para ver cada uno.
        </p>
      </motion.div>

      <div className="relative w-full max-w-[380px] mx-auto" aria-live="polite" role="region" aria-label={category.label}>
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-muted/10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.35 }}
              className="p-5"
            >
              <SvgComponent />

              <div className="mt-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    {category.totalCats} categorias
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                  {category.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-4" role="tablist" aria-label="Categorias">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={cat.label}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                i === current ? "w-8" : "w-2.5 bg-muted-foreground/20 hover:bg-muted-foreground/30"
              )}
              style={i === current ? { backgroundColor: cat.color } : undefined}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="rounded-2xl border border-muted bg-gradient-to-br from-muted/40 to-muted/20 p-5 text-center"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">12 categorias</span> predefinidas listas para usar.
          Cuando gustes, editalas y ponles limite en{" "}
          <span className="font-bold text-foreground">Reglas</span>.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        disabled={isLoading}
        className="w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creando tu presupuesto...
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
            Continuar al dashboard
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}
