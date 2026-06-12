"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence } from "framer-motion";
import { Save, Loader2, Calculator } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimulationBreakdownPreview } from "./SimulationBreakdownPreview";
import { CurrencyInput } from "@/components/ui/currency-input";
import { RateInput } from "./RateInput";
import { FeesSection } from "@/components/credits/FeesSection";
import { createSimulation } from "@/server/actions/simulation-actions";
import { invalidateInsightsCache } from "@/server/actions/ai-actions";
import {
  calculateFrenchEA,
  calculateNominalMonthly,
  getVerdict,
  verdictToDb,
} from "@/lib/simulation-engine";
import { REFERENCE_RATES } from "@/lib/constants";
import type { CreditType } from "@/lib/constants";
import type { FeeItem } from "@/types";
import { Sparkles } from "lucide-react";

const simulatorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  creditType: z.enum(["vehicle", "personal", "housing", "other"] as const),
  price: z.number().positive("El precio debe ser mayor a 0"),
  downPayment: z.number().min(0, "La cuota inicial no puede ser negativa"),
  termMode: z.enum(["years", "months"] as const),
  termValue: z.number().int().min(1).max(120),
  rate: z.number().min(0).max(2, "La tasa anual debe estar entre 0 y 200%"),
  formula: z.enum(["french_ea", "french_namv", "constant_capital_ea", "constant_capital_namv"] as const),
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

const FORMULA_LABELS: Record<string, string> = {
  french_ea: "Cuota Fija (Francés EA)",
  french_namv: "Cuota Fija (Francés NAMV)",
  constant_capital_ea: "Capital Constante (Alemán EA)",
  constant_capital_namv: "Capital Constante (Alemán NAMV)",
};

function getMonthlyRate(annualRate: number, formula: string): number {
  return formula === "french_ea" || formula === "constant_capital_ea"
    ? Math.pow(1 + annualRate, 1 / 12) - 1
    : annualRate / 12;
}

function calculatePreview(
  principal: number,
  annualRate: number,
  termMonths: number,
  formula: string
): { monthlyPayment: number; totalInterest: number; totalCost: number } {
  if (principal <= 0 || termMonths <= 0 || annualRate < 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
  }

  const monthlyRate = getMonthlyRate(annualRate, formula);

  // French (fixed payment)
  if (formula === "french_ea" || formula === "french_namv") {
    const payment =
      formula === "french_ea"
        ? calculateFrenchEA(principal, annualRate, termMonths)
        : calculateNominalMonthly(principal, annualRate, termMonths);
    const totalCost = payment * termMonths;
    return {
      monthlyPayment: Number(payment.toFixed(2)),
      totalInterest: Number((totalCost - principal).toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
    };
  }

  // German (constant capital, decreasing payment)
  const monthlyPrincipal = principal / termMonths;
  let balance = principal;
  let totalInterest = 0;

  for (let i = 0; i < termMonths; i++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance -= monthlyPrincipal;
    if (balance < 0) balance = 0;
  }

  const firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
  return {
    monthlyPayment: Number(firstMonthPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalCost: Number((principal + totalInterest).toFixed(2)),
  };
}

export function SimulatorForm({ availableMoney }: SimulatorFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [fees, setFees] = useState<FeeItem[]>([]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulatorFormData>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      name: "",
      creditType: "vehicle",
      price: 50000000,
      downPayment: 0,
      termMode: "years",
      termValue: 5,
      rate: defaultRates.vehicle,
      formula: "french_ea",
    },
  });

  const values = useWatch({ control }) as SimulatorFormData;
  const downPayment = watch("downPayment");

  const termMonths = useMemo(
    () => (values.termMode === "years" ? values.termValue * 12 : values.termValue),
    [values.termMode, values.termValue]
  );

  const result = useMemo(() => {
    const principal = Math.max(0, values.price - downPayment);
    const preview = calculatePreview(principal, values.rate, termMonths, values.formula);
    const { verdict, percentage } = getVerdict(preview.monthlyPayment, availableMoney);
    const remainingAfter = availableMoney - preview.monthlyPayment;
    const totalMonthlyFees = fees
      .filter((f) => f.type === "monthly")
      .reduce((sum, f) => sum + f.amount / 12, 0);
    const totalUpfrontFees = fees
      .filter((f) => f.type === "upfront")
      .reduce((sum, f) => sum + f.amount, 0);
    const effectiveMonthlyPayment = preview.monthlyPayment + totalMonthlyFees;

    return {
      principal,
      termMonths,
      monthlyPayment: preview.monthlyPayment,
      effectiveMonthlyPayment,
      totalMonthlyFees,
      totalUpfrontFees,
      verdict,
      percentage,
      remainingAfter,
      totalCost: preview.totalCost + totalUpfrontFees,
      totalInterest: preview.totalInterest,
    };
  }, [values, downPayment, termMonths, availableMoney, fees]);

  const handleCreditTypeChange = useCallback(
    (type: CreditType) => {
      setValue("creditType", type);
      setValue("rate", defaultRates[type]);
    },
    [setValue]
  );

  const handleSave = async (formData: SimulatorFormData) => {
    setIsPending(true);
    try {
      const title = `${creditTypeLabels[formData.creditType]} - ${formData.name}`;
      await createSimulation(
        formData.creditType.toUpperCase() as "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER",
        title,
        {
          price: formData.price,
          downPayment: downPayment,
          term: termMonths,
          rate: formData.rate,
          formula: formData.formula,
          fees: fees.length > 0 ? fees : undefined,
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
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#26be15]/10 text-[#26be15] flex items-center justify-center shrink-0">
              <Calculator className="h-3.5 w-3.5" strokeWidth={2.2} />
            </div>
            <CardTitle className="text-base text-[#17181c] dark:text-white">
              Datos de la simulación
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form
            id="simulator-form"
            onSubmit={handleSubmit(handleSave)}
            className="space-y-6"
          >
            {/* Row 1: Name + Type */}
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
                  <p className="text-sm text-[#e54d4d] dark:text-[#e54d4d]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditType">Tipo de crédito</Label>
                <Controller
                  name="creditType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => {
                      field.onChange(v);
                      handleCreditTypeChange(v as CreditType);
                    }}>
                      <SelectTrigger id="creditType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vehicle">{creditTypeLabels.vehicle}</SelectItem>
                        <SelectItem value="personal">{creditTypeLabels.personal}</SelectItem>
                        <SelectItem value="housing">{creditTypeLabels.housing}</SelectItem>
                        <SelectItem value="other">{creditTypeLabels.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Row 2: Price + Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="text-sm text-[#e54d4d] dark:text-[#e54d4d]">
                    {errors.price.message}
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
                  <p className="text-sm text-[#e54d4d] dark:text-[#e54d4d]">
                    {errors.rate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Down Payment Toggle */}
            <div className="space-y-3 rounded-xl border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label
                    htmlFor="downPayment-switch"
                    className="text-sm font-medium cursor-pointer"
                  >
                    ¿Tienes cuota inicial?
                  </Label>
                  <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-0.5">
                    Activa para registrar un pago inicial al crédito.
                  </p>
                </div>
                <Switch
                  id="downPayment-switch"
                  checked={downPayment > 0}
                  onCheckedChange={(checked) => {
                    setValue("downPayment", checked ? 10000000 : 0);
                  }}
                />
              </div>
              {downPayment > 0 && (
                <div className="space-y-2 pt-1">
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
                    <p className="text-sm text-[#e54d4d] dark:text-[#e54d4d]">
                      {errors.downPayment.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Row 3: Term + Formula */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plazo</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={1}
                      max={120}
                      {...register("termValue", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="flex rounded-md border border-[#e8e8e8] dark:border-[#2a2a2e] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        const current = values.termValue;
                        if (values.termMode === "months") {
                          setValue("termMode", "years");
                          setValue("termValue", Math.ceil(current / 12));
                        }
                      }}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        values.termMode === "years"
                          ? "bg-[#26be15] text-white"
                          : "bg-white dark:bg-[#17181c] text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e]"
                      }`}
                    >
                      Años
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const current = values.termValue;
                        if (values.termMode === "years") {
                          setValue("termMode", "months");
                          setValue("termValue", current * 12);
                        }
                      }}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        values.termMode === "months"
                          ? "bg-[#26be15] text-white"
                          : "bg-white dark:bg-[#17181c] text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e]"
                      }`}
                    >
                      Meses
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
                  {termMonths} meses en total
                </p>
                {errors.termValue && (
                  <p className="text-sm text-[#e54d4d] dark:text-[#e54d4d]">
                    {errors.termValue.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="formula">Fórmula de amortización</Label>
                <Controller
                  name="formula"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="formula">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel className="flex items-center gap-1.5 text-[#26be15] dark:text-[#26be15]">
                            <Sparkles className="h-3 w-3" />
                            Recomendado
                          </SelectLabel>
                          <SelectItem value="french_ea">
                            {FORMULA_LABELS.french_ea}
                          </SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Otros métodos</SelectLabel>
                          <SelectItem value="french_namv">
                            {FORMULA_LABELS.french_namv}
                          </SelectItem>
                          <SelectItem value="constant_capital_ea">
                            {FORMULA_LABELS.constant_capital_ea}
                          </SelectItem>
                          <SelectItem value="constant_capital_namv">
                            {FORMULA_LABELS.constant_capital_namv}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Fees Section */}
            <FeesSection fees={fees} onChange={setFees} />

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#26be15] hover:bg-[#23ad1b] text-white shadow-sm"
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
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Receipt */}
      <AnimatePresence>
        {result.monthlyPayment > 0 && (
          <SimulationBreakdownPreview
            inputs={{
              price: values.price,
              downPayment: downPayment,
              term: termMonths,
              rate: values.rate,
              formula: values.formula,
            }}
            result={{
              monthlyPayment: result.monthlyPayment,
              effectiveMonthlyPayment: result.effectiveMonthlyPayment,
              totalMonthlyFees: result.totalMonthlyFees,
              totalUpfrontFees: result.totalUpfrontFees,
              verdict: result.verdict,
              percentage: result.percentage,
              remainingAfter: result.remainingAfter,
              totalInterest: result.totalInterest,
              totalCost: result.totalCost,
            }}
            availableMoney={availableMoney}
            fees={fees}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
