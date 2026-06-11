"use client";

import { useState, useRef } from "react";
import { motion, useAnimationControls, PanInfo } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import {
  RECURRENCE_DESCRIPTIONS,
  getPerPaymentAmount,
  formatNextOccurrenceLabel,
} from "@/lib/recurrence";
import type { Category, CategoryType, Recurrence, Transaction } from "@/types";

interface ExpenseCardProps {
  transaction: Transaction & { category?: Category };
  onEdit: (transaction: Transaction & { category?: Category }) => void;
  onDelete: (transaction: Transaction & { category?: Category }) => void;
  reducedMotion?: boolean;
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_DOT: Record<CategoryType, string> = {
  NEEDS: "bg-[#23ad1b]",
  WANTS: "bg-[#e7964d]",
  SAVINGS: "bg-[#617dd5]",
  DEBT: "bg-[#e54d4d]",
};

const TYPE_PILL: Record<CategoryType, string> = {
  NEEDS:
    "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15 text-[#23ad1b] dark:text-[#23ad1b] border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  WANTS:
    "bg-[#e7964d]/10 dark:bg-[#e7964d]/15 text-[#e7964d] dark:text-[#e7964d] border-[#e7964d]/20 dark:border-[#e7964d]/20",
  SAVINGS:
    "bg-[#617dd5]/10 dark:bg-[#617dd5]/15 text-[#617dd5] dark:text-[#617dd5] border-[#617dd5]/20 dark:border-[#617dd5]/20",
  DEBT:
    "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15 text-[#e54d4d] dark:text-[#e54d4d] border-[#e54d4d]/20 dark:border-[#e54d4d]/20",
};

const RECURRENCE_PILL: Record<Recurrence, string> = {
  MONTHLY:
    "bg-[#617dd5]/10 dark:bg-[#617dd5]/15 text-[#617dd5] dark:text-[#617dd5] border-[#617dd5]/20 dark:border-[#617dd5]/20",
  BIWEEKLY:
    "bg-[#e7964d]/10 dark:bg-[#e7964d]/15 text-[#e7964d] dark:text-[#e7964d] border-[#e7964d]/20 dark:border-[#e7964d]/20",
  ONE_TIME:
    "bg-[#f5f5f5] dark:bg-[#1a1a1e] text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e]",
};

const ACTION_WIDTH = 160;

export function ExpenseCard({
  transaction,
  onEdit,
  onDelete,
  reducedMotion,
}: ExpenseCardProps) {
  const category = transaction.category;
  const type = category?.type as CategoryType | undefined;
  const amount = parseFloat(transaction.amount);
  const perPayment = getPerPaymentAmount(amount, transaction.recurrence);
  const showPerPayment =
    transaction.recurrence === "BIWEEKLY" && perPayment !== amount;

  const [isOpen, setIsOpen] = useState(false);
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Swiped left enough to open
    if (offset < -80 || velocity < -500) {
      setIsOpen(true);
      controls.start({ x: -ACTION_WIDTH });
    } else {
      setIsOpen(false);
      controls.start({ x: 0 });
    }
  };

  const handleTap = () => {
    if (isOpen) {
      setIsOpen(false);
      controls.start({ x: 0 });
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    controls.start({ x: 0 });
    onEdit(transaction);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    controls.start({ x: 0 });
    onDelete(transaction);
  };

  // If reducedMotion, show actions always visible (fallback)
  if (reducedMotion) {
    return (
      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {type && (
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${TYPE_DOT[type]}`}
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-semibold text-[#17181c] dark:text-white truncate">
              {category?.name ?? "—"}
            </span>
            {type && (
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${TYPE_PILL[type]}`}
              >
                {TYPE_LABELS[type]}
              </Badge>
            )}
          </div>
          <div className="flex gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transaction)}
              className="h-8 w-8 hover:bg-[#26be15]/10 hover:text-[#26be15]"
              aria-label="Editar"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transaction)}
              className="h-8 w-8 text-[#e54d4d] hover:bg-[#e54d4d]/10 hover:text-[#e54d4d]"
              aria-label="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {transaction.description && (
          <p className="text-sm text-[#737373] dark:text-[#a1a1aa] line-clamp-2">
            {transaction.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
              {formatCOP(amount)}
            </p>
            {showPerPayment && (
              <p className="text-xs text-[#a1a1aa] tabular-nums">
                Por pago: {formatCOP(perPayment)}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge
              variant="outline"
              className={`text-[10px] ${RECURRENCE_PILL[transaction.recurrence]}`}
            >
              {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
            </Badge>
            <p className="text-[10px] text-[#a1a1aa]">
              Próx: {formatNextOccurrenceLabel(transaction.date, transaction.recurrence)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      {/* Action bar (behind the card) */}
      <div className="absolute inset-y-0 right-0 flex items-stretch">
        <button
          type="button"
          onClick={handleEdit}
          className="flex items-center justify-center w-20 bg-[#26be15] text-white hover:bg-[#1e9e0f] transition-colors"
          aria-label="Editar gasto"
        >
          <div className="flex flex-col items-center gap-1">
            <Pencil className="h-4 w-4" />
            <span className="text-[10px] font-semibold">Editar</span>
          </div>
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center justify-center w-20 bg-[#e54d4d] text-white hover:bg-[#d43d3d] transition-colors"
          aria-label="Eliminar gasto"
        >
          <div className="flex flex-col items-center gap-1">
            <Trash2 className="h-4 w-4" />
            <span className="text-[10px] font-semibold">Eliminar</span>
          </div>
        </button>
      </div>

      {/* Draggable card content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -ACTION_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        animate={controls}
        className="relative z-10 bg-white dark:bg-[#17181c] rounded-2xl cursor-grab active:cursor-grabbing"
        style={{ touchAction: "pan-y" }}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {type && (
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${TYPE_DOT[type]}`}
                  aria-hidden="true"
                />
              )}
              <span className="text-sm font-semibold text-[#17181c] dark:text-white truncate">
                {category?.name ?? "—"}
              </span>
              {type && (
                <Badge
                  variant="outline"
                  className={`text-[10px] shrink-0 ${TYPE_PILL[type]}`}
                >
                  {TYPE_LABELS[type]}
                </Badge>
              )}
            </div>
          </div>

          {transaction.description && (
            <p className="text-sm text-[#737373] dark:text-[#a1a1aa] line-clamp-2">
              {transaction.description}
            </p>
          )}

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
                {formatCOP(amount)}
              </p>
              {showPerPayment && (
                <p className="text-xs text-[#a1a1aa] tabular-nums">
                  Por pago: {formatCOP(perPayment)}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                variant="outline"
                className={`text-[10px] ${RECURRENCE_PILL[transaction.recurrence]}`}
              >
                {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
              </Badge>
              <p className="text-[10px] text-[#a1a1aa]">
                Próx: {formatNextOccurrenceLabel(transaction.date, transaction.recurrence)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
