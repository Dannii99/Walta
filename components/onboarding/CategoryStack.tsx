"use client";

import { useSyncExternalStore, useId } from "react";
import { motion } from "framer-motion";
import { Home, Heart, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryId = "NEEDS" | "WANTS" | "SAVINGS";

interface StackCard {
  id: CategoryId;
  label: string;
  subtitle: string;
  color: string;
  icon: React.ElementType;
  totalCats: number;
  themeGradient: string;
  bgGradient: string;
  glowColor: string;
}

const STACK_CARDS: StackCard[] = [
  {
    id: "NEEDS",
    label: "Necesidades",
    subtitle: "Gastos esenciales y deudas",
    color: "#e11d48",
    icon: Home,
    totalCats: 6,
    themeGradient: "linear-gradient(135deg, #e11d48, #ec4899)",
    bgGradient: "linear-gradient(135deg, rgba(225,29,72,0.08), rgba(236,72,153,0.01))",
    glowColor: "#e11d48",
  },
  {
    id: "WANTS",
    label: "Deseos",
    subtitle: "Lo que disfrutas",
    color: "#10b981",
    icon: Heart,
    totalCats: 4,
    themeGradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.01))",
    glowColor: "#10b981",
  },
  {
    id: "SAVINGS",
    label: "Ahorros",
    subtitle: "Tu futuro financiero",
    color: "#8b5cf6",
    icon: PiggyBank,
    totalCats: 2,
    themeGradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    bgGradient: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(124,58,237,0.01))",
    glowColor: "#8b5cf6",
  },
];

interface CategoryStackProps {
  className?: string;
}

const FLOAT_CONFIG = [
  { amplitude: -10, duration: 4, delay: 0 },
  { amplitude: 8, duration: 4.5, delay: 0.4 },
  { amplitude: -9, duration: 3.8, delay: 0.8 },
];

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedSnapshot, getReducedServerSnapshot);
}

export function CategoryStack({ className }: CategoryStackProps) {
  const reducedMotion = useReducedMotion();
  const uid = useId();
  const name = (i: number) => `float-${uid}-${i}`;
  const shimmerId = `shimmer-${uid}`;
  const glowId = (i: number) => `glow-${uid}-${i}`;

  return (
    <div
      className={cn("relative w-full max-w-[340px] mx-auto h-[310px]", className)}
      role="list"
      aria-label="Categorías de presupuesto"
    >
      <style>
        {STACK_CARDS.map(
          (_, i) => `
@keyframes ${name(i)} {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(${FLOAT_CONFIG[i].amplitude}px); }
}`
        ).join("\n")}
        {STACK_CARDS.map(
          (_, i) => `
@keyframes ${glowId(i)} {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
}`
        ).join("\n")}
{`@keyframes ${shimmerId} {
  0% { transform: translateX(-120%) skewX(-25deg); }
  60% { transform: translateX(120%) skewX(-25deg); }
  100% { transform: translateX(120%) skewX(-25deg); }
}`}
      </style>

      {STACK_CARDS.map((card, i) => {
        const Icon = card.icon;
        const rotation = i === 0 ? 0 : i === 1 ? -5 : 5;
        const yOffset = i === 0 ? 0 : i === 1 ? 80 : 190;
        const zIndex = STACK_CARDS.length - i;
        const isTop = i === 0;

        return (
          <div
            key={card.id}
            role="listitem"
            className="absolute inset-x-0 top-0"
            style={{
              zIndex,
              transform: `translateY(${yOffset}px) rotate(${rotation}deg)`,
              transformOrigin: "center bottom",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: i === 0 ? 8 : i === 1 ? -8 : 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.55, delay: 0.1 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
              className="will-change-[opacity,transform]"
              style={
                reducedMotion
                  ? undefined
                  : {
                      animation: `${name(i)} ${FLOAT_CONFIG[i].duration}s ease-in-out ${FLOAT_CONFIG[i].delay}s infinite`,
                    }
              }
            >
              <div
                className="rounded-2xl backdrop-blur-md relative overflow-hidden"
                style={{ background: card.bgGradient }}
              >
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse 140% 60% at 80% 100%, ${card.glowColor}15 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={
                    reducedMotion
                      ? { opacity: 0.35, background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${card.glowColor}10 0%, transparent 70%)` }
                      : {
                          animation: `${glowId(i)} 3s ease-in-out ${i * 0.5}s infinite`,
                          background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${card.glowColor}15 0%, transparent 70%)`,
                        }
                  }
                />

                {isTop && !reducedMotion && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)`,
                        animation: `${shimmerId} 4s ease-in-out infinite`,
                      }}
                    />
                  </div>
                )}

                <div className="relative flex items-center gap-4 p-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ background: card.themeGradient }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#17181c] dark:text-white tracking-tight">
                      {card.label}
                    </p>
                    <p
                      className="text-[11px] mt-0.5 leading-snug text-white/60"
                    >
                      {card.subtitle}
                    </p>
                  </div>

                  <div
                    className="shrink-0 rounded-lg px-2.5 py-1 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}18, ${card.color}06)`,
                    }}
                  >
                    <p
                      className="text-xs font-bold leading-tight"
                      style={{ color: card.color }}
                    >
                      {card.totalCats}
                    </p>
                    <p
                      className="text-[10px] leading-tight"
                      style={{ color: card.color, opacity: 0.55 }}
                    >
                      cats
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
