"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { AIAdvisorCard } from "./AIAdvisorCard";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AIAdvisorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  simulationId: string;
}

export function AIAdvisorSheet({ open, onOpenChange, simulationId }: AIAdvisorSheetProps) {
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;

  // Body scroll lock
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

  if (!isMobile) {
    // Desktop: Custom Dialog
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
        <div className="relative max-w-2xl w-full mx-4 mt-20 sm:mt-0">
          <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e]">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-[#17181c] dark:text-white">
                  Análisis inteligente
                </span>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-[#737373] hover:text-[#17181c] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-5 md:p-6">
              <AIAdvisorCard simulationId={simulationId} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile: Bottom Sheet
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#17181c] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: -54 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ maxHeight: "92dvh", minHeight: "50dvh" }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-[#17181c] dark:text-white">
                  Análisis inteligente
                </span>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-[#737373] hover:text-[#17181c] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Content */}
            <div className="overflow-y-auto max-h-[80dvh] p-4 pb-[calc(4rem+env(safe-area-inset-bottom))]">
              <AIAdvisorCard simulationId={simulationId} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
