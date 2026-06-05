import { formatCOP } from "@/lib/currency";
import { TrendingUp, Calendar, Percent } from "lucide-react";

interface ExpenseSummaryProps {
  totalEquivalent: number;
  oneTimeTotal: number;
  income: number;
}

function pctColor(pct: number): string {
  if (pct > 100) return "text-rose-700 dark:text-rose-400";
  if (pct > 70) return "text-amber-700 dark:text-amber-400";
  return "text-emerald-700 dark:text-emerald-400";
}

function progressBarClass(pct: number): string {
  if (pct > 100) return "bg-rose-500";
  if (pct > 70) return "bg-amber-500";
  return "bg-emerald-500";
}

export function ExpenseSummary({
  totalEquivalent,
  oneTimeTotal,
  income,
}: ExpenseSummaryProps) {
  const incomePct =
    income > 0 ? Math.round((totalEquivalent / income) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Equivalente mensual
          </p>
          <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
          {formatCOP(totalEquivalent)}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Suma de todos tus gastos del mes
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Únicos
          </p>
          <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
          {formatCOP(oneTimeTotal)}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Cargos puntuales
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Del ingreso
          </p>
          <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
            <Percent className="h-4 w-4 text-stone-600 dark:text-stone-300" />
          </div>
        </div>
        <p
          className={`text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums ${pctColor(incomePct)}`}
        >
          {incomePct}%
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800"
          role="progressbar"
          aria-valuenow={Math.min(incomePct, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full transition-all duration-300 ${progressBarClass(incomePct)}`}
            style={{ width: `${Math.min(incomePct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          {income > 0
            ? `${formatCOP(totalEquivalent)} de ${formatCOP(income)}`
            : "Sin ingresos configurados"}
        </p>
      </div>
    </div>
  );
}
