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
      <AlertDialogContent className="bg-white dark:bg-[#17181c] border-[#e8e8e8] dark:border-[#2a2a2e]">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#e54d4d]" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#17181c] dark:text-white">Eliminar simulación</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-[#737373] dark:text-[#a1a1aa]">
              ¿Estás seguro de que quieres eliminar esta simulación? Esta
              acción no se puede deshacer.
            </AlertDialogDescription>

            <div className="rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-[#fafafa] dark:bg-[#1a1a1e] p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
                  Tipo
                </p>
                <p className="text-xs font-semibold text-[#17181c] dark:text-white">
                  {TYPE_LABELS[simulation.type] ?? simulation.type}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
                  Nombre
                </p>
                <p className="text-xs font-semibold text-[#17181c] dark:text-white truncate max-w-[60%]">
                  {simulation.title}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
                  Cuota mensual
                </p>
                <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
                  {formatCOP(simulation.monthlyPayment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#e8e8e8] dark:border-[#2a2a2e] text-[#17181c] dark:text-white hover:bg-[#fafafa] dark:hover:bg-[#1a1a1e]">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-[#e54d4d] text-white hover:bg-[#c43939] dark:bg-[#e54d4d] dark:hover:bg-[#c43939]"
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
