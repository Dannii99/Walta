"use client";

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
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_DOT: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-500",
  WANTS: "bg-amber-500",
  SAVINGS: "bg-blue-500",
  DEBT: "bg-rose-500",
};

const TYPE_PILL: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WANTS: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  SAVINGS: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  DEBT: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
};

const RECURRENCE_PILL: Record<Recurrence, string> = {
  MONTHLY:
    "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  BIWEEKLY:
    "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  ONE_TIME:
    "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
};

export function ExpenseCard({
  transaction,
  onEdit,
  onDelete,
}: ExpenseCardProps) {
  const category = transaction.category;
  const type = category?.type as CategoryType | undefined;
  const amount = parseFloat(transaction.amount);
  const perPayment = getPerPaymentAmount(amount, transaction.recurrence);
  const showPerPayment =
    transaction.recurrence === "BIWEEKLY" && perPayment !== amount;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {type && (
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${TYPE_DOT[type]}`}
              aria-hidden="true"
            />
          )}
          <span className="text-sm font-semibold text-stone-900 dark:text-stone-50 truncate">
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
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(transaction)}
            className="h-8 w-8"
            aria-label="Editar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(transaction)}
            className="h-8 w-8 text-destructive hover:text-destructive"
            aria-label="Eliminar"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {transaction.description && (
        <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
          {transaction.description}
        </p>
      )}

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
            {formatCOP(amount)}
          </p>
          {showPerPayment && (
            <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
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
          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            Próx: {formatNextOccurrenceLabel(transaction.date, transaction.recurrence)}
          </p>
        </div>
      </div>
    </div>
  );
}
