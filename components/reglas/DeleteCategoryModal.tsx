"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteCategory } from "@/server/actions/category-actions";
import { useMediaQuery } from "@/hooks/use-media-query";
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
  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;
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

  const content = (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Eliminar categoría</h3>
          <div className="space-y-3">
            {hasTx ? (
              <p className="text-sm text-muted-foreground">
                <strong>{category.name}</strong> tiene{" "}
                <strong>{category._count.transactions}</strong> gastos
                asociados. Selecciona la categoría de destino para
                reasignarlos antes de eliminar.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
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
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 h-10 rounded-xl border border-border bg-background text-foreground hover:bg-muted transition-colors text-sm font-semibold"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isPending || (hasTx && !reassignTo)}
          className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" strokeWidth={2.2} />
              Eliminar
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-background dark:bg-[#17181c] shadow-2xl max-h-[92dvh] min-h-[40dvh] flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <span className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-3">
                {content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-foreground">
            Eliminar categoría
          </DialogTitle>
          <DialogClose onClick={handleClose} />
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
