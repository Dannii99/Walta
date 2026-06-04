"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateLoanPortfolioInsights } from "@/server/actions/ai-actions";

export function AILoanInsightsBanner() {
  const [insight, setInsight] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadInsight = () => {
    startTransition(async () => {
      try {
        const res = await generateLoanPortfolioInsights();
        setInsight(res.insight);
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
    loadInsight();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 p-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-stone-200 dark:bg-stone-800 flex items-center justify-center shrink-0">
          <AlertCircle className="h-4 w-4 text-stone-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-stone-600 dark:text-stone-400">
            No pudimos generar el insight de tu portafolio de créditos.
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
            Analizando tu portafolio de créditos...
          </p>
        </div>
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
      </div>
    );
  }

  if (!insight) return null;

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
}
