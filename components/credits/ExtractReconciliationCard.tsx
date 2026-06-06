"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { toast } from "sonner";
import { syncPaidInstallmentsAction } from "@/server/actions/loan-actions";

interface ExtractReconciliationCardProps {
  loanId: string;
  termMonths: number;
  initialPaidInstallments: number;
  onActualMonthlyChange: (value: number | null) => void;
}

export function ExtractReconciliationCard({
  loanId,
  termMonths,
  initialPaidInstallments,
  onActualMonthlyChange,
}: ExtractReconciliationCardProps) {
  const [paidInstallments, setPaidInstallments] = useState(
    initialPaidInstallments
  );
  const [actualMonthlyPayment, setActualMonthlyPayment] = useState(0);
  const [isSyncingInstallments, startInstallmentsSync] = useTransition();

  const handleApplyInstallments = () => {
    startInstallmentsSync(async () => {
      try {
        const result = await syncPaidInstallmentsAction(
          loanId,
          paidInstallments
        );
        toast.success("Cuotas pagadas actualizadas", {
          description: `${result.paidInstallments} de ${result.termMonths} cuotas marcadas como pagadas.`,
        });
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "No se pudo actualizar el número de cuotas pagadas."
        );
      }
    });
  };

  const handleActualMonthlyChange = (value: number) => {
    setActualMonthlyPayment(value);
    onActualMonthlyChange(value > 0 ? value : null);
  };

  const advance = Math.max(0, termMonths - paidInstallments);
  const isFullyPaid = paidInstallments >= termMonths;
  const hasChanges = paidInstallments !== initialPaidInstallments;

  return (
    <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
          <FileText className="h-3.5 w-3.5" strokeWidth={2.3} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Tu crédito en el extracto
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Compara lo que dice tu banco con nuestros cálculos
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paid-installments">
          Cuotas pagadas según tu extracto
        </Label>
        <div className="flex gap-2 items-stretch">
          <div className="flex-1">
            <Input
              id="paid-installments"
              type="number"
              min={0}
              max={termMonths}
              maxLength={3}
              value={paidInstallments}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setPaidInstallments(0);
                  return;
                }
                const n = Number(val);
                if (Number.isFinite(n) && n >= 0) {
                  setPaidInstallments(Math.min(n, termMonths));
                }
              }}
              placeholder="0"
              className="text-lg font-bold tabular-nums"
            />
          </div>
          <div className="flex items-center text-sm text-stone-500 dark:text-stone-400 px-2 font-medium tabular-nums">
            / {termMonths}
          </div>
          <Button
            type="button"
            onClick={handleApplyInstallments}
            disabled={isSyncingInstallments || !hasChanges}
            size="sm"
            className="shrink-0"
          >
            {isSyncingInstallments ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Aplicando
              </>
            ) : hasChanges ? (
              <>
                Aplicar
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Sincronizado
              </>
            )}
          </Button>
        </div>
        <p className="text-[11px] text-stone-500 dark:text-stone-400">
          {isFullyPaid ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Tu extracto indica que el crédito ya está liquidado.
            </span>
          ) : (
            <>
              Adelanto: {paidInstallments} cuotas pagadas · {advance} pendientes
            </>
          )}
        </p>
      </div>

      <div className="space-y-2 pt-3 border-t border-stone-200/60 dark:border-stone-800">
        <Label htmlFor="actual-monthly-payment">
          Cuota mensual real de tu extracto
        </Label>
        <CurrencyInput
          id="actual-monthly-payment"
          value={actualMonthlyPayment}
          onValueChange={handleActualMonthlyChange}
          placeholder="Ej: $ 550.000"
        />
        <p className="text-[11px] text-stone-500 dark:text-stone-400">
          Ingresa la cuota exacta que el banco te cobra. La usaremos para
          verificar que nuestros cálculos coincidan.
        </p>
      </div>

      {paidInstallments > 0 && !isFullyPaid && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-xs text-blue-800 dark:text-blue-200"
        >
          <p className="leading-relaxed">
            <strong>Tip:</strong> las primeras {paidInstallments} cuotas se
            marcarán como pagadas en tu tabla de amortización. Los abonos a
            capital son independientes y no cuentan como cuota.
          </p>
        </motion.div>
      )}
    </div>
  );
}
