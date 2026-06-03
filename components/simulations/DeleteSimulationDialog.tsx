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

interface DeleteSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulation: {
    id: string;
    title: string;
    type: string;
    monthlyPayment: number;
  } | null;
  onConfirm: () => Promise<void>;
}

const TYPE_LABELS: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

export function DeleteSimulationDialog({
  open,
  onOpenChange,
  simulation,
  onConfirm,
}: DeleteSimulationDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!simulation) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  if (!simulation) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar simulación</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar esta simulación? Esta
              acción no se puede deshacer.
            </AlertDialogDescription>

            <div className="rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Tipo
                </p>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                  {TYPE_LABELS[simulation.type] ?? simulation.type}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Nombre
                </p>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate max-w-[60%]">
                  {simulation.title}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-stone-200/80 dark:border-stone-800">
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Cuota mensual
                </p>
                <p className="text-sm font-bold tabular-nums text-stone-900 dark:text-stone-50">
                  {formatCOP(simulation.monthlyPayment)}
                </p>
              </div>
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
