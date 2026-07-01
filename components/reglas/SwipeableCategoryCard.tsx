"use client";

import { useState, useRef, useCallback, createElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { getCategoryIconComponent } from "@/lib/category-icons";
import type { Category, CategoryType } from "@/types";

const TYPE_CONFIG: Record<string, { gradient: string; iconGradient: string; glow: string; label: string }> = {
  NEEDS: {
    gradient: "linear-gradient(135deg, rgba(225,29,72,0.08), rgba(236,72,153,0.01))",
    iconGradient: "linear-gradient(135deg, #e11d48, #ec4899)",
    glow: "#e11d48",
    label: "Necesidades",
  },
  WANTS: {
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.01))",
    iconGradient: "linear-gradient(135deg, #10b981, #14b8a6)",
    glow: "#10b981",
    label: "Deseos",
  },
  SAVINGS: {
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(124,58,237,0.01))",
    iconGradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    glow: "#8b5cf6",
    label: "Ahorros",
  },
  DEBT: {
    gradient: "linear-gradient(135deg, rgba(147,51,234,0.08), rgba(124,58,237,0.01))",
    iconGradient: "linear-gradient(135deg, #9333ea, #7c3aed)",
    glow: "#9333ea",
    label: "Deudas",
  },
};

const SWIPE_THRESHOLD = 60;

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

interface SwipeableCategoryCardProps {
  category: CategoryWithCount;
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (category: CategoryWithCount) => void;
}

export function SwipeableCategoryCard({ category, onEdit, onDelete }: SwipeableCategoryCardProps) {
  const [swiped, setSwiped] = useState(false);
  const [hover, setHover] = useState(false);
  const touchStart = useRef<number | null>(null);
  const touchMoved = useRef<number>(0);

  const type = category.type as CategoryType;
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.NEEDS;
  const txCount = category._count.transactions;
  const iconComp = getCategoryIconComponent(category.icon);
  const iconEl = createElement(iconComp, { className: "h-5 w-5", strokeWidth: 2.2 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchMoved.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const dx = touchStart.current - e.touches[0].clientX;
    touchMoved.current = dx;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchMoved.current > SWIPE_THRESHOLD) {
      setSwiped(true);
    } else if (touchMoved.current < -SWIPE_THRESHOLD) {
      setSwiped(false);
    }
    touchStart.current = null;
    touchMoved.current = 0;
  }, []);

  const isDesktopHover = hover && window.innerWidth >= 768;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <motion.div
        animate={{ x: swiped ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="rounded-2xl relative overflow-hidden"
          style={{ background: config.gradient }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 140% 60% at 80% 100%, ${config.glow}15 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${config.glow}08 0%, transparent 70%)`,
            }}
          />

          <div className="relative flex items-center gap-4 p-4 md:py-5 md:px-5">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: config.iconGradient }}
            >
              {iconEl}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold text-foreground dark:text-white tracking-tight">
                  {category.name}
                </p>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0"
                  style={{
                    color: config.glow,
                    backgroundColor: `${config.glow}15`,
                    borderColor: `${config.glow}25`,
                  }}
                >
                  {config.label}
                </span>
              </div>
              {category.description && (
                <p className="text-[11px] mt-0.5 leading-snug text-muted-foreground dark:text-white/60">
                  {category.description}
                </p>
              )}
            </div>

            <div
              className="shrink-0 rounded-lg px-2.5 py-1 text-center"
              style={{
                background: `linear-gradient(135deg, ${config.glow}18, ${config.glow}06)`,
              }}
            >
              <p
                className="text-xs font-bold leading-tight"
                style={{ color: config.glow }}
              >
                {txCount}
              </p>
              <p
                className="text-[10px] leading-tight"
                style={{ color: config.glow, opacity: 0.55 }}
              >
                {txCount === 1 ? "gasto" : "gastos"}
              </p>
            </div>

            <AnimatePresence>
              {isDesktopHover && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="hidden md:flex items-center gap-1 shrink-0"
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(category); }}
                    className="h-9 w-9 rounded-lg bg-background/80 dark:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background dark:hover:bg-white/20 transition-colors shadow-sm"
                    aria-label={`Editar ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(category); }}
                    className="h-9 w-9 rounded-lg bg-[#e54d4d]/10 flex items-center justify-center text-[#e54d4d] hover:bg-[#e54d4d]/20 transition-colors shadow-sm"
                    aria-label={`Eliminar ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="absolute right-0 top-0 bottom-0 z-0 flex items-center gap-1 pr-3">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="h-10 w-10 rounded-xl bg-[var(--color-wants)]/10 flex items-center justify-center text-[var(--color-wants)]"
          aria-label={`Editar ${category.name}`}
        >
          <Pencil className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category)}
          className="h-10 w-10 rounded-xl bg-[#e54d4d]/10 flex items-center justify-center text-[#e54d4d]"
          aria-label={`Eliminar ${category.name}`}
        >
          <Trash2 className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
