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

  const barColor =
    verdict === "SAFE"
      ? "bg-[#23ad1b]"
      : verdict === "TIGHT"
      ? "bg-[#e7964d]"
      : verdict === "RISKY"
      ? "bg-[#e7964d]"
      : "bg-[#e54d4d]";

  const remainingColor =
    remainingAfter >= 0 ? "text-[#23ad1b] dark:text-[#23ad1b]" : "text-[#e54d4d] dark:text-[#e54d4d]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-0 border-l-4 border-l-[#26be15]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[#17181c] dark:text-white">Resultado de la Simulación</CardTitle>
            <div className="flex items-center gap-2">
              {formula && (
                <Badge variant="outline" className="text-xs text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e]">
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
              <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">Pago Mensual</p>
              <p className="text-xl font-bold tabular-nums text-[#17181c] dark:text-white">{formatCOP(monthlyPayment)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">Disponible Actual</p>
              <p className="text-xl font-bold tabular-nums text-[#17181c] dark:text-white">{formatCOP(availableMoney)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">Restante después del pago</p>
              <p className={`text-xl font-bold tabular-nums ${remainingColor}`}>
                {formatCOP(remainingAfter)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#737373] dark:text-[#a1a1aa]">Pago respecto a disponible</span>
              <span className={`font-medium tabular-nums ${config.color}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-[#f5f5f5] dark:bg-white/5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">{config.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
