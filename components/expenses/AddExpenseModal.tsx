"use client";

import { useForm, Controller, useWatch, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Info, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
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
  categoryId: z.string().min(1, "Selecciona una categoría"),
  amount: z.number().positive("El monto debe ser mayor a 0"),
  description: z.string().max(120).optional(),
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
    return "Se multiplicará ×2 al guardar para reflejar el impacto mensual real.";
  }
  if (recurrence === "ONE_TIME") {
    return "Cargo único. No se prorratea a lo largo del mes.";
  }
  return null;
}

/* ─── Shared form body ─── */
function ExpenseFormBody({
  control,
  register,
  errors,
  isSubmitting,
  categories,
  recurrence,
  onCancel,
  submitLabel,
  hideActions = false,
}: {
  control: Control<AddExpenseForm>;
  register: UseFormRegister<AddExpenseForm>;
  errors: FieldErrors<AddExpenseForm>;
  isSubmitting: boolean;
  categories: Category[];
  recurrence: Recurrence;
  onCancel: () => void;
  submitLabel: string;
  hideActions?: boolean;
}) {
  const amountHintText = amountHint(recurrence);
  const today = formatDateForInput(new Date());

  return (
    <div className="flex flex-col gap-5">
      {/* Category */}
      <div className="space-y-1.5">
        <Label
          htmlFor="add-category"
          className="text-xs font-bold uppercase tracking-wider text-[#737373]"
        >
          Categoría
        </Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <CategorySelect
              id="add-category"
              value={field.value}
              onValueChange={field.onChange}
              categories={categories}
              placeholder="Seleccionar categoría..."
            />
          )}
        />
        {errors.categoryId && (
          <p className="text-xs font-medium text-[#e54d4d]">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <Label
          htmlFor="add-amount"
          className="text-xs font-bold uppercase tracking-wider text-[#737373]"
        >
          {amountLabel(recurrence)}
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
              maxLength={15}
            />
          )}
        />
        {amountHintText && (
          <p className="text-xs text-[#737373] flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            <span>{amountHintText}</span>
          </p>
        )}
        {errors.amount && (
          <p className="text-xs font-medium text-[#e54d4d]">
            {errors.amount.message}
          </p>
        )}
      </div>

      {/* Recurrence + Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="add-recurrence"
            className="text-xs font-bold uppercase tracking-wider text-[#737373]"
          >
            Frecuencia
          </Label>
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
            <p className="text-xs font-medium text-[#e54d4d]">
              {errors.recurrence.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="add-date"
            className="text-xs font-bold uppercase tracking-wider text-[#737373]"
          >
            Fecha del cargo
          </Label>
          <Input
            id="add-date"
            type="date"
            max={today}
            {...register("date")}
          />
          {errors.date && (
            <p className="text-xs font-medium text-[#e54d4d]">
              {errors.date.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label
          htmlFor="add-description"
          className="text-xs font-bold uppercase tracking-wider text-[#737373]"
        >
          Descripción (opcional)
        </Label>
        <Input
          id="add-description"
          placeholder="Ej. Netflix, Mercado del mes, Gasolina..."
          maxLength={120}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs font-medium text-[#e54d4d]">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Actions */}
      {!hideActions && (
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-[#e8e8e8] text-[#17181c] hover:bg-[#fafafa] dark:border-[#334155] dark:text-white dark:hover:bg-[#1a1a1e]"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="add-expense-form"
            disabled={isSubmitting}
            className="flex-1 bg-[#26be15] text-white hover:bg-[#23ad1b] font-semibold"
          >
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

/* ─── Desktop modal wrapper ─── */
function DesktopModal({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="relative bg-white dark:bg-[#17181c] rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 md:p-8">
        <DialogHeader className="mb-5">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-[#26be15]/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-[#26be15]" strokeWidth={2.3} />
            </div>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
              Agregar Gasto
            </DialogTitle>
          </div>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <DialogContent>{children}</DialogContent>
      </div>
    </Dialog>
  );
}

/* ─── Mobile bottom sheet wrapper ─── */
function MobileSheet({
  open,
  onOpenChange,
  children,
  onCancel,
  submitLabel,
  isSubmitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-white dark:bg-[#1a1a1e] shadow-2xl max-h-[92dvh] min-h-[60dvh] flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <span className="h-1.5 w-12 rounded-full bg-[#17181c]/20 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-2 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-[#26be15]/10 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-[#26be15]" strokeWidth={2.3} />
                </div>
                <h3 className="text-base font-bold tracking-tight text-[#17181c] dark:text-white">
                  Agregar Gasto
                </h3>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-1.5 rounded-md hover:bg-[#17181c]/5 dark:hover:bg-white/10 text-[#737373]"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content: scrollable form fields */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <form id="add-expense-form" onSubmit={onSubmit}>
                {children}
              </form>
            </div>

            {/* Sticky footer: actions always visible */}
            <div className="shrink-0 border-t border-[#e8e8e8] dark:border-white/10 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white/95 dark:bg-[#1a1a1e]/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 border-[#e8e8e8] text-[#17181c] hover:bg-[#fafafa] dark:border-[#334155] dark:text-white dark:hover:bg-[#1a1a1e]"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="add-expense-form"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#26be15] text-white hover:bg-[#23ad1b] font-semibold"
                >
                  {isSubmitting ? "Guardando..." : submitLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Main component ─── */
export function AddExpenseModal({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: AddExpenseModalProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
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

  const formBody = (
    <ExpenseFormBody
      control={control}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      categories={categories}
      recurrence={recurrence as Recurrence}
      onCancel={() => onOpenChange(false)}
      submitLabel="Agregar"
    />
  );

  const mobileFormBody = (
    <ExpenseFormBody
      control={control}
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      categories={categories}
      recurrence={recurrence as Recurrence}
      onCancel={() => onOpenChange(false)}
      submitLabel="Agregar"
      hideActions
    />
  );

  return (
    <div>
      {isMobile ? (
        <MobileSheet
          open={open}
          onOpenChange={onOpenChange}
          onCancel={() => onOpenChange(false)}
          submitLabel="Agregar"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        >
          {mobileFormBody}
        </MobileSheet>
      ) : (
        <DesktopModal open={open} onOpenChange={onOpenChange}>
          <form id="add-expense-form" onSubmit={handleSubmit(onSubmit)}>
            {formBody}
          </form>
        </DesktopModal>
      )}
    </div>
  );
}
