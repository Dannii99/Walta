"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import { VERDICT_CONFIG, type Verdict } from "@/lib/simulation-engine";

interface SimulationResultProps {
  verdict: Verdict;
  percentage: number;
  monthlyPayment: number;
  availableMoney: number;
  remainingAfter: number;
  formula?: string;
}

export function SimulationResult({
  verdict,
  percentage,
  monthlyPayment,
  availableMoney,
  remainingAfter,
  formula,
}: SimulationResultProps) {
  const config = VERDICT_CONFIG[verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultado de la Simulación</CardTitle>
            <div className="flex items-center gap-2">
              {formula && (
                <Badge variant="outline" className="text-xs">
                  {formula}
                </Badge>
              )}
              <Badge variant="outline" className={config.badge}>
                {config.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pago Mensual</p>
              <p className="text-xl font-bold tabular-nums">{formatCOP(monthlyPayment)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Disponible Actual</p>
              <p className="text-xl font-bold tabular-nums">{formatCOP(availableMoney)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Restante después del pago</p>
              <p
                className={`text-xl font-bold tabular-nums ${
                  remainingAfter >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
                }`}
              >
                {formatCOP(remainingAfter)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pago respecto a disponible</span>
              <span className={`font-medium tabular-nums ${config.color}`}>
                {percentage.toFixed(1)}%
              </span>
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
