"use client";

import { useState, useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult } from "./SimulationResult";
import { CurrencyInput } from "@/components/ui/currency-input";
import { RateInput } from "./RateInput";
import {
  calculateFrenchEA,
  calculateNominalMonthly,
  getVerdict,
} from "@/lib/simulation-engine";
import { formatCOP } from "@/lib/currency";
import { REFERENCE_RATES } from "@/lib/constants";
import type { Verdict } from "@/lib/simulation-engine";
import type { CreditType } from "@/lib/constants";

const simulatorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  creditType: z.enum(["vehicle", "personal", "housing", "other"] as const),
  price: z.number().positive("El precio debe ser mayor a 0"),
  downPayment: z.number().min(0, "La cuota inicial no puede ser negativa"),
  termYears: z.number().int().min(1).max(10, "El plazo máximo es 10 años"),
  rate: z.number().min(0).max(2, "La tasa anual debe estar entre 0 y 200%"),
  formula: z.enum(["french_ea", "nominal_monthly"] as const),
});

type SimulatorFormData = z.infer<typeof simulatorSchema>;

interface SimulatorFormProps {
  availableMoney: number;
  userId: string;
  onSave: (data: {
    title: string;
    type: string;
    inputs: {
      price: number;
      downPayment: number;
      term: number;
      rate: number;
      formula: string;
    };
    result: {
      monthlyPayment: number;
      verdict: "APPROVED" | "WARNING" | "REJECTED";
      availableAfter: number;
      totalInterest: number;
      totalCost: number;
    };
  }) => Promise<void>;
}

const verdictToDb: Record<Verdict, "APPROVED" | "WARNING" | "REJECTED"> = {
  SAFE: "APPROVED",
  TIGHT: "WARNING",
  RISKY: "REJECTED",
  NOT_RECOMMENDED: "REJECTED",
};

const creditTypeLabels: Record<CreditType, string> = {
  vehicle: "Vehículo",
  personal: "Personal / Libre inversión",
  housing: "Vivienda",
  other: "Otros",
};

const defaultRates: Record<CreditType, number> = {
  vehicle: REFERENCE_RATES.vehicle.ea,
  personal: REFERENCE_RATES.personal.ea,
  housing: REFERENCE_RATES.housing.ea,
  other: REFERENCE_RATES.personal.ea,
};

export function SimulatorForm({ availableMoney, onSave }: SimulatorFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SimulatorFormData>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      name: "",
      creditType: "vehicle",
      price: 50000000,
      downPayment: 10000000,
      termYears: 5,
      rate: defaultRates.vehicle,
      formula: "french_ea",
    },
  });

  const values = useWatch({ control }) as SimulatorFormData;

  const result = useMemo(() => {
    const principal = Math.max(0, values.price - values.downPayment);
    const termMonths = (values.termYears || 0) * 12;

    let monthlyPayment = 0;
    if (values.formula === "nominal_monthly") {
      monthlyPayment = calculateNominalMonthly(principal, values.rate, termMonths);
    } else {
      monthlyPayment = calculateFrenchEA(principal, values.rate, termMonths);
    }

    const { verdict, percentage } = getVerdict(monthlyPayment, availableMoney);
    const remainingAfter = availableMoney - monthlyPayment;
    const totalCost = monthlyPayment * termMonths;
    const totalInterest = totalCost - principal;

    return {
      principal,
      termMonths,
      monthlyPayment,
      verdict,
      percentage,
      remainingAfter,
      totalCost,
      totalInterest,
    };
  }, [values, availableMoney]);

  const handleCreditTypeChange = (type: CreditType) => {
    setValue("creditType", type);
    setValue("rate", defaultRates[type]);
  };

  const handleSave = async (formData: SimulatorFormData) => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const title = `${creditTypeLabels[formData.creditType]} - ${formData.name}`;
      await onSave({
        title,
        type: formData.creditType.toUpperCase(),
        inputs: {
          price: formData.price,
          downPayment: formData.downPayment,
          term: result.termMonths,
          rate: formData.rate,
          formula: formData.formula,
        },
        result: {
          monthlyPayment: result.monthlyPayment,
          verdict: verdictToDb[result.verdict],
          availableAfter: result.remainingAfter,
          totalInterest: result.totalInterest,
          totalCost: result.totalCost,
        },
      });
      setSaveMessage("Simulación guardada correctamente.");
    } catch {
      setSaveMessage("Error al guardar la simulación.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del Préstamo</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="simulator-form"
            onSubmit={handleSubmit(handleSave)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre / Descripción</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ej: Carro familiar"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditType">Tipo de crédito</Label>
                <select
                  id="creditType"
                  {...register("creditType")}
                  onChange={(e) => handleCreditTypeChange(e.target.value as CreditType)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="vehicle">{creditTypeLabels.vehicle}</option>
                  <option value="personal">{creditTypeLabels.personal}</option>
                  <option value="housing">{creditTypeLabels.housing}</option>
                  <option value="other">{creditTypeLabels.other}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="price"
                      value={field.value}
                      onValueChange={(v) => field.onChange(v)}
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
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
                  <p className="text-sm text-destructive">
                    {errors.downPayment.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="termYears">Plazo (años)</Label>
                <Input
                  id="termYears"
                  type="number"
                  min={1}
                  max={10}
                  {...register("termYears", { valueAsNumber: true })}
                />
                {errors.termYears && (
                  <p className="text-sm text-destructive">
                    {errors.termYears.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="rate"
                  control={control}
                  render={({ field }) => (
                    <RateInput
                      value={field.value}
                      onRateChange={(v) => field.onChange(v)}
                    />
                  )}
                />
                {errors.rate && (
                  <p className="text-sm text-destructive">{errors.rate.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="formula">Fórmula de cálculo</Label>
                <select
                  id="formula"
                  {...register("formula")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="french_ea">
                    Amortización Francesa (EA)
                  </option>
                  <option value="nominal_monthly">
                    Interés Nominal Mensual (NAMV/12)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Simulación"}
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

      {/* Real-time calculation */}
      <Card>
        <CardHeader>
          <CardTitle>Cálculo en Tiempo Real</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monto a financiar</p>
              <p className="text-lg font-semibold">{formatCOP(result.principal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Plazo en meses</p>
              <p className="text-lg font-semibold">{result.termMonths}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pago mensual estimado</p>
              <p className="text-lg font-semibold text-primary">
                {formatCOP(result.monthlyPayment)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result reveal */}
      <AnimatePresence>
        {result.monthlyPayment > 0 && (
          <SimulationResult
            verdict={result.verdict}
            percentage={result.percentage}
            monthlyPayment={result.monthlyPayment}
            availableMoney={availableMoney}
            remainingAfter={result.remainingAfter}
            formula={values.formula === "nominal_monthly" ? "NAMV/12" : "EA (Francés)"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
