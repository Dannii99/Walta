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
import { formatCOP } from "@/lib/currency";
import type { LoanExtraPayment } from "@/types";

interface DeleteExtraPaymentDialogProps {
  extra: LoanExtraPayment | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function DeleteExtraPaymentDialog({
  extra,
  onOpenChange,
  onConfirm,
}: DeleteExtraPaymentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!extra) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!extra) return null;

  return (
    <AlertDialog open={!!extra} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar abono a capital</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar este abono? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>

            <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Fecha
                </p>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                  {formatDate(extra.date)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Monto
                </p>
                <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                  +{formatCOP(parseFloat(extra.amount))}
                </p>
              </div>
              {extra.note && (
                <div className="pt-1.5 border-t border-stone-200/80 dark:border-stone-800">
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {extra.note}
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
