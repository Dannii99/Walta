"use client";

import { useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence } from "framer-motion";
import { Save, Loader2, Sparkles, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult } from "./SimulationResult";
import { CurrencyInput } from "@/components/ui/currency-input";
import { RateInput } from "./RateInput";
import { createSimulation } from "@/server/actions/simulation-actions";
import { invalidateInsightsCache } from "@/server/actions/ai-actions";
import {
  calculateFrenchEA,
  calculateNominalMonthly,
  getVerdict,
  verdictToDb,
} from "@/lib/simulation-engine";
import { formatCOP } from "@/lib/currency";
import { REFERENCE_RATES } from "@/lib/constants";
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
}

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

export function SimulatorForm({ availableMoney }: SimulatorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    startTransition(async () => {
      try {
        const title = `${creditTypeLabels[formData.creditType]} - ${formData.name}`;
        await createSimulation(
          formData.creditType.toUpperCase() as "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER",
          title,
          {
            price: formData.price,
            downPayment: formData.downPayment,
            term: result.termMonths,
            rate: formData.rate,
            formula: formData.formula,
          },
          {
            monthlyPayment: result.monthlyPayment,
            verdict: verdictToDb[result.verdict],
            availableAfter: result.remainingAfter,
            totalInterest: result.totalInterest,
            totalCost: result.totalCost,
          }
        );
        await invalidateInsightsCache();
        toast.success("Simulación guardada", {
          description: "Podrás ver el análisis inteligente en la vista de detalle.",
        });
        router.push("/simulations");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo guardar la simulación";
        toast.error(message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Calculator className="h-3.5 w-3.5" strokeWidth={2.2} />
            </div>
            <CardTitle className="text-base">Datos del préstamo</CardTitle>
          </div>
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
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditType">Tipo de crédito</Label>
                <select
                  id="creditType"
                  {...register("creditType")}
                  onChange={(e) => handleCreditTypeChange(e.target.value as CreditType)}
                  className="flex h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-900 dark:text-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {errors.price.message}
                  </p>
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
                  <p className="text-sm text-rose-600 dark:text-rose-400">
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
                  <p className="text-sm text-rose-600 dark:text-rose-400">
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
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {errors.rate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="formula">Fórmula de cálculo</Label>
                <select
                  id="formula"
                  {...register("formula")}
                  className="flex h-10 w-full rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm text-stone-900 dark:text-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-300 dark:focus-visible:ring-stone-600 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1.5" />
                    Guardar simulación
                  </>
                )}
              </Button>
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                <Sparkles className="h-3 w-3" />
                <span>Generará análisis IA al guardar</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cálculo en tiempo real</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Monto a financiar
              </p>
              <p className="text-lg font-bold tabular-nums text-stone-900 dark:text-stone-50">
                {formatCOP(result.principal)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Plazo
              </p>
              <p className="text-lg font-bold tabular-nums text-stone-900 dark:text-stone-50">
                {result.termMonths} meses
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Cuota mensual
              </p>
              <p className="text-lg font-bold tabular-nums text-primary">
                {formatCOP(result.monthlyPayment)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
