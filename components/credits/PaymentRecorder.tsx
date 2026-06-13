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
import type { Loan } from "@/types";

const paymentSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  principalPaid: z.number().nonnegative("El capital no puede ser negativo"),
  interestPaid: z.number().nonnegative("El interés no puede ser negativo"),
  paidDate: z.string().min(1, "Fecha requerida"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

interface PaymentRecorderProps {
  loan: Loan;
  onRecord: (data: {
    amount: string;
    principalPaid: string;
    interestPaid: string;
    paidDate: Date;
  }) => Promise<void>;
  triggerRefresh: number;
}

export function PaymentRecorder({ loan, onRecord }: PaymentRecorderProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialAmount = parseFloat(loan.monthlyPayment) || 0;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: initialAmount,
      principalPaid: 0,
      interestPaid: 0,
      paidDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: PaymentForm) => {
    setIsSubmitting(true);
    try {
      await onRecord({
        amount: String(data.amount),
        principalPaid: String(data.principalPaid),
        interestPaid: String(data.interestPaid),
        paidDate: new Date(data.paidDate),
      });
      reset({
        amount: initialAmount,
        principalPaid: 0,
        interestPaid: 0,
        paidDate: new Date().toISOString().split("T")[0],
      });
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Registrar pago
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="relative bg-white dark:bg-[#17181c] rounded-2xl shadow-xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle>Registrar Pago Mensual</DialogTitle>
            <DialogClose onClick={() => setOpen(false)} />
          </DialogHeader>
          <DialogContent>
            <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Monto total pagado</Label>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="payment-amount"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                    placeholder="Ej: $ 500.000"
                  />
                )}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principal-paid">Capital pagado</Label>
                <Controller
                  name="principalPaid"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="principal-paid"
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                      placeholder="$ 0"
                    />
                  )}
                />
                {errors.principalPaid && (
                  <p className="text-sm text-destructive">{errors.principalPaid.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest-paid">Intereses pagados</Label>
                <Controller
                  name="interestPaid"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="interest-paid"
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                      placeholder="$ 0"
                    />
                  )}
                />
                {errors.interestPaid && (
                  <p className="text-sm text-destructive">{errors.interestPaid.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paid-date">Fecha de pago</Label>
              <Input
                id="paid-date"
                type="date"
                {...register("paidDate")}
              />
              {errors.paidDate && (
                <p className="text-sm text-destructive">{errors.paidDate.message}</p>
              )}
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" form="payment-form" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Pago"}
          </Button>
        </DialogFooter>
      </div>
      </Dialog>
    </>
  );
}
