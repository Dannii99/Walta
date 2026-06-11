"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { cn } from "@/lib/utils";
import { Clock, TrendingDown } from "lucide-react";

const extraSchema = z
  .object({
    amount: z.number().positive("El monto debe ser mayor a 0"),
    date: z.string().min(1, "Fecha requerida"),
    note: z.string().max(500).optional(),
    recalculationMode: z.enum(["REDUCE_TERM", "REDUCE_PAYMENT"]),
    newTermMonths: z.number().int().min(1).max(360).nullable().optional(),
  })
  .refine(
    (d) =>
      d.recalculationMode !== "REDUCE_PAYMENT" ||
      (d.newTermMonths != null && d.newTermMonths >= 1),
    {
      message: "Indica el nuevo plazo en meses",
      path: ["newTermMonths"],
    }
  );

type ExtraForm = z.infer<typeof extraSchema>;

export interface CapitalContributionSubmitData {
  amount: string;
  date: Date;
  note?: string | null;
  recalculationMode: "REDUCE_TERM" | "REDUCE_PAYMENT";
  newTermMonths?: number | null;
}

interface CapitalContributionFormProps {
  onRecord: (data: CapitalContributionSubmitData) => Promise<void>;
  triggerRefresh: number;
  /** Modo controlado: el padre maneja el estado del Dialog. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Oculta el botón trigger (cuando se usa dentro de un Dialog externo). */
  hideTrigger?: boolean;
  /** Descripción opcional que se renderiza dentro del DialogContent. */
  description?: React.ReactNode;
  /** Meses restantes al momento del abono (para el default del nuevo plazo). */
  remainingTermMonths?: number;
  /** Pre-fill desde el simulador de impacto. */
  initialAmount?: number;
  initialMode?: "REDUCE_TERM" | "REDUCE_PAYMENT";
  initialNewTerm?: number | null;
}

export function CapitalContributionForm({
  onRecord,
  open: openProp,
  onOpenChange,
  hideTrigger = false,
  description,
  remainingTermMonths,
  initialAmount,
  initialMode,
  initialNewTerm,
}: CapitalContributionFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExtraForm>({
    resolver: zodResolver(extraSchema),
    defaultValues: {
      amount: 1000000,
      date: new Date().toISOString().split("T")[0],
      note: "",
      recalculationMode: "REDUCE_TERM",
      newTermMonths: remainingTermMonths ?? null,
    },
  });

  const mode = watch("recalculationMode");

  // Sincroniza el prefill del simulador SOLO cuando el dialog se abre.
  // Evita re-sincs en cada keystroke y respeta la regla de react-hooks/exhaustive-deps.
  useEffect(() => {
    if (!open) return;
    if (initialAmount !== undefined) {
      setValue("amount", initialAmount, { shouldDirty: true });
    }
    if (initialMode !== undefined) {
      setValue("recalculationMode", initialMode, { shouldDirty: true });
    }
    if (initialNewTerm !== undefined) {
      setValue("newTermMonths", initialNewTerm, { shouldDirty: true });
    }
    // `open` se incluye para que el efecto se dispare solo en transición false→true.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = async (data: ExtraForm) => {
    setIsSubmitting(true);
    try {
      await onRecord({
        amount: String(data.amount),
        date: new Date(data.date),
        note: data.note || null,
        recalculationMode: data.recalculationMode,
        newTermMonths: data.newTermMonths ?? null,
      });
      reset({
        amount: 1000000,
        date: new Date().toISOString().split("T")[0],
        note: "",
        recalculationMode: "REDUCE_TERM",
        newTermMonths: remainingTermMonths ?? null,
      });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!hideTrigger && (
        <Button variant="outline" onClick={() => setOpen(true)}>
          Abono a capital
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="relative bg-white dark:bg-[#17181c] rounded-2xl shadow-xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle>Abono a Capital</DialogTitle>
            <DialogClose onClick={() => setOpen(false)} />
          </DialogHeader>
          <DialogContent>
            {description && (
              <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}
            <form
              id="extra-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
            <div className="space-y-2">
              <Label htmlFor="extra-amount">Monto del abono</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="extra-amount"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra-date">Fecha del abono</Label>
              <Input id="extra-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Efecto del abono</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setValue("recalculationMode", "REDUCE_TERM")}
                  data-active={mode === "REDUCE_TERM"}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    mode === "REDUCE_TERM"
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                  )}
                >
                  <Clock
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      mode === "REDUCE_TERM"
                        ? "text-primary"
                        : "text-stone-500"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                      Reducir plazo
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Misma cuota, pagas menos meses.
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setValue("recalculationMode", "REDUCE_PAYMENT")}
                  data-active={mode === "REDUCE_PAYMENT"}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                    mode === "REDUCE_PAYMENT"
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
                  )}
                >
                  <TrendingDown
                    className={cn(
                      "h-4 w-4 mt-0.5 shrink-0",
                      mode === "REDUCE_PAYMENT"
                        ? "text-primary"
                        : "text-stone-500"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                      Reducir cuota
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Recalcula la cuota sobre el saldo restante.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {mode === "REDUCE_PAYMENT" && (
              <div className="space-y-2">
                <Label htmlFor="extra-new-term">Nuevo plazo restante (meses)</Label>
                <Input
                  id="extra-new-term"
                  type="number"
                  min={1}
                  max={360}
                  step={1}
                  placeholder={
                    remainingTermMonths ? String(remainingTermMonths) : "48"
                  }
                  {...register("newTermMonths", { valueAsNumber: true })}
                />
                {remainingTermMonths != null && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Plazo restante actual: {remainingTermMonths} meses
                  </p>
                )}
                {errors.newTermMonths && (
                  <p className="text-sm text-destructive">
                    {errors.newTermMonths.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="extra-note">Nota (opcional)</Label>
              <Input
                id="extra-note"
                placeholder="Ej: Bono de fin de año"
                {...register("note")}
              />
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="extra-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Registrar Abono"}
          </Button>
        </DialogFooter>
        </div>
      </Dialog>
    </>
  );
}
