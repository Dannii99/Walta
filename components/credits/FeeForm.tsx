"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
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
            Valor
          </label>
          <div className="mt-1">
            <CurrencyInput
              value={amount}
              onValueChange={setAmount}
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Tipo de cobro
          </label>
          <div className="mt-1 flex rounded-md border border-input overflow-hidden">
            <button
              type="button"
              onClick={() => setType("monthly")}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                type === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Cobrar mensualmente
            </button>
            <button
              type="button"
              onClick={() => setType("upfront")}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                type === "upfront"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Pagar de una vez
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
