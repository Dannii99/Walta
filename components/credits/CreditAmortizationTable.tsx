"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, CalendarDays } from "lucide-react";
import { getDaysOverdue } from "@/lib/loan-engine";
import { formatCOP } from "@/lib/currency";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AmortizationCard } from "./AmortizationCard";
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
      <div className="rounded-2xl border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] p-12 text-center bg-white dark:bg-[#17181c]">
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa]">
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
    <div className="space-y-4">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2.3} />
          </div>
          <h2 className="text-sm font-bold tracking-tight text-[#17181c] dark:text-white">
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
                  ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                  : "bg-white dark:bg-[#17181c] text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e] hover:border-[#d4d4d4] dark:hover:border-[#404040]"
              )}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl overflow-hidden bg-white dark:bg-[#17181c] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] dark:bg-[#1e1e22] hover:bg-[#fafafa] dark:hover:bg-[#1e1e22] border-b border-[#e8e8e8] dark:border-[#2a2a2e]">
              <TableHead className="h-10 py-2">Mes</TableHead>
              <TableHead className="h-10 py-2">Fecha</TableHead>
              <TableHead className="h-10 py-2 text-right">Cuota</TableHead>
              {hasFees && (
                <TableHead
                  title="Cargos mensuales diferidos (seguros, administración, etc.)"
                  className="h-10 py-2 text-right"
                >
                  Cargos
                </TableHead>
              )}
              <TableHead className="h-10 py-2 text-right">Interés</TableHead>
              <TableHead className="h-10 py-2 text-right">Capital</TableHead>
              <TableHead className="h-10 py-2 text-right">Abono</TableHead>
              <TableHead className="h-10 py-2 text-right">Saldo</TableHead>
              <TableHead className="h-10 py-2 text-center">Estado</TableHead>
              <TableHead className="h-10 py-2 text-center">Días</TableHead>
              {onMarkPaid && (
                <TableHead className="h-10 py-2 text-center" sticky>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                    Acción
                  </span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedule.map((row, index) => {
              const daysOverdue =
                row.status === "PENDING" || row.status === "DEFAULTED"
                  ? getDaysOverdue(row.date)
                  : 0;

              const canMarkPaid =
                onMarkPaid &&
                (row.status === "PENDING" || row.status === "DEFAULTED");

              const isOdd = index % 2 === 1;

              return (
                <TableRow
                  key={row.month}
                  className={cn(
                    "border-b border-[#e8e8e8]/50 dark:border-[#2a2a2e]/50 transition-colors",
                    isOdd
                      ? "bg-[#fafafa]/50 dark:bg-[#1e1e22]/50"
                      : "bg-white dark:bg-[#17181c]",
                    row.status === "DEFAULTED" && "bg-rose-50/50 dark:bg-rose-950/20",
                    row.status === "PENDING" && "bg-amber-50/50 dark:bg-amber-950/20",
                    row.status === "PAID" && "bg-emerald-50/50 dark:bg-emerald-950/20",
                    "hover:bg-[#f5f5f5] dark:hover:bg-white/5"
                  )}
                >
                  <TableCell className="py-3">
                    <span className="font-bold text-sm text-[#17181c] dark:text-white tabular-nums">
                      {row.month}
                    </span>
                    {row.paymentPhase !== undefined && row.paymentPhase > 1 && (
                      <span
                        title={`Recálculo: nueva cuota ${formatCOP(row.payment)} · fase ${row.paymentPhase}`}
                        className="ml-1.5 text-[10px] font-semibold px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400"
                      >
                        F{row.paymentPhase}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-[#737373] dark:text-[#a1a1aa]">
                    {row.date.toLocaleDateString("es-CO", {
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums">
                    <div className="font-bold text-sm text-[#17181c] dark:text-white">
                      {formatCOP(row.totalPayment)}
                    </div>
                    {row.monthlyFee > 0 && (
                      <div className="text-[10px] text-[#737373] dark:text-[#a1a1aa]">
                        +{formatCOP(row.monthlyFee)} cargos
                      </div>
                    )}
                  </TableCell>
                  {hasFees && (
                    <TableCell className="py-3 text-right text-sm tabular-nums text-amber-600 dark:text-amber-400 font-medium">
                      {row.monthlyFee > 0 ? formatCOP(row.monthlyFee) : "—"}
                    </TableCell>
                  )}
                  <TableCell className="py-3 text-right text-sm tabular-nums text-[#737373] dark:text-[#a1a1aa]">
                    {formatCOP(row.interest)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-sm font-semibold tabular-nums text-[#17181c] dark:text-white">
                    {formatCOP(row.principal)}
                  </TableCell>
                  <TableCell className="py-3 text-right text-sm tabular-nums">
                    {row.extraPayment > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {formatCOP(row.extraPayment)}
                      </span>
                    ) : (
                      <span className="text-[#a1a1aa]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right text-sm font-bold tabular-nums text-[#17181c] dark:text-white">
                    {formatCOP(row.balance)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
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
                        <span className="text-[9px] font-medium text-amber-600 dark:text-amber-400">
                          Extracto
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {row.status === "PENDING" || row.status === "DEFAULTED" ? (
                      <span className="text-xs text-[#737373] dark:text-[#a1a1aa] flex items-center justify-center gap-1 tabular-nums">
                        {daysOverdue > 0 && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                        {daysOverdue}d
                      </span>
                    ) : (
                      <span className="text-xs text-[#a1a1aa]">—</span>
                    )}
                  </TableCell>
                  {onMarkPaid && (
                    <TableCell className="py-3 text-center" sticky>
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
                        <span className="text-xs text-[#a1a1aa]">—</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredSchedule.map((row) => (
          <AmortizationCard
            key={row.month}
            row={row}
            onMarkPaid={onMarkPaid}
          />
        ))}
      </div>

      {filteredSchedule.length === 0 && (
        <div className="py-8 text-center text-sm text-[#737373] dark:text-[#a1a1aa] bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          No hay cuotas que coincidan con el filtro seleccionado.
        </div>
      )}
    </div>
  );
}
