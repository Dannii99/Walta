"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, SlidersHorizontal, Sparkles, Home, Heart, PiggyBank, Scale, Gauge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BudgetRule } from "@/types";

const CATEGORY_COLORS = {
  needs: "#e11d48",
  wants: "#10b981",
  savings: "#8b5cf6",
} as const;

const CATEGORY_LABELS = {
  needs: "necesidades",
  wants: "deseos",
  savings: "ahorros",
} as const;

interface PresetTheme {
  border: string;
  bg: string;
  iconGradient: string;
  iconLight: string;
  accent: string;
}

const PRESET_THEMES: Record<string, PresetTheme> = {
  balanced: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/8",
    iconGradient: "bg-gradient-to-br from-blue-500 to-indigo-500",
    iconLight: "text-blue-300",
    accent: "#3b82f6",
  },
  saver: {
    border: "border-emerald-500/50",
    bg: "bg-emerald-500/8",
    iconGradient: "bg-gradient-to-br from-emerald-500 to-teal-500",
    iconLight: "text-emerald-300",
    accent: "#10b981",
  },
};

const CUSTOM_THEME: PresetTheme = {
  border: "border-violet-500/50",
  bg: "bg-violet-500/8",
  iconGradient: "bg-gradient-to-br from-purple-500 to-violet-500",
  iconLight: "text-violet-300",
  accent: "#8b5cf6",
};

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
    icon: Scale,
    recommended: true,
  },
  {
    id: "saver",
    label: "Ahorrador",
    description: "40% necesidades · 30% deseos · 30% ahorros",
    rule: { needs: 40, wants: 30, savings: 30 },
    icon: Gauge,
  },
];

interface RuleStepProps {
  rule: BudgetRule;
  onRuleChange: (rule: BudgetRule) => void;
}

function ColoredDescription({ rule }: { rule: BudgetRule }) {
  const parts: { value: number; key: keyof typeof CATEGORY_COLORS }[] = [
    { value: rule.needs, key: "needs" },
    { value: rule.wants, key: "wants" },
    { value: rule.savings, key: "savings" },
  ];

  return (
    <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/50">
      {parts.map((p, i) => (
        <span key={p.key}>
          <span className="font-semibold text-foreground/80 dark:text-white/80">{p.value}%</span>
          <span className="text-muted-foreground/60 dark:text-white/40"> {CATEGORY_LABELS[p.key]}</span>
          {i < parts.length - 1 && <span className="text-muted-foreground/40 dark:text-white/20"> · </span>}
        </span>
      ))}
    </p>
  );
}

export function RuleStep({ rule, onRuleChange }: RuleStepProps) {
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
      className="space-y-4"
    >
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          Distribuye tus ingresos
        </h2>
        <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Elige cómo dividir tus ingresos.
        </p>
      </div>

      <div className="space-y-2.5">
        {OPTIONS.map((opt, index) => {
          const isSelected = selectedId === opt.id && mode === "preset";
          const Icon = opt.icon;
          const theme = PRESET_THEMES[opt.id];
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
                "w-full text-left rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200 relative overflow-hidden",
                isSelected
                  ? `${theme.border} ${theme.bg} shadow-md`
                  : "border-border/50 dark:border-white/10 bg-muted/50 dark:bg-white/5 hover:border-border dark:hover:border-white/20 hover:shadow-sm"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300",
                    theme.iconGradient
                  )}
                >
                  {isSelected ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={2.2} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground dark:text-white">{opt.label}</span>
                    {opt.recommended && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <Sparkles className="h-2.5 w-2.5" />
                        Recomendado
                      </span>
                    )}
                  </div>
                  <ColoredDescription rule={opt.rule} />

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2.5 flex h-2 rounded-full overflow-hidden"
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.needs}%`, backgroundColor: CATEGORY_COLORS.needs }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.wants}%`, backgroundColor: CATEGORY_COLORS.wants }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${opt.rule.savings}%`, backgroundColor: CATEGORY_COLORS.savings }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: mode !== "custom" ? 1.01 : 1 }}
          whileTap={{ scale: mode !== "custom" ? 0.99 : 1 }}
          onClick={mode !== "custom" ? switchToCustom : undefined}
          className={cn(
            "w-full text-left rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200",
            mode === "custom"
              ? `${CUSTOM_THEME.border} ${CUSTOM_THEME.bg} shadow-md`
              : "border-border/50 dark:border-white/10 bg-muted/50 dark:bg-white/5 hover:border-border dark:hover:border-white/20 hover:shadow-sm"
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-all duration-300",
                CUSTOM_THEME.iconGradient
              )}
            >
              {mode === "custom" ? (
                <Check className="h-4 w-4" strokeWidth={3} />
              ) : (
                <SlidersHorizontal className="h-4 w-4" strokeWidth={2.2} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-sm text-foreground dark:text-white">Personalizado</span>
              <p className="mt-0.5 text-[11px] text-muted-foreground dark:text-white/50">
                Define tú mismo los porcentajes
              </p>

              {mode === "custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 space-y-2.5"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <CustomField
                      label="Necesidades"
                      value={needs}
                      color={CATEGORY_COLORS.needs}
                      icon={Home}
                      onChange={(v) => updateCustom("needs", v)}
                    />
                    <CustomField
                      label="Deseos"
                      value={wants}
                      color={CATEGORY_COLORS.wants}
                      icon={Heart}
                      onChange={(v) => updateCustom("wants", v)}
                    />
                    <CustomField
                      label="Ahorros"
                      value={savings}
                      color={CATEGORY_COLORS.savings}
                      icon={PiggyBank}
                      onChange={(v) => updateCustom("savings", v)}
                    />
                  </div>

                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-300" style={{ width: `${needs}%`, backgroundColor: CATEGORY_COLORS.needs }} />
                    <div className="h-full transition-all duration-300" style={{ width: `${wants}%`, backgroundColor: CATEGORY_COLORS.wants }} />
                    <div className="h-full transition-all duration-300" style={{ width: `${savings}%`, backgroundColor: CATEGORY_COLORS.savings }} />
                  </div>

                  <div className={cn(
                    "text-[11px] font-semibold text-center",
                    isValid ? "text-emerald-400" : "text-destructive"
                  )}>
                    {isValid ? "Suma 100%" : `La suma debe ser 100% (${total}% actual${diff !== 0 ? `, ${diff > 0 ? `sobra ${diff}%` : `faltan ${Math.abs(diff)}%`}` : ""})`}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

function CustomField({
  label,
  value,
  color,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-lg shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${color}cc, ${color}60)`,
            color: "#fff",
          }}
        >
          <Icon className="h-3 w-3" strokeWidth={2.5} />
        </div>
        <label className="block text-[10px] font-bold tracking-wider text-center" style={{ color }}>
          {label}
        </label>
      </div>
      <div className="relative">
        <Input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="h-9 text-center text-sm font-bold tabular-nums bg-muted/40 dark:bg-white/5 border-border/60 dark:border-white/10 text-foreground dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-2 focus-visible:ring-offset-0 transition-all duration-200"
          onFocus={(e) => e.target.style.borderColor = color}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground/50 dark:text-white/40 pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
}
