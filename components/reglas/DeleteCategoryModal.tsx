"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteCategory } from "@/server/actions/category-actions";
import type { Category, CategoryType } from "@/types";

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryWithCount;
  otherCategories: CategoryWithCount[];
  onDeleted: () => void;
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

export function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
  otherCategories,
  onDeleted,
}: DeleteCategoryModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [reassignTo, setReassignTo] = useState("");
  const hasTx = category._count.transactions > 0;

  const handleConfirm = () => {
    if (hasTx && !reassignTo) {
      setError("Selecciona una categoría de destino para reasignar los gastos");
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategory(category.id, reassignTo || undefined);
        setReassignTo("");
        setError("");
        onOpenChange(false);
        onDeleted();
      } catch {
        setError("Error al eliminar la categoría");
      }
    });
  };

  const handleClose = () => {
    setReassignTo("");
    setError("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                Eliminar categoría
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-muted-foreground">
              <div className="space-y-3">
                {hasTx ? (
                  <p>
                    <strong>{category.name}</strong> tiene{" "}
                    <strong>{category._count.transactions}</strong> gastos
                    asociados. Selecciona la categoría de destino para
                    reasignarlos antes de eliminar.
                  </p>
                ) : (
                  <p>
                    ¿Estás seguro de eliminar la categoría{" "}
                    <strong>{category.name}</strong>? Esta acción no se puede
                    deshacer.
                  </p>
                )}

                <div className="rounded-xl border border-border bg-muted/50 p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground font-medium">Categoría</p>
                    <span className="text-xs font-semibold text-foreground">
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground font-medium">Gastos asociados</p>
                    <span className="text-xs font-semibold text-foreground">
                      {category._count.transactions}
                    </span>
                  </div>
                </div>

                {hasTx && otherCategories.length > 0 && (
                  <Select
                    value={reassignTo}
                    onValueChange={(v) => {
                      setReassignTo(v);
                      setError("");
                    }}
                  >
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue placeholder="Seleccionar categoría de destino..." />
                    </SelectTrigger>
                    <SelectContent>
                      {otherCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: `var(--color-${(c.type as string).toLowerCase()})`,
                              }}
                            />
                            {c.name} ({TYPE_LABELS[c.type as CategoryType]})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {error && (
                  <p className="text-xs font-medium text-destructive">{error}</p>
                )}
              </div>
            </AlertDialogDescription>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending || (hasTx && !reassignTo)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
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
