"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FilePlus, ClipboardPlus, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewCreditButtonProps {
  className?: string;
}

export function NewCreditButton({ className }: NewCreditButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Desktop: click outside / ESC to close dropdown
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5] shadow-sm transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nuevo crédito
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Desktop dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[260px] rounded-2xl bg-white dark:bg-[#17181c] shadow-lg overflow-hidden hidden md:block"
          >
            <Link
              href="/credits/new?mode=new"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e] transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FilePlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#17181c] dark:text-white">
                  Crear nuevo
                </p>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-snug">
                  Simula y registra un crédito que vas a tomar.
                </p>
              </div>
            </Link>
            <div className="h-px bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
            <Link
              href="/credits/new?mode=ongoing"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e] transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ClipboardPlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#17181c] dark:text-white">
                  Agregar existente
                </p>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-snug">
                  Registra un crédito que ya tienes en marcha.
                </p>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden mb-0!"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#17181c] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ maxHeight: "92dvh", minHeight: "43dvh" }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
              </div>

              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
                <span className="text-sm font-semibold text-[#17181c] dark:text-white">
                  Nuevo crédito
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-3 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
                <Link
                  href="/credits/new?mode=new"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1e] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e] transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FilePlus className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#17181c] dark:text-white">
                      Crear nuevo
                    </p>
                    <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-snug">
                      Simula y registra un crédito que vas a tomar.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/credits/new?mode=ongoing"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#f5f5f5] dark:bg-[#1a1a1e] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e] transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <ClipboardPlus className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#17181c] dark:text-white">
                      Agregar existente
                    </p>
                    <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-snug">
                      Registra un crédito que ya tienes en marcha.
                    </p>
                  </div>
                </Link>
              </div>

              {/* Sticky footer */}
              <div className="sticky bottom-0 p-4 border-t border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
                <Button
                  variant="outline"
                  className="w-full border-[#e8e8e8] text-[#17181c] dark:border-[#2a2a2e] dark:text-white"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
