"use client";

import { useState, useCallback } from "react";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import {
  RECURRENCE_DESCRIPTIONS,
  getPerPaymentAmount,
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
  NEEDS:
    "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15 text-[#23ad1b] dark:text-[#23ad1b] border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  WANTS:
    "bg-[#e7964d]/10 dark:bg-[#e7964d]/15 text-[#e7964d] dark:text-[#e7964d] border-[#e7964d]/20 dark:border-[#e7964d]/20",
  SAVINGS:
    "bg-[#617dd5]/10 dark:bg-[#617dd5]/15 text-[#617dd5] dark:text-[#617dd5] border-[#617dd5]/20 dark:border-[#617dd5]/20",
  DEBT:
    "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15 text-[#e54d4d] dark:text-[#e54d4d] border-[#e54d4d]/20 dark:border-[#e54d4d]/20",
};

/* ─── Shared summary content ─── */
function ExpenseSummaryCard({
  transaction,
}: {
  transaction: Transaction & { category?: Category };
}) {
  const amount = parseFloat(transaction.amount);
  const perPayment = getPerPaymentAmount(amount, transaction.recurrence);
  const showPerPayment =
    transaction.recurrence === "BIWEEKLY" && perPayment !== amount;
  const type = transaction.category?.type as CategoryType | undefined;

  return (
    <div className="rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-[#fafafa] dark:bg-[#1a1a1e]/80 p-3 space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
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
          <span className="text-xs font-semibold text-[#17181c] dark:text-white">
            {transaction.category?.name ?? "—"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
          Monto
        </p>
        <p className="text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
          {formatCOP(amount)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
          Frecuencia
        </p>
        <p className="text-xs font-semibold text-[#17181c] dark:text-white">
          {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
        </p>
      </div>
      {showPerPayment && (
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
          <p className="text-[10px] text-[#737373] dark:text-[#a1a1aa] font-medium">
            Por pago
          </p>
          <p className="text-[10px] tabular-nums text-[#a1a1aa]">
            {formatCOP(perPayment)}
          </p>
        </div>
      )}
      {transaction.description && (
        <div className="pt-1.5 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
          <p className="text-xs text-[#737373] dark:text-[#a1a1aa] line-clamp-2">
            {transaction.description}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Desktop alert dialog ─── */
function DesktopAlertDialog({
  transaction,
  isDeleting,
  onConfirm,
  onCancel,
}: {
  transaction: Transaction & { category?: Category };
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog open={!!transaction} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-[#e54d4d]/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#e54d4d]" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#17181c] dark:text-white">
                Eliminar gasto
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-[#737373] dark:text-[#a1a1aa]">
              ¿Estás seguro de que quieres eliminar este gasto? Esta acción no
              se puede deshacer.
            </AlertDialogDescription>
            <ExpenseSummaryCard transaction={transaction} />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-[#e54d4d] text-white hover:bg-[#d43d3d] dark:bg-[#e54d4d] dark:hover:bg-[#d43d3d]"
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

/* ─── Mobile bottom sheet ─── */
function MobileSheet({
  transaction,
  isDeleting,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
}: {
  transaction: Transaction & { category?: Category };
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-white dark:bg-[#1a1a1e] shadow-2xl max-h-[92dvh] min-h-[40dvh] flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <span className="h-1.5 w-12 rounded-full bg-[#17181c]/20 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#e54d4d]/10 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-[#e54d4d]" />
                </div>
                <h3 className="text-base font-bold tracking-tight text-[#17181c] dark:text-white">
                  Eliminar gasto
                </h3>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-md hover:bg-[#17181c]/5 dark:hover:bg-white/10 text-[#737373]"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4">
              <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">
                ¿Estás seguro de que quieres eliminar este gasto? Esta acción no
                se puede deshacer.
              </p>
              <ExpenseSummaryCard transaction={transaction} />
            </div>

            {/* Sticky footer */}
            <div className="shrink-0 border-t border-[#e8e8e8] dark:border-white/10 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/95 dark:bg-[#1a1a1e]/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-[#e8e8e8] text-[#17181c] hover:bg-[#fafafa] dark:border-[#334155] dark:text-white dark:hover:bg-[#1a1a1e]"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="flex-1 bg-[#e54d4d] text-white hover:bg-[#d43d3d] font-semibold"
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
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main component ─── */
export function DeleteExpenseDialog({
  transaction,
  onOpenChange,
  onConfirm,
}: DeleteExpenseDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(async () => {
    if (!transaction) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }, [transaction, onConfirm]);

  if (!transaction) return null;

  if (isMobile) {
    return (
      <MobileSheet
        transaction={transaction}
        isDeleting={isDeleting}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        open={!!transaction}
        onOpenChange={onOpenChange}
      />
    );
  }

  return (
    <DesktopAlertDialog
      transaction={transaction}
      isDeleting={isDeleting}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
