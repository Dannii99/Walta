"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { updateTransaction } from "@/server/actions/transaction-actions";
import {
  RECURRENCE_DESCRIPTIONS,
  formatDateForInput,
  getPerPaymentAmount,
  toStoredAmount,
} from "@/lib/recurrence";
import type { Category, Recurrence, Transaction } from "@/types";

const editExpenseSchema = z.object({
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(120).optional(),
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

function amountLabel(recurrence: Recurrence): string {
  if (recurrence === "BIWEEKLY") return "Monto (por pago)";
  if (recurrence === "ONE_TIME") return "Monto total";
  return "Monto mensual";
}

function amountHint(recurrence: Recurrence): string | null {
  if (recurrence === "BIWEEKLY") {
    return "Se multiplicará ×2 al guardar para reflejar el impacto mensual real.";
  }
  if (recurrence === "ONE_TIME") {
    return "Cargo único. No se prorratea a lo largo del mes.";
  }
  return null;
}

interface FormBodyProps {
  transaction: (Transaction & { category?: Category }) | null;
  categories: Category[];
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
  onSubmittingChange: (submitting: boolean) => void;
}

function FormBody({
  transaction,
  categories,
  onSuccess,
  onOpenChange,
  onSubmittingChange,
}: FormBodyProps) {
  const isEdit = !!transaction;

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditExpenseForm>({
    resolver: zodResolver(editExpenseSchema),
    defaultValues: isEdit && transaction
      ? {
          categoryId: transaction.categoryId,
          amount: getPerPaymentAmount(
            Number(transaction.amount),
            transaction.recurrence as Recurrence
          ),
          description: transaction.description ?? "",
          date: formatDateForInput(transaction.date),
          recurrence: transaction.recurrence as Recurrence,
        }
      : {
          categoryId: "",
          amount: 0,
          description: "",
          date: formatDateForInput(new Date()),
          recurrence: "MONTHLY",
        },
  });

  const lastLoadedRecurrence = useRef<Recurrence | null>(
    isEdit && transaction ? (transaction.recurrence as Recurrence) : null
  );

  useEffect(() => {
    onSubmittingChange(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  const recurrence =
    useWatch({ control, name: "recurrence" }) ?? "MONTHLY";
  const amountHintText = amountHint(recurrence as Recurrence);

  useEffect(() => {
    const last = lastLoadedRecurrence.current;
    if (!last || !transaction) return;
    if (last === recurrence) return;
    const currentAmount = Number(control._formValues.amount ?? 0);
    const stored = toStoredAmount(currentAmount, last);
    const next = getPerPaymentAmount(stored, recurrence as Recurrence);
    setValue("amount", next, { shouldDirty: true });
    lastLoadedRecurrence.current = recurrence as Recurrence;
  }, [recurrence, transaction, control, setValue]);

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
    <form
      id="edit-expense-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="edit-category">Categoría</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <CategorySelect
              id="edit-category"
              value={field.value}
              onValueChange={field.onChange}
              categories={categories}
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
        <Label htmlFor="edit-amount">
          {amountLabel(recurrence as Recurrence)}
        </Label>
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              id="edit-amount"
              value={field.value || 0}
              onValueChange={(v) => field.onChange(v)}
              placeholder="0"
              maxLength={15}
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
          <Label htmlFor="edit-recurrence">Frecuencia</Label>
          <Controller
            name="recurrence"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="edit-recurrence">
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
          maxLength={120}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
    </form>
  );
}

export function EditExpenseModal({
  open,
  onOpenChange,
  transaction,
  categories,
  onSuccess,
}: EditExpenseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmittingChange = useCallback(
    (submitting: boolean) => setIsSubmitting(submitting),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="relative bg-white dark:bg-[#17181c] rounded-2xl shadow-xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle>Editar Gasto</DialogTitle>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <DialogContent>
          <FormBody
            key={transaction?.id ?? "new"}
            transaction={transaction}
            categories={categories}
            onSuccess={onSuccess}
            onOpenChange={onOpenChange}
            onSubmittingChange={handleSubmittingChange}
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="edit-expense-form"
            disabled={isSubmitting}
            className="bg-[#26be15] text-white hover:bg-[#23ad1b] font-semibold"
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </div>
      </Dialog>
  );
}
