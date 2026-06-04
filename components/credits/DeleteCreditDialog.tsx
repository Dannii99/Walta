"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteCreditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditTitle: string;
  paymentCount: number;
  extrasCount: number;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteCreditDialog({
  open,
  onOpenChange,
  creditTitle,
  paymentCount,
  extrasCount,
  onConfirm,
  isDeleting,
}: DeleteCreditDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <AlertDialogTitle>¿Eliminar este crédito?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminarán todos los datos
                asociados a <strong>{creditTitle}</strong>.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        {(paymentCount > 0 || extrasCount > 0) && (
          <div className="rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-3 space-y-1">
            <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Se eliminarán:
            </p>
            <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
              {paymentCount > 0 && (
                <li>
                  · {paymentCount} {paymentCount === 1 ? "pago registrado" : "pagos registrados"}
                </li>
              )}
              {extrasCount > 0 && (
                <li>
                  · {extrasCount} {extrasCount === 1 ? "abono a capital" : "abonos a capital"}
                </li>
              )}
            </ul>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
          >
            {isDeleting ? "Eliminando..." : "Eliminar crédito"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
