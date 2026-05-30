"use client";

import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResult } from "./SimulationResult";
import { calculateLoanPayment, getVerdict } from "@/lib/simulation-engine";
import { formatCOP } from "@/lib/currency";
import { REFERENCE_RATES } from "@/lib/constants";
import type { Verdict } from "@/lib/simulation-engine";

const vehicleSchema = z.object({
  price: z.number().positive("El precio debe ser mayor a 0"),
  downPayment: z.number().min(0, "La cuota inicial no puede ser negativa"),
  termYears: z.number().int().min(1).max(10, "El plazo mximo es 10 aos"),
  rate: z.number().min(0).max(1, "La tasa debe estar entre 0 y 1"),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

interface VehicleSimulatorFormProps {
  availableMoney: number;
  userId: string;
  onSave: (data: {
    title: string;
    inputs: { price: number; downPayment: number; term: number; rate: number };
    result: { monthlyPayment: number; verdict: "APPROVED" | "WARNING" | "REJECTED"; availableAfter: number; totalInterest: number; totalCost: number };
  }) => Promise<void>;
}

const verdictToDb: Record<Verdict, "APPROVED" | "WARNING" | "REJECTED"> = {
  SAFE: "APPROVED",
  TIGHT: "WARNING",
  RISKY: "REJECTED",
  NOT_RECOMMENDED: "REJECTED",
};

export function VehicleSimulatorForm({ availableMoney, onSave }: VehicleSimulatorFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      price: 50000000,
      downPayment: 10000000,
      termYears: 5,
      rate: REFERENCE_RATES.vehicle.default,
    },
  });

  const values = useWatch({ control }) as VehicleForm;

  const result = useMemo(() => {
    const principal = Math.max(0, values.price - values.downPayment);
    const termMonths = (values.termYears || 0) * 12;
    const monthlyPayment = calculateLoanPayment(principal, values.rate || 0, termMonths);
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

  const handleSave = async (formData: VehicleForm) => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const title = `Vehculo - ${formData.price.toLocaleString("es-CO")} COP`;
      await onSave({
        title,
        inputs: {
          price: formData.price,
          downPayment: formData.downPayment,
          term: result.termMonths,
          rate: formData.rate,
        },
        result: {
          monthlyPayment: result.monthlyPayment,
          verdict: verdictToDb[result.verdict],
          availableAfter: result.remainingAfter,
          totalInterest: result.totalInterest,
          totalCost: result.totalCost,
        },
      });
      setSaveMessage("Simulacin guardada correctamente.");
    } catch {
      setSaveMessage("Error al guardar la simulacin.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos del Vehculo</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="vehicle-form" onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio del vehculo</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Cuota inicial</Label>
                <Input
                  id="downPayment"
                  type="number"
                  {...register("downPayment", { valueAsNumber: true })}
                />
                {errors.downPayment && (
                  <p className="text-sm text-destructive">{errors.downPayment.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="termYears">Plazo (aos)</Label>
                <Input
                  id="termYears"
                  type="number"
                  min={1}
                  max={10}
                  {...register("termYears", { valueAsNumber: true })}
                />
                {errors.termYears && (
                  <p className="text-sm text-destructive">{errors.termYears.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate">Tasa de inters anual (EA)</Label>
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  min={0}
                  max={1}
                  {...register("rate", { valueAsNumber: true })}
                />
                {errors.rate && (
                  <p className="text-sm text-destructive">{errors.rate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar Simulacin"}
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
          <CardTitle>Clculo en Tiempo Real</CardTitle>
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
              <p className="text-lg font-semibold text-primary">{formatCOP(result.monthlyPayment)}</p>
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
