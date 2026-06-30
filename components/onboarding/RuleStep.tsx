"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, SlidersHorizontal, Sparkles, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BudgetRule } from "@/types";

interface RuleOption {
  id: string;
  label: string;
  description: string;
  rule: BudgetRule;
  icon: typeof Sparkles;
  recommended?: boolean;
}

const OPTIONS: RuleOption[] = [
  {
    id: "balanced",
    label: "Balanceado",
    description: "50% necesidades · 30% deseos · 20% ahorros",
    rule: { needs: 50, wants: 30, savings: 20 },
    icon: Sparkles,
    recommended: true,
  },
  {
    id: "saver",
    label: "Ahorrador",
    description: "40% necesidades · 30% deseos · 30% ahorros",
    rule: { needs: 40, wants: 30, savings: 30 },
    icon: BarChart3,
  },
];

interface RuleStepProps {
  rule: BudgetRule;
  onRuleChange: (rule: BudgetRule) => void;
  onSkip: () => void;
}

export function RuleStep({ rule, onRuleChange, onSkip }: RuleStepProps) {
  const [mode, setMode] = useState<"preset" | "custom">(() => {
    const isCustom = !OPTIONS.some((o) => o.rule.needs === rule.needs && o.rule.wants === rule.wants && o.rule.savings === rule.savings);
    return isCustom ? "custom" : "preset";
  });
  const [selectedId, setSelectedId] = useState(() => {
    const match = OPTIONS.find((o) => o.rule.needs === rule.needs && o.rule.wants === rule.wants && o.rule.savings === rule.savings);
    return match?.id ?? OPTIONS[0].id;
  });
  const [needs, setNeeds] = useState(rule.needs);
  const [wants, setWants] = useState(rule.wants);
  const [savings, setSavings] = useState(rule.savings);

  const total = needs + wants + savings;
  const isValid = total === 100;
  const diff = total - 100;

  const selectPreset = (opt: RuleOption) => {
    setSelectedId(opt.id);
    setMode("preset");
    setNeeds(opt.rule.needs);
    setWants(opt.rule.wants);
    setSavings(opt.rule.savings);
    onRuleChange(opt.rule);
  };

  const switchToCustom = () => {
    setMode("custom");
    setSelectedId("");
  };

  const updateCustom = (field: "needs" | "wants" | "savings", value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    const state = { ...{ needs, wants, savings }, [field]: clamped };
    setNeeds(state.needs);
    setWants(state.wants);
    setSavings(state.savings);
    if (state.needs + state.wants + state.savings === 100) {
      onRuleChange({ needs: state.needs, wants: state.wants, savings: state.savings });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Distribuye tus ingresos
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Elige cómo dividir tus ingresos en necesidades, deseos y ahorros.
          Puedes cambiarlo cuando quieras en Reglas.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt, index) => {
          const isSelected = selectedId === opt.id && mode === "preset";
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => selectPreset(opt)}
              className={cn(
                "w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
                  : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isSelected ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : (
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-base">{opt.label}</span>
                    {opt.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        <Sparkles className="h-3 w-3" />
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 flex h-2.5 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.needs}%`, backgroundColor: "#26be15" }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.wants}%`, backgroundColor: "#e7964d" }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.savings}%`, backgroundColor: "#617dd5" }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}

        {/* Custom option */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: mode !== "custom" ? 1.01 : 1 }}
          whileTap={{ scale: mode !== "custom" ? 0.99 : 1 }}
          onClick={mode !== "custom" ? switchToCustom : undefined}
          className={cn(
            "w-full text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200",
            mode === "custom"
              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-md"
              : "border-border bg-card hover:border-muted-foreground/30 hover:shadow-sm"
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                mode === "custom"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {mode === "custom" ? (
                <Check className="h-5 w-5" strokeWidth={3} />
              ) : (
                <SlidersHorizontal className="h-5 w-5" strokeWidth={1.8} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-base">Personalizado</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Define tú mismo los porcentajes
              </p>

              {mode === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-3"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <CustomField
                      label="Necesidades"
                      value={needs}
                      color="#26be15"
                      onChange={(v) => updateCustom("needs", v)}
                    />
                    <CustomField
                      label="Deseos"
                      value={wants}
                      color="#e7964d"
                      onChange={(v) => updateCustom("wants", v)}
                    />
                    <CustomField
                      label="Ahorros"
                      value={savings}
                      color="#617dd5"
                      onChange={(v) => updateCustom("savings", v)}
                    />
                  </div>

                  <div className="flex h-2.5 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-300" style={{ width: `${needs}%`, backgroundColor: "#26be15" }} />
                    <div className="h-full transition-all duration-300" style={{ width: `${wants}%`, backgroundColor: "#e7964d" }} />
                    <div className="h-full transition-all duration-300" style={{ width: `${savings}%`, backgroundColor: "#617dd5" }} />
                  </div>

                  <div className={cn(
                    "text-xs font-semibold text-center",
                    isValid ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                  )}>
                    {isValid ? "✓ Suma 100%" : `La suma debe ser 100% (${total}% actual${diff !== 0 ? `, ${diff > 0 ? `sobra ${diff}%` : `faltan ${Math.abs(diff)}%`}` : ""})`}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.button>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Saltar — usar recomendado
        </button>
      </div>
    </motion.div>
  );
}

function CustomField({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-center" style={{ color }}>
        {label}
      </label>
      <div className="relative">
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="h-10 text-center text-sm font-bold tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
}
