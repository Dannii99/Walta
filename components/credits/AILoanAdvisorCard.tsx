"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  ThumbsUp,
  Info,
  AlertTriangle,
  Lightbulb,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateLoanAdvice } from "@/server/actions/ai-actions";
import type { AdvisorAnalysis, AdvisorImpact } from "@/lib/ai/schemas";

const IMPACT_STYLES: Record<AdvisorImpact, { icon: typeof ThumbsUp; pill: string; label: string }> = {
  positive: {
    icon: ThumbsUp,
    pill: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    label: "Mejora",
  },
  neutral: {
    icon: Info,
    pill: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
    label: "Información",
  },
  negative: {
    icon: AlertTriangle,
    pill: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    label: "Riesgo",
  },
};

interface AILoanAdvisorCardProps {
  loanId: string;
}

export function AILoanAdvisorCard({ loanId }: AILoanAdvisorCardProps) {
  const [analysis, setAnalysis] = useState<AdvisorAnalysis | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadAdvice = () => {
    startTransition(async () => {
      try {
        const res = await generateLoanAdvice(loanId);
        setAnalysis(res.analysis);
        setIsCached(res.cached);
        setGeneratedAt(new Date(res.generatedAt));
        setHasLoaded(true);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo generar el análisis";
        setError(message);
        setHasLoaded(true);
      }
    });
  };

  useEffect(() => {
    loadAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Card className="border-rose-200 dark:border-rose-900">
        <CardContent className="p-5 md:p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                No pudimos generar el análisis
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {error}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => loadAdvice()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                )}
                Reintentar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasLoaded || isPending) {
    return (
      <Card>
        <CardContent className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                Análisis inteligente del crédito
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Generando recomendaciones personalizadas...
              </p>
            </div>
            <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full animate-pulse" />
            <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full animate-pulse w-5/6" />
            <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded-full animate-pulse w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-violet-200/60 dark:border-violet-900/40 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />
        <CardContent className="p-5 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                  Análisis inteligente del crédito
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Powered by AI
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => loadAdvice()}
              className="text-stone-500 hover:text-violet-600 dark:hover:text-violet-400 -mr-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={analysis.verdict_explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <p className="text-sm md:text-[15px] leading-relaxed text-stone-700 dark:text-stone-200 font-medium">
                {analysis.verdict_explanation}
              </p>

              {analysis.recommendations.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Recomendaciones
                  </p>
                  {analysis.recommendations.map((rec, i) => {
                    const style = IMPACT_STYLES[rec.impact];
                    const Icon = style.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800"
                      >
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${style.pill}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                              {rec.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-bold uppercase tracking-wider ${style.pill}`}
                            >
                              {style.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {analysis.risks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Riesgos a considerar
                  </p>
                  <ul className="space-y-1.5">
                    {analysis.risks.map((risk, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed"
                      >
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.alternative_suggestion && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
                  <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-0.5">
                      Alternativa
                    </p>
                    <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                      {analysis.alternative_suggestion}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/80 dark:border-stone-800">
            <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-relaxed">
              Análisis generado por IA. No constituye asesoría financiera
              profesional.
            </p>
            {generatedAt && (
              <div className="flex items-center gap-1 text-[10px] text-stone-400 dark:text-stone-500 shrink-0">
                <Calendar className="h-2.5 w-2.5" />
                <span>
                  {isCached ? "Cache" : "Nuevo"} ·{" "}
                  {new Intl.DateTimeFormat("es-CO", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(generatedAt)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
