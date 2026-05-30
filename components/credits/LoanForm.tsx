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
import { createLoan } from "@/server/actions/loan-actions";
import { REFERENCE_RATES } from "@/lib/constants";
import type { CreditType } from "@/lib/constants";

const loanFormSchema = z.object({
  title: z.string().min(1, "El nombre es obligatorio"),
  type: z.enum(["vehicle", "personal", "housing", "other"] as const),
  principal: z.number().positive("El monto debe ser mayor a 0"),
  downPayment: z.number().min(0, "La cuota inicial no puede ser negativa"),
  annualRate: z.number().min(0, "La tasa debe ser positiva"),
  termMonths: z.number().int().min(1).max(120, "El plazo máximo es 120 meses"),
  formula: z.enum(["french_ea", "nominal_monthly"] as const),
  monthlyPayment: z.number().positive("La cuota mensual debe ser positiva"),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().positive(),
  startDate: z.string().optional(),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

interface LoanFormProps {
  defaultValues?: {
    title: string;
    type: string;
    principal: number;
    downPayment: number;
    annualRate: number;
    termMonths: number;
    formula: string;
    monthlyPayment: number;
    totalInterest: number;
    totalCost: number;
    simulationId?: string;
    startDate?: Date;
  } | null;
}

const creditTypeLabels: Record<CreditType, string> = {
  vehicle: "Vehículo",
  personal: "Personal / Libre inversión",
  housing: "Vivienda",
  other: "Otros",
};

export function LoanForm({ defaultValues }: LoanFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          type: defaultValues.type as LoanFormData["type"],
          principal: defaultValues.principal,
          downPayment: defaultValues.downPayment,
          annualRate: defaultValues.annualRate,
          termMonths: defaultValues.termMonths,
          formula: defaultValues.formula as LoanFormData["formula"],
          monthlyPayment: defaultValues.monthlyPayment,
          totalInterest: defaultValues.totalInterest,
          totalCost: defaultValues.totalCost,
          startDate: defaultValues.startDate
            ? new Date(defaultValues.startDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }
      : {
          title: "",
          type: "vehicle",
          principal: 50000000,
          downPayment: 10000000,
          annualRate: REFERENCE_RATES.vehicle.ea,
          termMonths: 60,
          formula: "french_ea",
          monthlyPayment: 0,
          totalInterest: 0,
          totalCost: 0,
          startDate: new Date().toISOString().split("T")[0],
        },
  });

  const handleSave = async (data: LoanFormData) => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const loan = await createLoan({
        title: data.title,
        type: data.type.toUpperCase(),
        principal: data.principal,
        downPayment: data.downPayment,
        annualRate: data.annualRate,
        termMonths: data.termMonths,
        formula: data.formula,
        monthlyPayment: data.monthlyPayment,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        totalInterest: data.totalInterest,
        totalCost: data.totalCost,
        simulationId: defaultValues?.simulationId,
      });
      setSaveMessage("Crédito guardado correctamente.");
      router.push(`/credits/${loan.id}`);
    } catch {
      setSaveMessage("Error al guardar el crédito.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Crédito</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="loan-form"
          onSubmit={handleSubmit(handleSave)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nombre / Descripción *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Ej: Mazda 3 2024"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de crédito</Label>
              <select
                id="type"
                {...register("type")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="vehicle">{creditTypeLabels.vehicle}</option>
                <option value="personal">{creditTypeLabels.personal}</option>
                <option value="housing">{creditTypeLabels.housing}</option>
                <option value="other">{creditTypeLabels.other}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="principal">Monto a financiar</Label>
              <Controller
                name="principal"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="principal"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
              {errors.principal && (
                <p className="text-sm text-destructive">{errors.principal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Cuota inicial</Label>
              <Controller
                name="downPayment"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="downPayment"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
              {errors.downPayment && (
                <p className="text-sm text-destructive">{errors.downPayment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="termMonths">Plazo (meses)</Label>
              <Input
                id="termMonths"
                type="number"
                min={1}
                max={120}
                {...register("termMonths", { valueAsNumber: true })}
              />
              {errors.termMonths && (
                <p className="text-sm text-destructive">{errors.termMonths.message}</p>
              )}
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
              {errors.annualRate && (
                <p className="text-sm text-destructive">{errors.annualRate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="formula">Fórmula de cálculo</Label>
              <select
                id="formula"
                {...register("formula")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="french_ea">Amortización Francesa (EA)</option>
                <option value="nominal_monthly">Interés Nominal Mensual (NAMV/12)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyPayment">Cuota mensual estimada</Label>
              <Controller
                name="monthlyPayment"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="monthlyPayment"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
              {errors.monthlyPayment && (
                <p className="text-sm text-destructive">{errors.monthlyPayment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalInterest">Interés total estimado</Label>
              <Controller
                name="totalInterest"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="totalInterest"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Costo total estimado</Label>
              <Controller
                name="totalCost"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="totalCost"
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Crédito"}
            </Button>
            {saveMessage && (
              <span
                className={`text-sm ${saveMessage.includes("Error") ? "text-destructive" : "text-emerald-600"}`}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
