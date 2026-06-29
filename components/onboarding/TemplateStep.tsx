"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_BUDGET_RULE } from "@/lib/constants";

type Template = "50-30-20" | "detailed" | "blank";

interface TemplateStepProps {
  value: Template | null;
  onChange: (template: Template) => void;
}

const BAR_COLORS = {
  needs: "#26be15",
  wants: "#e7964d",
  savings: "#617dd5",
};

export function TemplateStep({ value, onChange }: TemplateStepProps) {
  const templates: {
    id: Template;
    title: string;
    description: string;
    categoryCount: number;
    recommended?: boolean;
  }[] = [
    {
      id: "50-30-20",
      title: "Plantilla 50/30/20",
      description: "15 categorías balanceadas, ideal para empezar",
      categoryCount: 15,
      recommended: true,
    },
    {
      id: "detailed",
      title: "Plantilla Detallada",
      description: "26 categorías con desglose fino de gastos",
      categoryCount: 26,
    },
    {
      id: "blank",
      title: "Empezar en blanco",
      description: "Crea tus propias categorías desde cero",
      categoryCount: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Elige tu plantilla</h2>
        <p className="text-muted-foreground text-sm">
          Selecciona una plantilla o personaliza todo desde cero
        </p>
      </div>

      <div className="grid gap-3">
        {templates.map((template, index) => {
          const selected = value === template.id;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.08 }}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selected
                    ? "border-primary ring-2 ring-primary/20 dark:ring-primary/30 bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                }`}
                onClick={() => onChange(template.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm">{template.title}</h3>
                        {template.recommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 text-[10px] font-bold">
                            <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {template.description}
                      </p>

                      {/* Mini illustration per template */}
                      {template.id === "50-30-20" && (
                        <div className="flex items-center gap-1 pt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${DEFAULT_BUDGET_RULE.needs}%`,
                              backgroundColor: BAR_COLORS.needs,
                            }}
                          />
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${DEFAULT_BUDGET_RULE.wants}%`,
                              backgroundColor: BAR_COLORS.wants,
                            }}
                          />
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${DEFAULT_BUDGET_RULE.savings}%`,
                              backgroundColor: BAR_COLORS.savings,
                            }}
                          />
                          <span className="ml-2 text-[10px] font-semibold text-muted-foreground min-w-14">
                            50 · 30 · 20
                          </span>
                        </div>
                      )}

                      {template.id === "detailed" && (
                        <div className="flex items-end gap-0.5 pt-1">
                          {[60, 90, 40, 75, 55, 85, 45, 65, 50, 80].map((h, i) => (
                            <div
                              key={i}
                              className="w-1.5 rounded-sm"
                              style={{
                                height: `${h * 0.25}px`,
                                backgroundColor: i < 6 ? BAR_COLORS.needs : i < 8 ? BAR_COLORS.wants : BAR_COLORS.savings,
                                opacity: 0.7,
                              }}
                            />
                          ))}
                          <span className="ml-2 text-[10px] font-semibold text-muted-foreground">
                            {template.categoryCount} categorías
                          </span>
                        </div>
                      )}

                      {template.id === "blank" && (
                        <div className="flex items-center gap-2 pt-1">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                          </svg>
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            Tú decides las categorías
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground scale-100"
                          : "border-muted-foreground/30 scale-90"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}