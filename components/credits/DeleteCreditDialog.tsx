"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

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
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Body scroll lock for mobile sheet
  useEffect(() => {
    if (!isMobile || !open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, open]);

  if (isMobile) {
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
              animate={{ y: -72 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-white dark:bg-[#17181c] shadow-2xl max-h-[92dvh] min-h-[35dvh] flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <span className="h-1.5 w-12 rounded-full bg-[#17181c]/20 dark:bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-5 py-2 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-base font-bold tracking-tight text-[#17181c] dark:text-white">
                    Eliminar crédito
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

              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
                <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">
                  Esta acción no se puede deshacer. Se eliminarán todos los datos
                  asociados a <strong>{creditTitle}</strong>.
                </p>
                {(paymentCount > 0 || extrasCount > 0) && (
                  <div className="rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 p-3 space-y-1">
                    <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Se eliminarán:
                    </p>
                    <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-0.5">
                      {paymentCount > 0 && (
                        <li>
                          · {paymentCount}{" "}
                          {paymentCount === 1
                            ? "pago registrado"
                            : "pagos registrados"}
                        </li>
                      )}
                      {extrasCount > 0 && (
                        <li>
                          · {extrasCount}{" "}
                          {extrasCount === 1
                            ? "abono a capital"
                            : "abonos a capital"}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-[#e8e8e8] dark:border-white/10 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/95 dark:bg-[#1a1a1e]/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
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
                    {isDeleting ? "Eliminando..." : "Eliminar crédito"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

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
            disabled={isDeleting}
            className="bg-[#e54d4d] text-white hover:bg-[#d43d3d] dark:bg-[#e54d4d] dark:hover:bg-[#d43d3d]"
          >
            {isDeleting ? "Eliminando..." : "Eliminar crédito"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
