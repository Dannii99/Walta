"use client";

import { useState } from "react";
import { Check, X, Info, CalendarDays, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { cn } from "@/lib/utils";
import { formatCOP } from "@/lib/currency";
import { ANNUAL_TO_MONTHLY } from "@/lib/loan-fees";
import type { FeeItem } from "@/types";

interface FeeFormProps {
  initialFee?: FeeItem;
  onSave: (fee: FeeItem) => void;
  onCancel: () => void;
}

export function FeeForm({ initialFee, onSave, onCancel }: FeeFormProps) {
  const [name, setName] = useState(initialFee?.name ?? "");
  const [amount, setAmount] = useState(initialFee?.amount ?? 0);
  const [type, setType] = useState<"monthly" | "upfront">(
    initialFee?.type ?? "monthly"
  );

  const handleSave = () => {
    if (!name.trim() || amount <= 0) return;
    onSave({
      id: initialFee?.id ?? crypto.randomUUID(),
      name: name.trim(),
      amount,
      type,
    });
  };

  const isValid = name.trim().length > 0 && amount > 0;
  const monthlyEquivalent = type === "monthly" ? amount / ANNUAL_TO_MONTHLY : 0;
  const amountLabel = type === "monthly" ? "Valor anual" : "Valor único";

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Nombre del cargo
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. seguro de vida, aval, comisión..."
            className="mt-1 h-9"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            {amountLabel}
          </label>
          <div className="mt-1">
            <CurrencyInput
              value={amount}
              onValueChange={setAmount}
              placeholder="0"
            />
          </div>
          {type === "monthly" && amount > 0 && (
            <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 flex items-start gap-1.5">
              <Info
                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                Se divide entre {ANNUAL_TO_MONTHLY} →{" "}
                <span className="font-semibold text-foreground">
                  {formatCOP(monthlyEquivalent)}/mes
                </span>{" "}
                durante todo el crédito.
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Tipo de cobro
          </label>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("monthly")}
              aria-pressed={type === "monthly"}
              className={cn(
                "rounded-xl border-2 p-3 text-left transition-colors",
                type === "monthly"
                  ? "border-primary bg-primary/5"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
              )}
            >
              <CalendarDays
                className={cn(
                  "h-4 w-4 mb-1.5",
                  type === "monthly" ? "text-primary" : "text-stone-500"
                )}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold">Cobro mensual</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                Se suma a tu cuota todo el crédito. Valor anual ÷ {ANNUAL_TO_MONTHLY}.
              </p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 italic">
                Ej: seguro de vida, aval
              </p>
            </button>
            <button
              type="button"
              onClick={() => setType("upfront")}
              aria-pressed={type === "upfront"}
              className={cn(
                "rounded-xl border-2 p-3 text-left transition-colors",
                type === "upfront"
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                  : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
              )}
            >
              <Receipt
                className={cn(
                  "h-4 w-4 mb-1.5",
                  type === "upfront" ? "text-amber-600" : "text-stone-500"
                )}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold">Pago único</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                Se cobra una sola vez. Suma al costo total.
              </p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 italic">
                Ej: papelería, estudio crédito
              </p>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="mr-1 h-3.5 w-3.5" />
            Cancelar
          </Button>
          <Button size="sm" disabled={!isValid} onClick={handleSave}>
            <Check className="mr-1 h-3.5 w-3.5" />
            Guardar
          </Button>
        </div>
      </div>
    </div>
  );
}
