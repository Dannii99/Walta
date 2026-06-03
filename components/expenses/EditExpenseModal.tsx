"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { RECURRENCE_DESCRIPTIONS, formatDateForInput } from "@/lib/recurrence";
import type { Category, Recurrence, Transaction } from "@/types";

const editExpenseSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Selecciona una fecha"),
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

const RECURRENCE_ORDER: Recurrence[] = ["MONTHLY", "BIWEEKLY", "ONE_TIME"];

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
        date: formatDateForInput(transaction.date),
        recurrence: transaction.recurrence,
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: EditExpenseForm) => {
    if (!transaction) return;
    const dateObj = new Date(data.date + "T12:00:00");
    try {
      await updateTransaction(transaction.id, {
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description || null,
        date: dateObj,
        recurrence: data.recurrence,
      });
      toast.success("Cambios guardados");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("No pudimos guardar los cambios");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Editar Gasto</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form
          id="edit-expense-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="edit-category">Categoría</Label>
            <Select id="edit-category" {...register("categoryId")}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-recurrence">Frecuencia</Label>
              <Select id="edit-recurrence" {...register("recurrence")}>
                {RECURRENCE_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {RECURRENCE_DESCRIPTIONS[r]}
                  </option>
                ))}
              </Select>
              {errors.recurrence && (
                <p className="text-sm text-destructive">
                  {errors.recurrence.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Fecha del cargo</Label>
              <Input id="edit-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripción (opcional)</Label>
            <Input
              id="edit-description"
              placeholder="Ej. Netflix, Mercado del mes, Gasolina..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form="edit-expense-form"
          disabled={isSubmitting}
          className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
