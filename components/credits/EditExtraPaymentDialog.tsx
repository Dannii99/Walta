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
import type { LoanExtraPayment } from "@/types";

const editExtraSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  date: z.string().min(1, "Fecha requerida"),
});

type EditExtraForm = z.infer<typeof editExtraSchema>;

interface EditExtraPaymentDialogProps {
  extra: LoanExtraPayment | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: { amount: string; date: Date }) => Promise<void>;
}

export function EditExtraPaymentDialog({
  extra,
  onOpenChange,
  onUpdate,
}: EditExtraPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditExtraForm>({
    resolver: zodResolver(editExtraSchema),
    defaultValues: {
      amount: 0,
      date: "",
    },
  });

  useEffect(() => {
    if (extra) {
      reset({
        amount: parseFloat(extra.amount),
        date: formatDateForInput(extra.date),
      });
    }
  }, [extra, reset]);

  if (!extra) return null;

  const onSubmit = async (data: EditExtraForm) => {
    setIsSubmitting(true);
    try {
      await onUpdate({
        amount: String(data.amount),
        date: new Date(data.date),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!extra} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Editar abono a capital</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form id="edit-extra-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-extra-date">Fecha del abono</Label>
            <Input id="edit-extra-date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" form="edit-extra-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
