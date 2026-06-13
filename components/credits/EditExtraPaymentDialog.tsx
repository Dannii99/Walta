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
import { formatDateForInput } from "@/lib/recurrence";
import { cn } from "@/lib/utils";
import { Clock, TrendingDown } from "lucide-react";
import type { LoanExtraPayment } from "@/types";

type RecalcMode = "REDUCE_TERM" | "REDUCE_PAYMENT";

const editExtraSchema = z
  .object({
    amount: z.number().positive("El monto debe ser mayor a 0"),
    date: z.string().min(1, "Fecha requerida"),
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

type EditExtraForm = z.infer<typeof editExtraSchema>;

interface EditExtraPaymentDialogProps {
  extra: LoanExtraPayment | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: {
    amount: string;
    date: Date;
    recalculationMode: RecalcMode;
    newTermMonths: number | null;
  }) => Promise<void>;
  remainingTermMonths?: number;
}

export function EditExtraPaymentDialog({
  extra,
  onOpenChange,
  onUpdate,
  remainingTermMonths,
}: EditExtraPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditExtraForm>({
    resolver: zodResolver(editExtraSchema),
    defaultValues: {
      amount: 0,
      date: "",
      recalculationMode: "REDUCE_TERM",
      newTermMonths: null,
    },
  });

  const mode = watch("recalculationMode");

  useEffect(() => {
    if (extra) {
      reset({
        amount: parseFloat(extra.amount),
        date: formatDateForInput(extra.date),
        recalculationMode: extra.recalculationMode ?? "REDUCE_TERM",
        newTermMonths:
          extra.newTermMonths ?? remainingTermMonths ?? null,
      });
    }
  }, [extra, remainingTermMonths, reset]);

  if (!extra) return null;

  const onSubmit = async (data: EditExtraForm) => {
    setIsSubmitting(true);
    try {
      await onUpdate({
        amount: String(data.amount),
        date: new Date(data.date),
        recalculationMode: data.recalculationMode,
        newTermMonths: data.newTermMonths ?? null,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!extra} onOpenChange={onOpenChange}>
      <div className="relative bg-white dark:bg-[#17181c] rounded-2xl shadow-xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Editar abono a capital</DialogTitle>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <DialogContent>
          <form
            id="edit-extra-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
          <div className="space-y-2">
            <Label htmlFor="edit-extra-amount">Monto del abono</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="edit-extra-amount"
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
            <Label htmlFor="edit-extra-date">Fecha del abono</Label>
            <Input id="edit-extra-date" type="date" {...register("date")} />
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
                    mode === "REDUCE_TERM" ? "text-primary" : "text-stone-500"
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
                onClick={() =>
                  setValue("recalculationMode", "REDUCE_PAYMENT")
                }
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
              <Label htmlFor="edit-extra-new-term">Nuevo plazo restante (meses)</Label>
              <Input
                id="edit-extra-new-term"
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
        </form>
      </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-extra-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </div>
      </Dialog>
  );
}
