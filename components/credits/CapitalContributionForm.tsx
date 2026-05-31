"use client";

import { useState } from "react";
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
// Loan type no longer needed after removing loan prop

const extraSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  date: z.string().min(1, "Fecha requerida"),
  note: z.string().max(500).optional(),
});

type ExtraForm = z.infer<typeof extraSchema>;

interface CapitalContributionFormProps {
  onRecord: (data: { amount: string; date: Date; note?: string | null }) => Promise<void>;
  triggerRefresh: number;
}

export function CapitalContributionForm({ onRecord }: CapitalContributionFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ExtraForm>({
    resolver: zodResolver(extraSchema),
    defaultValues: {
      amount: 1000000,
      date: new Date().toISOString().split("T")[0],
      note: "",
    },
  });

  const onSubmit = async (data: ExtraForm) => {
    setIsSubmitting(true);
    try {
      await onRecord({
        amount: String(data.amount),
        date: new Date(data.date),
        note: data.note || null,
      });
      reset();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Abono a capital
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Abono a Capital</DialogTitle>
          <DialogClose onClick={() => setOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <form id="extra-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra-date">Fecha del abono</Label>
              <Input id="extra-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra-note">Nota (opcional)</Label>
              <Input
                id="extra-note"
                placeholder="Ej: Bono de fin de a├▒o"
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
      </Dialog>
    </>
  );
}
