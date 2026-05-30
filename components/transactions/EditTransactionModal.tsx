"use client";

import { useEffect } from "react";
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
import { Select } from "@/components/ui/select";
import { updateTransaction } from "@/server/actions/transaction-actions";
import type { Transaction, Category } from "@/types";

const editTransactionSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categora"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto invlido"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Fecha requerida"),
});

type EditTransactionForm = z.infer<typeof editTransactionSchema>;

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: (Transaction & { category?: Category }) | null;
  categories: Category[];
  onSuccess: () => void;
}

export function EditTransactionModal({
  open,
  onOpenChange,
  transaction,
  categories,
  onSuccess,
}: EditTransactionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTransactionForm>({
    resolver: zodResolver(editTransactionSchema),
  });

  useEffect(() => {
    if (transaction) {
      reset({
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        description: transaction.description ?? "",
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    }
  }, [transaction, reset]);

  const onSubmit = async (data: EditTransactionForm) => {
    if (!transaction) return;
    await updateTransaction(transaction.id, {
      categoryId: data.categoryId,
      amount: data.amount,
      description: data.description || null,
      date: new Date(data.date),
    });
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Editar Transaccin</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form id="edit-transaction-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-category">Categora</Label>
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
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descripcin</Label>
            <Input
              id="edit-description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">Fecha</Label>
            <Input
              id="edit-date"
              type="date"
              {...register("date")}
            />
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
        <Button type="submit" form="edit-transaction-form" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
