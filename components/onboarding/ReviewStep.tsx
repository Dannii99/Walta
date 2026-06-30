"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, X, ArrowRight, Wallet, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { getCategoryIconComponent } from "@/lib/category-icons";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { CategoryType } from "@/types";

type Cat = {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  description?: string;
  plannedAmount: number | null;
};

interface ReviewStepProps {
  income: number;
  categories: Cat[];
  onCategoriesChange: (categories: Cat[]) => void;
  onSkipAll: () => void;
  onFinalize: () => void;
  onBack?: () => void;
  isSaving?: boolean;
}

const TYPE_ORDER: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS", "DEBT"];

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_TINTS: Record<CategoryType, string> = {
  NEEDS: "bg-[#26be15]/10 dark:bg-[#26be15]/20",
  WANTS: "bg-[#e7964d]/10 dark:bg-[#e7964d]/20",
  SAVINGS: "bg-[#617dd5]/10 dark:bg-[#617dd5]/20",
  DEBT: "bg-[#9333ea]/10 dark:bg-[#9333ea]/20",
};

const TYPE_FG: Record<CategoryType, string> = {
  NEEDS: "text-[#26be15] dark:text-[#4ade80]",
  WANTS: "text-[#e7964d] dark:text-[#fb923c]",
  SAVINGS: "text-[#617dd5] dark:text-[#60a5fa]",
  DEBT: "text-[#9333ea] dark:text-[#c084fc]",
};

const TYPE_BAR: Record<CategoryType, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

export function ReviewStep({
  income,
  categories,
  onCategoriesChange,
  onSkipAll,
  onFinalize,
  onBack,
  isSaving = false,
}: ReviewStepProps) {
  const [walkIndex, setWalkIndex] = useState(0);
  const [step, setStep] = useState<"walk" | "summary">("walk");
  const [showAdd, setShowAdd] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<CategoryType>("NEEDS");

  const orderedCats = useMemo(
    () =>
      [...categories].sort((a, b) => {
        const ai = TYPE_ORDER.indexOf(a.type);
        const bi = TYPE_ORDER.indexOf(b.type);
        return ai - bi;
      }),
    [categories]
  );

  const currentCat = orderedCats[walkIndex];
  const totalCats = orderedCats.length;
  const isOnAddTile = walkIndex === totalCats;

  useEffect(() => {
    if (walkIndex > totalCats) setWalkIndex(totalCats);
  }, [totalCats, walkIndex]);

  const updateAmount = (id: string, amount: number) => {
    onCategoriesChange(
      categories.map((c) => (c.id === id ? { ...c, plannedAmount: amount > 0 ? amount : null } : c))
    );
  };

  const goNext = () => {
    if (walkIndex < totalCats) setWalkIndex(walkIndex + 1);
    else setShowAdd(true);
  };

  const goSkipCat = () => {
    if (currentCat) updateAmount(currentCat.id, 0);
    goNext();
  };

  const finalize = () => {
    setStep("summary");
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed) return;
    const newCat: Cat = {
      id: `new-${Date.now()}`,
      name: trimmed,
      type: customType,
      icon: "Home",
      plannedAmount: null,
    };
    onCategoriesChange([...categories, newCat]);
    setCustomName("");
    setShowAdd(false);
    setStep("walk");
    setWalkIndex(categories.length);
  };

  if (step === "summary") {
    return (
      <SummaryView
        income={income}
        categories={orderedCats}
        isSaving={isSaving}
        onBack={() => setStep("walk")}
        onFinalize={onFinalize}
      />
    );
  }

  if (showAdd) {
    return (
      <AddCustomView
        customName={customName}
        setCustomName={setCustomName}
        customType={customType}
        setCustomType={setCustomType}
        onAdd={handleAddCustom}
        onCancel={() => setShowAdd(false)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {isOnAddTile ? "Opcional" : TYPE_LABELS[currentCat?.type ?? "NEEDS"]}
        </span>
        <button
          type="button"
          onClick={onSkipAll}
          disabled={isSaving}
          className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Saltar todo →
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Tus categorías</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configura cuánto planeas gastar en cada una, o salta para hacerlo después.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isOnAddTile ? (
          <motion.div
            key="add-tile"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-4 py-8 text-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border">
              <Plus className="h-8 w-8 text-muted-foreground" strokeWidth={2.2} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold">¿Agregar otra?</h3>
              <p className="text-xs text-muted-foreground max-w-[260px]">
                Define una categoría personalizada para tus necesidades específicas.
              </p>
            </div>
            <Button onClick={() => setShowAdd(true)} variant="outline" className="rounded-full gap-1.5">
              <Plus className="h-4 w-4" /> Agregar categoría
            </Button>
            <button
              type="button"
              onClick={finalize}
              className="text-xs font-bold text-primary hover:underline"
            >
              No, finalizar y ver resumen →
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={currentCat?.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-5"
          >
            <CategoryWalkCard cat={currentCat} onAmountChange={(amt) => updateAmount(currentCat.id, amt)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
          <span>Paso {Math.min(walkIndex + 1, totalCats + 1)} de {totalCats + 1}</span>
          <span>{income > 0 ? formatCOP(income) : ""}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(((walkIndex + 1) / (totalCats + 1)) * 100, 100)}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button
          variant="ghost"
          onClick={goSkipCat}
          disabled={isSaving}
          className="flex-1 rounded-full"
        >
          {isOnAddTile ? "Saltar" : "Omitir"}
        </Button>
        <Button
          onClick={goNext}
          disabled={isSaving}
          className="flex-1 gap-1.5 rounded-full"
        >
          {isOnAddTile ? "Finalizar" : "Siguiente"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CategoryWalkCard({
  cat,
  onAmountChange,
}: {
  cat: Cat;
  onAmountChange: (amount: number) => void;
}) {
  const Icon = getCategoryIconComponent(cat.icon);
  const type = cat.type as CategoryType;
  const [localAmount, setLocalAmount] = useState<number>(cat.plannedAmount ?? 0);

  useEffect(() => {
    setLocalAmount(cat.plannedAmount ?? 0);
  }, [cat.id, cat.plannedAmount]);

  return (
    <div className="flex flex-col items-center gap-4 py-2 text-center">
      <motion.div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-2xl",
          TYPE_TINTS[type]
        )}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Icon className={cn("h-10 w-10", TYPE_FG[type])} strokeWidth={1.8} />
      </motion.div>

      <div className="space-y-1">
        <h3 className="text-2xl font-extrabold tracking-tight">{cat.name}</h3>
        {cat.description && (
          <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-snug">
            {cat.description}
          </p>
        )}
      </div>

      <div className="w-full max-w-[280px] space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-left block">
          ¿Cuánto gastas en {cat.name}?
        </label>
        <CurrencyInput
          value={localAmount}
          onValueChange={(v) => {
            setLocalAmount(v);
            onAmountChange(v);
          }}
          placeholder="0"
          className="h-14 text-2xl font-bold text-center"
        />
      </div>
    </div>
  );
}

function AddCustomView({
  customName,
  setCustomName,
  customType,
  setCustomType,
  onAdd,
  onCancel,
}: {
  customName: string;
  setCustomName: (s: string) => void;
  customType: CategoryType;
  setCustomType: (t: CategoryType) => void;
  onAdd: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">Agregar categoría</h2>
        <p className="text-sm text-muted-foreground">
          Crea una categoría personalizada
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Nombre
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Ej. Mascota, Gimnasio..."
            className="flex h-12 w-full rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tipo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TYPE_ORDER.filter((t) => t !== "DEBT").map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCustomType(t)}
                className={cn(
                  "rounded-lg border px-3 py-2.5 text-xs font-bold transition-colors",
                  customType === t
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                )}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2.5">
        <Button variant="ghost" onClick={onCancel} className="flex-1 rounded-full">
          Cancelar
        </Button>
        <Button onClick={onAdd} disabled={!customName.trim()} className="flex-1 gap-1.5 rounded-full">
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>
    </motion.div>
  );
}

function SummaryView({
  income,
  categories,
  isSaving,
  onBack,
  onFinalize,
}: {
  income: number;
  categories: Cat[];
  isSaving: boolean;
  onBack: () => void;
  onFinalize: () => void;
}) {
  const totalAllocated = categories.reduce(
    (sum, c) => sum + (c.plannedAmount ?? 0),
    0
  );
  const filledCount = categories.filter((c) => c.plannedAmount !== null && c.plannedAmount > 0).length;
  const omitCount = categories.length - filledCount;

  const byType: Record<CategoryType, { allocated: number; count: number }> = {
    NEEDS: { allocated: 0, count: 0 },
    WANTS: { allocated: 0, count: 0 },
    SAVINGS: { allocated: 0, count: 0 },
    DEBT: { allocated: 0, count: 0 },
  };
  categories.forEach((c) => {
    byType[c.type].allocated += c.plannedAmount ?? 0;
    byType[c.type].count += 1;
  });

  const progressPct = income > 0 ? Math.min((totalAllocated / income) * 100, 100) : 0;
  const remaining = income - totalAllocated;
  const over = remaining < 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-5"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Resumen</h2>
        <p className="text-sm text-muted-foreground">
          Así queda tu presupuesto planeado
        </p>
      </div>

      <div className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm font-semibold">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            Total planeado
          </span>
          <span className={cn(
            "text-base font-extrabold tabular-nums",
            over ? "text-destructive" : "text-primary"
          )}>
            {formatCOP(totalAllocated)}
          </span>
        </div>

        <div className="h-2 w-full rounded-full overflow-hidden bg-muted">
          <motion.div
            className={cn(
              "h-full rounded-full",
              over ? "bg-destructive" : "bg-gradient-to-r from-primary/60 to-primary"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
          <span>Ingreso mensual</span>
          <span className="tabular-nums">{formatCOP(income)}</span>
        </div>

        {!over && remaining > 0 && (
          <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Disponible sin asignar</span>
            <span className="tabular-nums">{formatCOP(remaining)}</span>
          </div>
        )}

        {over && (
          <p className="text-xs text-destructive font-medium pt-1">
            Excede tu ingreso mensual por {formatCOP(Math.abs(remaining))}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Distribución por tipo
        </h3>
        <div className="flex h-3 rounded-full overflow-hidden">
          {TYPE_ORDER.filter((t) => byType[t].allocated > 0).map((t) => {
            const pct = totalAllocated > 0 ? (byType[t].allocated / totalAllocated) * 100 : 0;
            return (
              <motion.div
                key={t}
                style={{ backgroundColor: TYPE_BAR[t] }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {TYPE_ORDER.map((t) => {
            const data = byType[t];
            if (data.count === 0) return null;
            return (
              <div key={t} className="flex items-center justify-between rounded-lg border border-border px-2.5 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: TYPE_BAR[t] }}
                  />
                  <span className="text-[11px] font-semibold">{TYPE_LABELS[t]}</span>
                </div>
                <span className="text-[11px] font-bold tabular-nums">
                  {formatCOP(data.allocated)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
        <TrendingUp className="h-3 w-3" />
        <span>
          {filledCount} categorías con monto · {omitCount} omitidas
          {omitCount > 0 && " (puedes configurarlas después en Reglas)"}
        </span>
      </div>

      <div className="flex gap-2.5 pt-2">
        <Button variant="ghost" onClick={onBack} disabled={isSaving} className="flex-1 rounded-full">
          Atrás
        </Button>
        <Button
          onClick={onFinalize}
          disabled={isSaving}
          className="flex-1 gap-1.5 rounded-full"
        >
          {isSaving ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Guardando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Guardar y empezar
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}