"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AmortizationRow } from "@/types";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function AmortizationTable({ schedule }: AmortizationTableProps) {
  if (schedule.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No se pudo generar la tabla de amortización.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tabla de Amortización</CardTitle>
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
              </tr>
            </thead>
            <tbody className="divide-y">
              {schedule.map((row) => (
                <tr
                  key={row.month}
                  className={`${
                    row.status === "PAID"
                      ? "bg-emerald-50/50"
                      : row.status === "PENDING"
                        ? "bg-amber-50/50"
                        : ""
                  }`}
                >
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
                      <span className="text-emerald-600 font-medium">
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
                    <Badge
                      variant="outline"
                      className={
                        row.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : row.status === "PENDING"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-800 border-slate-200"
                      }
                    >
                      {row.status === "PAID" && "Pagado"}
                      {row.status === "PENDING" && "Pendiente"}
                      {row.status === "UPCOMING" && "Próximo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
