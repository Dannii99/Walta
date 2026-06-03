"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";
import { getDaysOverdue } from "@/lib/loan-engine";
import type { AmortizationRow } from "@/types";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
  onMarkPaid?: (month: number) => void;
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

type FilterTab = "all" | "paid" | "pending" | "defaulted";

export function AmortizationTable({ schedule, onMarkPaid }: AmortizationTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const counts = useMemo(() => {
    return schedule.reduce(
      (acc, row) => {
        if (row.status === "PAID") acc.paid++;
        else if (row.status === "PENDING") acc.pending++;
        else if (row.status === "DEFAULTED") acc.defaulted++;
        else if (row.status === "UPCOMING") acc.upcoming++;
        return acc;
      },
      { paid: 0, pending: 0, defaulted: 0, upcoming: 0 }
    );
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    if (activeFilter === "all") return schedule;
    return schedule.filter((row) => {
      if (activeFilter === "paid") return row.status === "PAID";
      if (activeFilter === "pending") return row.status === "PENDING" || row.status === "DEFAULTED";
      if (activeFilter === "defaulted") return row.status === "DEFAULTED";
      return true;
    });
  }, [schedule, activeFilter]);

  if (schedule.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No se pudo generar la tabla de amortización.
        </CardContent>
      </Card>
    );
  }

  const filters: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: schedule.length },
    { key: "paid", label: "Pagadas", count: counts.paid },
    { key: "pending", label: "Pendientes", count: counts.pending + counts.defaulted },
    { key: "defaulted", label: "En mora", count: counts.defaulted },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base">Tabla de Amortización</CardTitle>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeFilter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{counts.paid} pagadas</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">{counts.pending} pendientes</span>
          {counts.defaulted > 0 && (
            <span className="text-red-600 dark:text-red-400 font-medium">{counts.defaulted} en mora</span>
          )}
          <span className="text-slate-500 dark:text-slate-400 font-medium">{counts.upcoming} futuras</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mes</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-right font-medium">Cuota</th>
                <th className="px-4 py-3 text-right font-medium">Interés</th>
                <th className="px-4 py-3 text-right font-medium">Capital</th>
                <th className="px-4 py-3 text-right font-medium">Abono</th>
                <th className="px-4 py-3 text-right font-medium">Saldo</th>
                <th className="px-4 py-3 text-center font-medium">Estado</th>
                <th className="px-4 py-3 text-center font-medium">Días de retraso</th>
                <th className="px-4 py-3 text-center font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSchedule.map((row) => {
                const daysOverdue =
                  row.status === "PENDING" || row.status === "DEFAULTED"
                    ? getDaysOverdue(row.date)
                    : 0;

                const statusColors = {
                  PAID: "bg-emerald-50/50 dark:bg-emerald-950/20",
                  PENDING: "bg-amber-50/50 dark:bg-amber-950/20",
                  DEFAULTED: "bg-red-50/50 dark:bg-red-950/20",
                  UPCOMING: "",
                };

                const badgeColors = {
                  PAID: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
                  PENDING: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
                  DEFAULTED: "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900",
                  UPCOMING: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700",
                };

                const statusLabels = {
                  PAID: "Pagado",
                  PENDING: "Pendiente",
                  DEFAULTED: "En mora",
                  UPCOMING: "Próximo",
                };

                const canMarkPaid =
                  onMarkPaid &&
                  (row.status === "PENDING" || row.status === "DEFAULTED");

                return (
                  <tr key={row.month} className={statusColors[row.status]}>
                    <td className="px-4 py-3 font-medium">{row.month}</td>
                    <td className="px-4 py-3">
                      {row.date.toLocaleDateString("es-CO", {
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCOP(row.payment)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {formatCOP(row.interest)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCOP(row.principal)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.extraPayment > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {formatCOP(row.extraPayment)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCOP(row.balance)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={badgeColors[row.status]}>
                        {statusLabels[row.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.status === "PENDING" || row.status === "DEFAULTED" ? (
                        <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          {daysOverdue} días
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {canMarkPaid ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/40"
                          onClick={() => onMarkPaid(row.month)}
                          title="Marcar como pagada"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredSchedule.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm">
            No hay cuotas que coincidan con el filtro seleccionado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
