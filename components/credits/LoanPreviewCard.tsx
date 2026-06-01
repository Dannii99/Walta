"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import {
  Calculator,
  TrendingDown,
  PiggyBank,
  Wallet,
  Coins,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { FeeItem } from "@/types";
import { calculateTotalMonthlyFees, getFeeIcon } from "@/lib/loan-fees";

interface LoanPreviewCardProps {
  principal: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  availableMoney?: number;
  fees?: FeeItem[];
}

export function LoanPreviewCard({
  principal,
  monthlyPayment,
  totalInterest,
  totalCost,
  availableMoney,
  fees = [],
}: LoanPreviewCardProps) {
  const monthlyFees = calculateTotalMonthlyFees(fees);
  const totalMonthlyPayment = monthlyPayment + monthlyFees;

  const percentageOfBudget =
    availableMoney && availableMoney > 0
      ? (totalMonthlyPayment / availableMoney) * 100
      : 0;

  const capacityColor =
    percentageOfBudget <= 30
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : percentageOfBudget <= 50
        ? "bg-amber-100 text-amber-800 border-amber-200"
        : "bg-red-100 text-red-800 border-red-200";

  const CapacityIcon =
    percentageOfBudget <= 30 ? CheckCircle2 : AlertTriangle;

  const capacityLabel =
    percentageOfBudget <= 30
      ? "Cómodo"
      : percentageOfBudget <= 50
        ? "Ajustado"
        : "Riesgoso";

  const monthlyFeeItems = fees.filter((f) => f.type === "monthly");

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Tu crédito calculado</h3>
        </div>

        <div className="space-y-3">
          {/* Base loan payment */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" />
              <span>Cuota del crédito</span>
            </div>
            <span className="font-medium">{formatCOP(monthlyPayment)}</span>
          </div>

          {/* Monthly fees itemized */}
          {monthlyFeeItems.length > 0 && (
            <div className="space-y-1.5">
              {monthlyFeeItems.map((fee) => {
                const FeeIcon = getFeeIcon(fee.name);
                return (
                  <div
                    key={fee.id}
                    className="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <FeeIcon className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[140px]">{fee.name}</span>
                    </div>
                    <span>+ {formatCOP(fee.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total monthly */}
          {monthlyFees > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2">
              <span className="text-sm font-medium">Cuota total mensual</span>
              <span className="text-xl font-bold text-primary">
                {formatCOP(totalMonthlyPayment)}
              </span>
            </div>
          )}

          {monthlyFees === 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                <span>Cuota mensual</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                {formatCOP(monthlyPayment)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>Inter├®s total</span>
            </div>
            <span className="font-medium">{formatCOP(totalInterest)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-3.5 w-3.5" />
              <span>Capital</span>
            </div>
            <span className="font-medium">{formatCOP(principal)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PiggyBank className="h-3.5 w-3.5" />
              <span>Costo total</span>
            </div>
            <span className="font-medium">{formatCOP(totalCost)}</span>
          </div>
        </div>

        {availableMoney !== undefined && availableMoney > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                Representa el {percentageOfBudget.toFixed(0)}% de tu presupuesto mensual
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={capacityColor}>
                <CapacityIcon className="h-3 w-3 mr-1" />
                {capacityLabel}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Disponible: {formatCOP(availableMoney)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
