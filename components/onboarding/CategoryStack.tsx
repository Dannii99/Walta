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
}

const STACK_CARDS: StackCard[] = [
  {
    id: "NEEDS",
    label: "Necesidades",
    subtitle: "Gastos esenciales y deudas",
    color: "#26be15",
    icon: Home,
    totalCats: 6,
  },
  {
    id: "WANTS",
    label: "Deseos",
    subtitle: "Lo que disfrutas",
    color: "#e7964d",
    icon: Heart,
    totalCats: 4,
  },
  {
    id: "SAVINGS",
    label: "Ahorros",
    subtitle: "Tu futuro financiero",
    color: "#617dd5",
    icon: PiggyBank,
    totalCats: 2,
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

  return (
    <div
      className={cn("relative w-full max-w-[340px] mx-auto h-[210px]", className)}
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
      </style>

      {STACK_CARDS.map((card, i) => {
        const Icon = card.icon;
        const rotation = i === 0 ? 0 : i === 1 ? -5 : 5;
        const yOffset = i === 0 ? 0 : i === 1 ? 40 : 80;
        const zIndex = STACK_CARDS.length - i;

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
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.1 * (i + 1), ease: "easeOut" }}
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
                className={cn(
                  "rounded-2xl border overflow-hidden",
                  "bg-white/80 dark:bg-black/60",
                  "border-white/40 dark:border-white/10",
                  "shadow-lg shadow-black/5 dark:shadow-black/20"
                )}
              >
                <div
                  className="h-1 w-full shrink-0"
                  style={{ backgroundColor: card.color }}
                />

                <div className="flex items-center gap-4 p-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${card.color}18`,
                      color: card.color,
                    }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#17181c] dark:text-white tracking-tight">
                      {card.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {card.subtitle}
                    </p>
                  </div>

                  <div
                    className="shrink-0 rounded-lg px-2.5 py-1 text-center"
                    style={{ backgroundColor: `${card.color}14` }}
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
