"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { RateInput } from "@/components/simulations/RateInput";
import { FeesSection } from "./FeesSection";
import { updateLoan } from "@/server/actions/loan-actions";
import type { Loan } from "@/types";

const editLoanSchema = z.object({
  title: z.string().min(1, "El nombre es obligatorio"),
  type: z.enum(["VEHICLE", "PERSONAL", "HOUSING", "OTHER"] as const),
  principal: z.number().positive("El monto debe ser mayor a 0"),
  downPayment: z.number().min(0),
  annualRate: z.number().min(0),
  termMonths: z.number().int().min(1).max(120),
  formula: z.enum(["french_ea", "nominal_monthly"] as const),
  monthlyPayment: z.number().positive(),
  startDate: z.string().min(1, "Fecha requerida"),
  status: z.enum(["ACTIVE", "PAID_OFF", "DEFAULTED"] as const),
  paidInstallments: z.number().int().min(0).max(120),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().positive(),
  fees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number().nonnegative(),
    type: z.enum(["monthly", "upfront"]),
  })),
});

type EditLoanData = z.infer<typeof editLoanSchema>;

interface LoanEditFormProps {
  loan: Loan;
}

const typeLabels: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  PAID_OFF: "Pagado",
  DEFAULTED: "En mora",
};

export function LoanEditForm({ loan }: LoanEditFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditLoanData>({
    resolver: zodResolver(editLoanSchema),
    defaultValues: {
      title: loan.title,
      type: loan.type,
      principal: parseFloat(loan.principal),
      downPayment: parseFloat(loan.downPayment),
      annualRate: parseFloat(loan.annualRate),
      termMonths: loan.termMonths,
      formula: loan.formula,
      monthlyPayment: parseFloat(loan.monthlyPayment),
      startDate: new Date(loan.startDate).toISOString().split("T")[0],
      status: loan.status,
      paidInstallments: loan.paidInstallments,
      totalInterest: parseFloat(loan.totalInterest),
      totalCost: parseFloat(loan.totalCost),
      fees: loan.fees ?? [],
    },
  });

  const onSubmit = async (data: EditLoanData) => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      await updateLoan(loan.id, {
        ...data,
        startDate: new Date(data.startDate),
        fees: data.fees,
      });
      setSaveMessage("Crédito actualizado correctamente.");
      router.push(`/credits/${loan.id}`);
    } catch {
      setSaveMessage("Error al actualizar el crédito.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Crédito</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="edit-loan-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Nombre / Descripción</Label>
              <Input id="edit-title" {...register("title")} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <select
                id="edit-type"
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(typeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-principal">Monto a financiar</Label>
              <Controller
                name="principal"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="edit-principal"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-downPayment">Cuota inicial</Label>
              <Controller
                name="downPayment"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="edit-downPayment"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-term">Plazo (meses)</Label>
              <Input id="edit-term" type="number" {...register("termMonths", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
              <Controller
                name="annualRate"
                control={control}
                render={({ field }) => (
                  <RateInput
                    value={field.value}
                    onRateChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-formula">Fórmula</Label>
              <select
                id="edit-formula"
                {...register("formula")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="french_ea">Amortización Francesa (EA)</option>
                <option value="nominal_monthly">Inter├®s Nominal Mensual (NAMV/12)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-monthlyPayment">Cuota mensual</Label>
              <Controller
                name="monthlyPayment"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="edit-monthlyPayment"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Fecha de inicio</Label>
              <Input id="edit-startDate" type="date" {...register("startDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Estado</Label>
              <select
                id="edit-status"
                {...register("status")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-paid">Cuotas ya pagadas</Label>
              <Input
                id="edit-paid"
                type="number"
                min={0}
                max={120}
                {...register("paidInstallments", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-totalInterest">Inter├®s total</Label>
              <Controller
                name="totalInterest"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="edit-totalInterest"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-totalCost">Costo total</Label>
              <Controller
                name="totalCost"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="edit-totalCost"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>
          </div>

          <div className="pt-4">
            <Controller
              name="fees"
              control={control}
              render={({ field }) => (
                <FeesSection
                  fees={field.value}
                  onChange={(fees) => field.onChange(fees)}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(`/credits/${loan.id}`)}>
              Cancelar
            </Button>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes("Error") ? "text-destructive" : "text-emerald-600"}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
