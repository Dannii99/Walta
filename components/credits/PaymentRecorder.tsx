"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import type { Loan } from "@/types";

const paymentSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inv├ílido"),
  principalPaid: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inv├ílido"),
  interestPaid: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto inv├ílido"),
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: loan.monthlyPayment,
      principalPaid: "",
      interestPaid: "",
      paidDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: PaymentForm) => {
    setIsSubmitting(true);
    try {
      await onRecord({
        amount: data.amount,
        principalPaid: data.principalPaid,
        interestPaid: data.interestPaid,
        paidDate: new Date(data.paidDate),
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
        Registrar pago
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Registrar Pago Mensual</DialogTitle>
          <DialogClose onClick={() => setOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Monto total pagado</Label>
              <Input
                id="payment-amount"
                type="text"
                {...register("amount")}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principal-paid">Capital pagado</Label>
                <Input
                  id="principal-paid"
                  type="text"
                  {...register("principalPaid")}
                />
                {errors.principalPaid && (
                  <p className="text-sm text-destructive">{errors.principalPaid.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest-paid">Inter├®s pagado</Label>
                <Input
                  id="interest-paid"
                  type="text"
                  {...register("interestPaid")}
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
      </Dialog>
    </>
  );
}
