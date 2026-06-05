import { formatCOP } from "@/lib/currency";
import { PiggyBank } from "lucide-react";
import type { BudgetRule } from "@/types";

interface ExpenseTypeCardsProps {
  totals: Record<"NEEDS" | "WANTS" | "SAVINGS", number>;
  income: number;
  rule: BudgetRule;
  savingsRate: number;
  totalEquivalent: number;
}

const TYPE_LABELS: Record<"NEEDS" | "WANTS" | "SAVINGS", string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
};

const TYPE_DOT: Record<"NEEDS" | "WANTS" | "SAVINGS", string> = {
  NEEDS: "bg-emerald-500",
  WANTS: "bg-amber-500",
  SAVINGS: "bg-blue-500",
};

const TYPE_PILL: Record<"NEEDS" | "WANTS" | "SAVINGS", string> = {
  NEEDS: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WANTS: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  SAVINGS: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
};

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

function TypeCard({
  type,
  total,
  limit,
}: {
  type: "NEEDS" | "WANTS" | "SAVINGS";
  total: number;
  limit: number;
}) {
  const pct = limit > 0 ? Math.round((total / limit) * 100) : 0;
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${TYPE_DOT[type]}`}
            aria-hidden="true"
          />
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {TYPE_LABELS[type]}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${TYPE_PILL[type]}`}
        >
          {pct}%
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-stone-900 dark:text-stone-50">
        {formatCOP(total)}
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800"
        role="progressbar"
        aria-valuenow={Math.min(pct, 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all duration-300 ${progressBarClass(pct)}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Límite: {formatCOP(limit)}{" "}
        <span className={pctColor(pct)}>
          {pct > 100 ? `(+${pct - 100}% sobre el límite)` : ""}
        </span>
      </p>
    </div>
  );
}

function SavingsCard({
  savingsRate,
  income,
  totalExpenses,
  rule,
}: {
  savingsRate: number;
  income: number;
  totalExpenses: number;
  rule: BudgetRule;
}) {
  const sobrante = income - totalExpenses;
  const deficit = savingsRate < 0;
  const metaPct = rule.savings;

  const rateColor =
    savingsRate >= 60
      ? "text-blue-600 dark:text-blue-400"
      : savingsRate >= metaPct
        ? "text-emerald-700 dark:text-emerald-400"
        : deficit
          ? "text-rose-700 dark:text-rose-400"
          : "text-amber-700 dark:text-amber-400";

  const barClass =
    savingsRate >= 60
      ? "bg-blue-500"
      : savingsRate >= metaPct
        ? "bg-emerald-500"
        : deficit
          ? "bg-rose-500"
          : "bg-amber-500";

  const barPct = Math.max(0, Math.min(100, savingsRate));
  const rateLabel =
    savingsRate >= 60
      ? "Ahorro excepcional"
      : savingsRate >= metaPct
        ? "Vas en meta"
        : deficit
          ? "Gastando más de lo que ingresa"
          : "Por debajo de la meta";

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Ahorro real
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
          <PiggyBank className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <p
        className={`text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums ${rateColor}`}
      >
        {deficit ? "" : "+"}
        {savingsRate}%
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800"
        role="progressbar"
        aria-valuenow={barPct}
        aria-valuemin={0}
        aria-valuemax={100}
        title={`Meta: ${metaPct}%`}
      >
        <div
          className={`h-full transition-all duration-300 ${barClass}`}
          style={{ width: `${barPct}%` }}
        />
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400">{rateLabel}</p>
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Meta: {metaPct}% según regla {rule.needs}/{rule.wants}/{rule.savings}
      </p>
      <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
        {deficit ? "Faltante" : "Sobrante"}: {formatCOP(Math.abs(sobrante))}
      </p>
    </div>
  );
}

export function ExpenseTypeCards({
  totals,
  income,
  rule,
  savingsRate,
  totalEquivalent,
}: ExpenseTypeCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <TypeCard type="NEEDS" total={totals.NEEDS} limit={income * (rule.needs / 100)} />
      <TypeCard type="WANTS" total={totals.WANTS} limit={income * (rule.wants / 100)} />
      <SavingsCard
        savingsRate={savingsRate}
        income={income}
        totalExpenses={totalEquivalent}
        rule={rule}
      />
    </div>
  );
}
