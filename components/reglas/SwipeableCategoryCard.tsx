"use client";

import { useState, useRef, useCallback, createElement } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
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

const ACTION_WIDTH = 160;

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

interface SwipeableCategoryCardProps {
  category: CategoryWithCount;
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (category: CategoryWithCount) => void;
  reducedMotion?: boolean;
}

export function SwipeableCategoryCard({ category, onEdit, onDelete, reducedMotion }: SwipeableCategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const actionOpacity = useTransform(x, [-ACTION_WIDTH, 0], [1, 0]);

  const type = category.type as CategoryType;
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.NEEDS;
  const txCount = category._count.transactions;
  const iconComp = getCategoryIconComponent(category.icon);
  const iconEl = createElement(iconComp, { className: "h-5 w-5", strokeWidth: 2.2 });

  const snapTo = useCallback(
    (target: number) => {
      animate(x, target, { type: "spring", stiffness: 300, damping: 30 });
    },
    [x]
  );

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (offset < -80 || velocity < -500) {
        setIsOpen(true);
        snapTo(-ACTION_WIDTH);
      } else {
        setIsOpen(false);
        snapTo(0);
      }
    },
    [snapTo]
  );

  const handleTap = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      snapTo(0);
    }
  }, [isOpen, snapTo]);

  const handleEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false);
      snapTo(0);
      onEdit(category);
    },
    [snapTo, onEdit, category]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen(false);
      snapTo(0);
      onDelete(category);
    },
    [snapTo, onDelete, category]
  );

  const cardContent = (
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
    </div>
  );

  if (reducedMotion) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
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
          <div className="relative">
            {cardContent}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 pb-2">
          <button
            type="button"
            onClick={handleEdit}
            className="h-9 px-3 rounded-lg bg-[var(--color-wants)]/10 flex items-center justify-center gap-1.5 text-[var(--color-wants)] hover:bg-[var(--color-wants)]/20 transition-colors text-xs font-semibold"
            aria-label={`Editar ${category.name}`}
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.2} />
            Editar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-9 px-3 rounded-lg bg-[#e54d4d]/10 flex items-center justify-center gap-1.5 text-[#e54d4d] hover:bg-[#e54d4d]/20 transition-colors text-xs font-semibold"
            aria-label={`Eliminar ${category.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
            Eliminar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Action bar (behind the card) */}
      <motion.div className="absolute inset-y-0 right-0 flex items-stretch" style={{ opacity: actionOpacity }}>
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center justify-center w-20 bg-[var(--color-wants)] text-white hover:bg-[var(--color-wants)]/90 transition-colors"
          aria-label={`Editar ${category.name}`}
        >
          <div className="flex flex-col items-center gap-1">
            <Pencil className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">Editar</span>
          </div>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center justify-center w-20 bg-[#e54d4d] text-white hover:bg-[#c43939] transition-colors"
          aria-label={`Eliminar ${category.name}`}
        >
          <div className="flex flex-col items-center gap-1">
            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold">Eliminar</span>
          </div>
        </button>
      </motion.div>

      {/* Draggable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -ACTION_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        style={{ x, touchAction: "pan-y" }}
        className={`relative z-10 cursor-grab active:cursor-grabbing transition-[border-radius] duration-200 ${
          isOpen ? "rounded-l-2xl rounded-r-none" : "rounded-2xl"
        }`}
      >
        <div
          className="relative overflow-hidden"
          style={{ background: config.gradient }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 140% 60% at 80% 100%, ${config.glow}15 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${config.glow}08 0%, transparent 70%)`,
            }}
          />
          <div className="relative">
            {cardContent}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
