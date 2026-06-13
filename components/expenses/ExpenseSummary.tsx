import { formatCOP } from "@/lib/currency";
import { TrendingUp, Calendar, Percent } from "lucide-react";

interface ExpenseSummaryProps {
  totalEquivalent: number;
  oneTimeTotal: number;
  income: number;
}

function pctColor(pct: number): string {
  if (pct > 100) return "text-[#e54d4d]";
  if (pct > 70) return "text-[#e7964d]";
  return "text-[#23ad1b]";
}

function progressBarClass(pct: number): string {
  if (pct > 100) return "bg-[#e54d4d]";
  if (pct > 70) return "bg-[#e7964d]";
  return "bg-[#23ad1b]";
}

export function ExpenseSummary({
  totalEquivalent,
  oneTimeTotal,
  income,
}: ExpenseSummaryProps) {
  const incomePct =
    income > 0 ? Math.round((totalEquivalent / income) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Equivalente mensual
          </p>
          <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-[#617dd5] dark:text-[#617dd5]" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
          {formatCOP(totalEquivalent)}
        </p>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
          Suma de todos tus gastos del mes
        </p>
      </div>

      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Únicos
          </p>
          <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-[#e7964d] dark:text-[#e7964d]" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
          {formatCOP(oneTimeTotal)}
        </p>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
          Cargos puntuales
        </p>
      </div>

      <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Del ingreso
          </p>
          <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 flex items-center justify-center">
            <Percent className="h-4 w-4 text-[#e54d4d] dark:text-[#e54d4d]" />
          </div>
        </div>
        <p
          className={`text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums ${pctColor(incomePct)}`}
        >
          {incomePct}%
        </p>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5f5f5] dark:bg-white/5"
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
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
          {income > 0
            ? `${formatCOP(totalEquivalent)} de ${formatCOP(income)}`
            : "Sin ingresos configurados"}
        </p>
      </div>
    </div>
  );
}
