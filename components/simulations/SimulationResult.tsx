"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import type { Verdict } from "@/lib/simulation-engine";

interface SimulationResultProps {
  verdict: Verdict;
  percentage: number;
  monthlyPayment: number;
  availableMoney: number;
  remainingAfter: number;
}

const verdictConfig: Record<Verdict, { label: string; color: string; badge: string; description: string }> = {
  SAFE: {
    label: "Seguro",
    color: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "El pago mensual representa menos del 30% de tus fondos disponibles.",
  },
  TIGHT: {
    label: "Ajustado",
    color: "text-amber-600",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    description: "El pago mensual representa entre 30% y 50% de tus fondos. Ten cuidado.",
  },
  RISKY: {
    label: "Riesgoso",
    color: "text-orange-600",
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    description: "El pago mensual supera el 50% de tus fondos. No recomendado.",
  },
  NOT_RECOMMENDED: {
    label: "No Recomendado",
    color: "text-rose-600",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    description: "El pago mensual supera tus fondos disponibles o es mayor al 70%.",
  },
};

export function SimulationResult({
  verdict,
  percentage,
  monthlyPayment,
  availableMoney,
  remainingAfter,
}: SimulationResultProps) {
  const config = verdictConfig[verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultado de la Simulacin</CardTitle>
            <Badge variant="outline" className={config.badge}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pago Mensual</p>
              <p className="text-xl font-bold">{formatCOP(monthlyPayment)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Disponible Actual</p>
              <p className="text-xl font-bold">{formatCOP(availableMoney)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Restante despus del pago</p>
              <p className={`text-xl font-bold ${remainingAfter >= 0 ? "text-emerald-600" : "text-destructive"}`}>
                {formatCOP(remainingAfter)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pago respecto a disponible</span>
              <span className={`font-medium ${config.color}`}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  verdict === "SAFE"
                    ? "bg-emerald-500"
                    : verdict === "TIGHT"
                    ? "bg-amber-500"
                    : verdict === "RISKY"
                    ? "bg-orange-500"
                    : "bg-rose-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
