"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_BUDGET_RULE } from "@/lib/constants";

type Template = "50-30-20" | "blank";

interface TemplateStepProps {
  value: Template | null;
  onChange: (template: Template) => void;
}

export function TemplateStep({ value, onChange }: TemplateStepProps) {
  const templates: {
    id: Template;
    title: string;
    description: string;
    rule: { needs: number; wants: number; savings: number };
  }[] = [
    {
      id: "50-30-20",
      title: "Plantilla 50/30/20",
      description: "50% Necesidades, 30% Deseos, 20% Ahorros",
      rule: DEFAULT_BUDGET_RULE,
    },
    {
      id: "blank",
      title: "Empezar en blanco",
      description: "Crea tus propias categorías desde cero",
      rule: DEFAULT_BUDGET_RULE,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Elige tu plantilla</h2>
        <p className="text-muted-foreground text-sm">
          Selecciona una plantilla o personaliza todo desde cero
        </p>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => {
          const selected = value === template.id;
          return (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground/50"
                }`}
                onClick={() => onChange(template.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>

                      {template.id === "50-30-20" && (
                        <div className="flex items-center gap-1 pt-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{ width: `${template.rule.needs}%` }}
                          />
                          <div
                            className="h-2 rounded-full bg-amber-500"
                            style={{ width: `${template.rule.wants}%` }}
                          />
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${template.rule.savings}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
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
