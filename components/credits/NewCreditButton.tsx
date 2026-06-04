"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, FilePlus, ClipboardPlus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewCreditButtonProps {
  className?: string;
}

export function NewCreditButton({ className }: NewCreditButtonProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-semibold rounded-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm transition-colors"
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

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[260px] rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-lg overflow-hidden"
          >
            <Link
              href="/credits/new?mode=new"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FilePlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                  Crear nuevo
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-snug">
                  Simula y registra un crédito que vas a tomar.
                </p>
              </div>
            </Link>
            <div className="h-px bg-stone-200/80 dark:bg-stone-800" />
            <Link
              href="/credits/new?mode=ongoing"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
            >
              <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ClipboardPlus className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                  Agregar existente
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-snug">
                  Registra un crédito que ya tienes en marcha.
                </p>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
