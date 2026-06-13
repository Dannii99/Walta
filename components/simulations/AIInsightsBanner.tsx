"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2, AlertCircle, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { generateSimulationInsights } from "@/server/actions/ai-actions";
import { useMediaQuery } from "@/hooks/use-media-query";

export function AIInsightsBanner() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;

  const loadInsight = () => {
    startTransition(async () => {
      try {
        const res = await generateSimulationInsights();
        setInsight(res.insight ?? null);
        setHasLoaded(true);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo generar el insight"
        );
        setHasLoaded(true);
      }
    });
  };

  const handleOpen = () => {
    if (!hasLoaded && !isPending) {
      loadInsight();
    }
    if (isMobile) {
      setSheetOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSheetOpen(false);
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
            <AlertCircle className="h-4 w-4 text-stone-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-600 dark:text-stone-400">
              No pudimos generar el insight de tu portafolio.
            </p>
          </div>
          <button
            onClick={loadInsight}
            className="text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
            aria-label="Reintentar"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    if (!hasLoaded || isPending) {
      return (
        <div className="rounded-2xl border border-violet-200/60 dark:border-violet-900/40 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 dark:from-violet-950/20 dark:to-fuchsia-950/10 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Análisis IA
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Analizando tu portafolio de simulaciones...
            </p>
          </div>
          <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-violet-200/60 dark:border-violet-900/40 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 dark:from-violet-950/20 dark:to-fuchsia-950/10 overflow-hidden"
      >
        <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
        <div className="p-4 md:p-5 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Análisis IA
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={insight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm md:text-[15px] leading-relaxed text-stone-700 dark:text-stone-200 font-medium"
              >
                {insight}
              </motion.p>
            </AnimatePresence>
          </div>
          <button
            onClick={loadInsight}
            className="text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors shrink-0"
            aria-label="Regenerar insight"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-sm"
        aria-label="Abrir análisis IA de simulaciones"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Análisis IA
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-[#17181c] border border-[#e8e8e8] dark:border-[#2a2a2e] rounded-2xl">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#17181c] border-b border-[#e8e8e8] dark:border-[#2a2a2e] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-bold text-[#17181c] dark:text-white">
                Análisis IA de simulaciones
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="px-5 py-4">{renderContent()}</div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: -72 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#17181c] rounded-t-2xl max-h-[85dvh] overflow-y-auto shadow-xl"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-[#17181c] border-b border-[#e8e8e8] dark:border-[#2a2a2e] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-[#17181c] dark:text-white">
                    Análisis IA
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-5 py-4 pb-8">{renderContent()}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
