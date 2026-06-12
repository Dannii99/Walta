"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateSimulationInsights } from "@/server/actions/ai-actions";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AIInsightsBannerProps {
  initialInsight?: string | null;
}

export function AIInsightsBanner({ initialInsight }: AIInsightsBannerProps) {
  const [insight, setInsight] = useState<string | null>(initialInsight ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(initialInsight !== undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)") ?? false;

  // Body scroll lock for mobile sheet
  useEffect(() => {
    if (sheetOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen, isMobile]);

  const loadInsight = () => {
    startTransition(async () => {
      try {
        const res = await generateSimulationInsights();
        if (res.insight !== null) {
          setInsight(res.insight);
        }
        setHasLoaded(true);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo generar el insight";
        setError(message);
        setHasLoaded(true);
      }
    });
  };

  useEffect(() => {
    if (!hasLoaded) {
      const timer = setTimeout(() => loadInsight(), 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hasLoaded && initialInsight !== undefined && !isRefreshing) {
      const timer = setTimeout(() => {
        setIsRefreshing(true);
        loadInsight();
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoaded]);

  // If nothing to show, hide completely
  if (hasLoaded && !insight && !error) return null;

  // Shared content renderer
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
            onClick={() => loadInsight()}
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
            onClick={() => loadInsight()}
            className="text-stone-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors shrink-0"
            aria-label="Regenerar insight"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Mobile: compact button + bottom sheet
  if (isMobile) {
    const isLoading = !hasLoaded || isPending;
    const icon = error ? (
      <AlertCircle className="h-4 w-4" />
    ) : isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Sparkles className="h-4 w-4" />
    );

    return (
      <>
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#617dd5]/20 bg-white dark:bg-[#17181c] px-3 py-2.5 text-sm font-semibold text-[#617dd5] hover:bg-[#617dd5]/5 dark:hover:bg-[#617dd5]/10 transition-colors"
          aria-label="Abrir diagnóstico inteligente"
        >
          {icon}
          Diagnóstico
        </button>

        <AnimatePresence>
          {sheetOpen && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSheetOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#17181c] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
                initial={{ y: "100%" }}
                animate={{ y: -54 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ maxHeight: "92dvh", minHeight: "35dvh" }}
              >
                {/* Sticky header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#e8e8e8] dark:border-[#2a2a2e] bg-white/80 dark:bg-[#17181c]/80 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-[#17181c] dark:text-white">
                      Diagnóstico inteligente
                    </span>
                  </div>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="h-8 w-8 rounded-full flex items-center justify-center text-[#737373] hover:text-[#17181c] dark:hover:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e]"
                    aria-label="Cerrar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[80dvh] p-4 pb-[calc(4rem+env(safe-area-inset-bottom))]">
                  {renderContent()}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: inline card
  return renderContent();
}
