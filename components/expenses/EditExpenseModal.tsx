"use client";

import { useEffect } from "react";
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
import { updateTransaction } from "@/server/actions/transaction-actions";
import type { Transaction, Category } from "@/types";

const editExpenseSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(500).optional(),
  recurrence: z.enum(["MONTHLY", "BIWEEKLY", "ONE_TIME"]),
});

type EditExpenseForm = z.infer<typeof editExpenseSchema>;

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: (Transaction & { category?: Category }) | null;
  categories: Category[];
  onSuccess: () => void;
}

export function EditExpenseModal({
  open,
  onOpenChange,
  transaction,
  categories,
  onSuccess,
}: EditExpenseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EditExpenseForm>({
    resolver: zodResolver(editExpenseSchema),
  });

  useEffect(() => {
    if (transaction) {
      reset({
        categoryId: transaction.categoryId,
        amount: Number(transaction.amount),
        description: transaction.description ?? "",
        recurrence: transaction.recurrence,
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: EditExpenseForm) => {
    if (!transaction) return;
    await updateTransaction(transaction.id, {
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description || null,
      recurrence: data.recurrence,
    });
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Editar Gasto</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form id="edit-expense-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoría</Label>
            <Select
              id="edit-category"
              {...register("categoryId")}
            >
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
            <Label htmlFor="edit-amount">Monto</Label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="edit-amount"
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
            <Label htmlFor="edit-recurrence">Frecuencia</Label>
            <Select
              id="edit-recurrence"
              {...register("recurrence")}
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
            <Label htmlFor="edit-description">Descripción</Label>
            <Input
              id="edit-description"
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
        <Button type="submit" form="edit-expense-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
