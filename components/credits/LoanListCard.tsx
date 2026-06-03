"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCOP } from "@/lib/currency";
import type { Loan } from "@/types";

interface LoanListCardProps {
  loan: Loan & { paymentsCount?: number; extrasCount?: number };
}

const typeLabels: Record<string, string> = {
  VEHICLE: "Vehículo",
  PERSONAL: "Personal",
  HOUSING: "Vivienda",
  OTHER: "Otros",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Activo", color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" },
  PAID_OFF: { label: "Pagado", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900" },
  DEFAULTED: { label: "En mora", color: "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900" },
};

export function LoanListCard({ loan }: LoanListCardProps) {
  const principal = parseFloat(loan.principal);
  const monthlyPayment = parseFloat(loan.monthlyPayment);
  const paidCount = loan.paymentsCount ?? 0;
  const totalMonths = loan.termMonths;
  const progress = totalMonths > 0 ? (paidCount / totalMonths) * 100 : 0;

  return (
    <Link href={`/credits/${loan.id}`} className="block">
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold truncate">{loan.title}</CardTitle>
            <Badge variant="outline" className={statusConfig[loan.status]?.color ?? ""}>
              {statusConfig[loan.status]?.label ?? loan.status}
            </Badge>
          </div>
          <Badge variant="secondary" className="text-xs w-fit">
            {typeLabels[loan.type] ?? loan.type}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monto financiado</span>
            <span className="font-medium">{formatCOP(principal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cuota mensual</span>
            <span className="font-medium">{formatCOP(monthlyPayment)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-medium">{paidCount} / {totalMonths} meses</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
