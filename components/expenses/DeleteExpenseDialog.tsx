"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import {
  RECURRENCE_DESCRIPTIONS,
  getMonthlyEquivalent,
} from "@/lib/recurrence";
import type { Category, CategoryType, Transaction } from "@/types";

interface DeleteExpenseDialogProps {
  transaction: (Transaction & { category?: Category }) | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_PILL: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WANTS: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  SAVINGS: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  DEBT: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
};

export function DeleteExpenseDialog({
  transaction,
  onOpenChange,
  onConfirm,
}: DeleteExpenseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!transaction) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!transaction) return null;

  const amount = parseFloat(transaction.amount);
  const equivalent = getMonthlyEquivalent(amount, transaction.recurrence);
  const type = transaction.category?.type as CategoryType | undefined;

  return (
    <AlertDialog open={!!transaction} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar gasto</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este gasto? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>

            <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Categoría
                </p>
                <div className="flex items-center gap-1.5">
                  {type && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${TYPE_PILL[type]}`}
                    >
                      {TYPE_LABELS[type]}
                    </Badge>
                  )}
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                    {transaction.category?.name ?? "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Monto
                </p>
                <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
                  {formatCOP(amount)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Frecuencia
                </p>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                  {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
                </p>
              </div>
              {transaction.recurrence !== "MONTHLY" &&
                equivalent !== amount && (
                  <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-200/80 dark:border-stone-800">
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                      Impacto mensual
                    </p>
                    <p className="text-[10px] tabular-nums text-stone-600 dark:text-stone-400">
                      −{formatCOP(equivalent)}
                    </p>
                  </div>
                )}
              {transaction.description && (
                <div className="pt-1.5 border-t border-stone-200/80 dark:border-stone-800">
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {transaction.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Eliminar
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
