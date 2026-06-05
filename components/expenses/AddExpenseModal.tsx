"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { CategorySelect } from "@/components/expenses/CategorySelect";
import { createTransaction } from "@/server/actions/transaction-actions";
import { RECURRENCE_DESCRIPTIONS, formatDateForInput } from "@/lib/recurrence";
import type { Category, Recurrence } from "@/types";

const addExpenseSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categorÃ­a"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Selecciona una fecha"),
  recurrence: z.enum(["MONTHLY", "BIWEEKLY", "ONE_TIME"]),
});

type AddExpenseForm = z.infer<typeof addExpenseSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSuccess: () => void;
}

const RECURRENCE_ORDER: Recurrence[] = ["MONTHLY", "BIWEEKLY", "ONE_TIME"];

function amountLabel(recurrence: Recurrence): string {
  if (recurrence === "BIWEEKLY") return "Monto (por pago)";
  if (recurrence === "ONE_TIME") return "Monto total";
  return "Monto mensual";
}

function amountHint(recurrence: Recurrence): string | null {
  if (recurrence === "BIWEEKLY") {
    return "Se multiplicarÃ¡ Ã—2 al guardar para reflejar el impacto mensual real.";
  }
  if (recurrence === "ONE_TIME") {
    return "Cargo Ãºnico. No se prorratea a lo largo del mes.";
  }
  return null;
}

export function AddExpenseModal({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddExpenseModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AddExpenseForm>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      categoryId: "",
      amount: 0,
      description: "",
      date: formatDateForInput(new Date()),
      recurrence: "MONTHLY",
    },
  });

  const recurrence = useWatch({ control, name: "recurrence" }) ?? "MONTHLY";
  const amountHintText = amountHint(recurrence as Recurrence);

  const onSubmit = async (data: AddExpenseForm) => {
    const dateObj = new Date(data.date + "T12:00:00");
    try {
      await createTransaction(
        data.categoryId,
        data.amount,
        data.description || null,
        dateObj,
        data.recurrence
      );
      toast.success("Gasto agregado");
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("No pudimos guardar el gasto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Agregar Gasto</DialogTitle>
        <DialogClose onClick={() => onOpenChange(false)} />
      </DialogHeader>
      <DialogContent>
        <form
          id="add-expense-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="add-category">CategorÃ­a</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <CategorySelect
                  id="add-category"
                  value={field.value}
                  onValueChange={field.onChange}
                  categories={categories}
                  placeholder="Seleccionar..."
                />
              )}
            />
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-amount">
              {amountLabel(recurrence as Recurrence)}
            </Label>
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
            {amountHintText && (
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{amountHintText}</span>
              </p>
            )}
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="add-recurrence">Frecuencia</Label>
              <Controller
                name="recurrence"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="add-recurrence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECURRENCE_ORDER.map((r) => (
                        <SelectItem key={r} value={r}>
                          {RECURRENCE_DESCRIPTIONS[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.recurrence && (
                <p className="text-sm text-destructive">
                  {errors.recurrence.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-date">Fecha del cargo</Label>
              <Input id="add-date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-sm text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-description">DescripciÃ³n (opcional)</Label>
            <Input
              id="add-description"
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
          form="add-expense-form"
          disabled={isSubmitting}
          className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {isSubmitting ? "Guardando..." : "Agregar"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

