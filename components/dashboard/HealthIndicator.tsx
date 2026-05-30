"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HeartPulse } from "lucide-react";
import { formatCOP } from "@/lib/currency";

interface HealthIndicatorProps {
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsSpent: number;
  savingsLimit: number;
}

function getHealthLabel(percentage: number) {
  if (percentage <= 85) return "Saludable";
  if (percentage <= 100) return "Atención";
  return "Crítico";
}

export function HealthIndicator({
  needsSpent,
  needsLimit,
  wantsSpent,
  wantsLimit,
  savingsSpent,
  savingsLimit,
}: HealthIndicatorProps) {
  const items = [
    { label: "Necesidades", spent: needsSpent, limit: needsLimit },
    { label: "Deseos", spent: wantsSpent, limit: wantsLimit },
    { label: "Ahorro / Deuda", spent: savingsSpent, limit: savingsLimit },
  ];

  const overallPercentage =
    (needsLimit + wantsLimit + savingsLimit > 0)
      ? ((needsSpent + wantsSpent + savingsSpent) /
          (needsLimit + wantsLimit + savingsLimit)) *
        100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Salud Financiera</CardTitle>
          <div className="p-2 bg-rose-50 rounded-full">
            <HeartPulse className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado general</span>
            <span
              className={`text-sm font-bold ${
                overallPercentage <= 85
                  ? "text-emerald-600"
                  : overallPercentage <= 100
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {getHealthLabel(overallPercentage)}
            </span>
          </div>

          {items.map((item) => {
            const percentage = item.limit > 0 ? (item.spent / item.limit) * 100 : 0;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">
                    {formatCOP(item.spent)} / {formatCOP(item.limit)}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                />
                <div className="flex justify-end">
                  <span
                    className={`text-xs font-medium ${
                      percentage <= 85
                        ? "text-emerald-600"
                        : percentage <= 100
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
