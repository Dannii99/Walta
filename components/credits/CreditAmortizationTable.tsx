"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, CalendarDays } from "lucide-react";
import { getDaysOverdue } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { AmortizationRow } from "@/types";

interface CreditAmortizationTableProps {
  schedule: AmortizationRow[];
  onMarkPaid?: (month: number) => void;
}

type FilterTab = "all" | "paid" | "pending" | "defaulted";

const STATUS_BADGE: Record<string, string> = {
  PAID: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  PAID_OFF: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  PENDING: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  DEFAULTED: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  UPCOMING: "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700",
};

const STATUS_ROW: Record<string, string> = {
  PAID: "bg-emerald-50/50 dark:bg-emerald-950/20",
  PAID_OFF: "bg-stone-50/50 dark:bg-stone-800/20",
  PENDING: "bg-amber-50/50 dark:bg-amber-950/20",
  DEFAULTED: "bg-rose-50/50 dark:bg-rose-950/20",
  UPCOMING: "",
};

const STATUS_LABEL: Record<string, string> = {
  PAID: "Pagado",
  PAID_OFF: "Liquidado",
  PENDING: "Pendiente",
  DEFAULTED: "En mora",
  UPCOMING: "Próximo",
};

export function CreditAmortizationTable({
  schedule,
  onMarkPaid,
}: CreditAmortizationTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const counts = useMemo(() => {
    return schedule.reduce(
      (acc, row) => {
        if (row.status === "PAID") acc.paid++;
        else if (row.status === "PAID_OFF") acc.paidOff++;
        else if (row.status === "PENDING") acc.pending++;
        else if (row.status === "DEFAULTED") acc.defaulted++;
        else if (row.status === "UPCOMING") acc.upcoming++;
        return acc;
      },
      { paid: 0, paidOff: 0, pending: 0, defaulted: 0, upcoming: 0 }
    );
  }, [schedule]);

  const filteredSchedule = useMemo(() => {
    if (activeFilter === "all") return schedule;
    return schedule.filter((row) => {
      if (activeFilter === "paid") return row.status === "PAID";
      if (activeFilter === "pending")
        return row.status === "PENDING" || row.status === "DEFAULTED";
      if (activeFilter === "defaulted") return row.status === "DEFAULTED";
      return true;
    });
  }, [schedule, activeFilter]);

  const hasFees = useMemo(
    () => schedule.some((row) => row.monthlyFee > 0),
    [schedule]
  );

  if (schedule.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          No se pudo generar la tabla de amortización.
        </p>
      </div>
    );
  }

  const filters: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "Todas", count: schedule.length },
    { key: "paid", label: "Pagadas", count: counts.paid },
    { key: "pending", label: "Pendientes", count: counts.pending + counts.defaulted },
    { key: "defaulted", label: "En mora", count: counts.defaulted },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-5 md:p-6 border-b border-stone-200/80 dark:border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.3} />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
              Tabla de amortización
            </h2>
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                data-active={activeFilter === f.key}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors tabular-nums",
                  activeFilter === f.key
                    ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                    : "bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300"
                )}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-stone-50 dark:bg-stone-800/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Mes
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Fecha
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right">
                Cuota
              </th>
              {hasFees && (
                <th
                  title="Cargos mensuales diferidos (seguros, administración, etc.)"
                  className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right"
                >
                  Cargos
                </th>
              )}
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right">
                Interés
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right">
                Capital
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right">
                Abono
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-right">
                Saldo
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">
                Estado
              </th>
              <th className="px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center">
                Días
              </th>
              {onMarkPaid && (
                <th className="sticky right-0 z-10 bg-white dark:bg-stone-900 px-4 py-3 font-bold text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 text-center border-l border-stone-200/80 dark:border-stone-800">
                  Acción
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/80 dark:divide-stone-800">
            {filteredSchedule.map((row) => {
              const daysOverdue =
                row.status === "PENDING" || row.status === "DEFAULTED"
                  ? getDaysOverdue(row.date)
                  : 0;

              const canMarkPaid =
                onMarkPaid &&
                (row.status === "PENDING" || row.status === "DEFAULTED");

              return (
                <tr
                  key={row.month}
                  className={cn(
                    "transition-colors hover:bg-stone-50/30 dark:hover:bg-stone-800/30",
                    STATUS_ROW[row.status]
                  )}
                >
                  <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-50 tabular-nums">
                    {row.paymentPhase !== undefined && row.paymentPhase > 1 ? (
                      <span
                        title={`Recálculo: nueva cuota ${formatCOP(row.payment)} · fase ${row.paymentPhase}`}
                        className="cursor-help"
                      >
                        {row.month}
                      </span>
                    ) : (
                      row.month
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-700 dark:text-stone-300">
                    {row.date.toLocaleDateString("es-CO", {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    <span className="font-bold text-stone-900 dark:text-stone-50">
                      {formatCOP(row.totalPayment)}
                    </span>
                    {row.monthlyFee > 0 && (
                      <span className="block text-[10px] font-normal text-stone-500 dark:text-stone-400 mt-0.5">
                        Banco {formatCOP(row.payment)} · Cargos{" "}
                        {formatCOP(row.monthlyFee)}
                      </span>
                    )}
                  </td>
                  {hasFees && (
                    <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400 font-medium tabular-nums">
                      {row.monthlyFee > 0 ? (
                        formatCOP(row.monthlyFee)
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right text-stone-500 dark:text-stone-400 tabular-nums">
                    {formatCOP(row.interest)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {formatCOP(row.principal)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {row.extraPayment > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCOP(row.extraPayment)}
                      </span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">
                    {formatCOP(row.balance)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                          STATUS_BADGE[row.status]
                        )}
                      >
                        {STATUS_LABEL[row.status]}
                      </span>
                      {row.paidFromExtract && (
                        <span
                          title="Cuota marcada como pagada desde el extracto bancario (no es un pago real registrado)"
                          className="text-[9px] font-medium text-amber-600 dark:text-amber-400"
                        >
                          Extracto
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.status === "PENDING" || row.status === "DEFAULTED" ? (
                      <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1 tabular-nums">
                        {daysOverdue > 0 && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                        {daysOverdue}d
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                  {onMarkPaid && (
                    <td className="sticky right-0 z-10 bg-stone-50 dark:bg-stone-800/50 border-l border-stone-200/80 dark:border-stone-800 px-4 py-3 text-center">
                      {canMarkPaid ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onMarkPaid(row.month)}
                          title="Marcar como pagada"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                        </motion.button>
                      ) : (
                        <span className="text-xs text-stone-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredSchedule.length === 0 && (
        <div className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">
          No hay cuotas que coincidan con el filtro seleccionado.
        </div>
      )}
    </div>
  );
}
