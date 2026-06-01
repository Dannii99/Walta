"use client";

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
import { Select } from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { createTransaction } from "@/server/actions/transaction-actions";
import type { Category } from "@/types";

const addTransactionSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(500).optional(),
  recurrence: z.enum(["MONTHLY", "BIWEEKLY", "ONE_TIME"]),
});

type AddTransactionForm = z.infer<typeof addTransactionSchema>;

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

export function AddTransactionModal({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddTransactionModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AddTransactionForm>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      amount: 0,
      recurrence: "MONTHLY",
    },
  });

  const onSubmit = async (data: AddTransactionForm) => {
    await createTransaction(
      data.categoryId,
      data.amount,
      data.description || null,
      new Date(),
      data.recurrence
    );
    reset();
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Agregar Transacción</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form id="add-transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-category">Categoría</Label>
            <Select
              id="add-category"
              {...register("categoryId")}
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-amount">Monto</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="add-amount"
                  value={field.value || 0}
                  onValueChange={(v) => field.onChange(v)}
                  placeholder="0"
                />
              )}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-recurrence">Frecuencia</Label>
            <Select
              id="add-recurrence"
              {...register("recurrence")}
              defaultValue="MONTHLY"
            >
              <option value="MONTHLY">Mensual</option>
              <option value="BIWEEKLY">Quincenal</option>
              <option value="ONE_TIME">Única</option>
            </Select>
            {errors.recurrence && (
              <p className="text-sm text-destructive">{errors.recurrence.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-description">Descripción</Label>
            <Input
              id="add-description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" form="add-transaction-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Agregar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
