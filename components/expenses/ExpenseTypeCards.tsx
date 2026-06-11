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
  NEEDS: "bg-[#23ad1b]",
  WANTS: "bg-[#e7964d]",
  SAVINGS: "bg-[#617dd5]",
};

const TYPE_PILL: Record<"NEEDS" | "WANTS" | "SAVINGS", string> = {
  NEEDS:
    "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15 text-[#23ad1b] dark:text-[#23ad1b] border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  WANTS:
    "bg-[#e7964d]/10 dark:bg-[#e7964d]/15 text-[#e7964d] dark:text-[#e7964d] border-[#e7964d]/20 dark:border-[#e7964d]/20",
  SAVINGS:
    "bg-[#617dd5]/10 dark:bg-[#617dd5]/15 text-[#617dd5] dark:text-[#617dd5] border-[#617dd5]/20 dark:border-[#617dd5]/20",
};

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
    <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${TYPE_DOT[type]}`}
            aria-hidden="true"
          />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            {TYPE_LABELS[type]}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${TYPE_PILL[type]}`}
        >
          {pct}%
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-[#17181c] dark:text-white">
        {formatCOP(total)}
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5f5f5] dark:bg-white/5"
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
      <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
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
      ? "text-[#617dd5]"
      : savingsRate >= metaPct
        ? "text-[#23ad1b]"
        : deficit
          ? "text-[#e54d4d]"
          : "text-[#e7964d]";

  const barClass =
    savingsRate >= 60
      ? "bg-[#617dd5]"
      : savingsRate >= metaPct
        ? "bg-[#23ad1b]"
        : deficit
          ? "bg-[#e54d4d]"
          : "bg-[#e7964d]";

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
    <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#617dd5]" aria-hidden="true" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Ahorro real
          </p>
        </div>
        <div className="h-8 w-8 rounded-lg bg-[#617dd5]/10 flex items-center justify-center">
          <PiggyBank className="h-4 w-4 text-[#617dd5]" />
        </div>
      </div>
      <p
        className={`text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums ${rateColor}`}
      >
        {deficit ? "" : "+"}
        {savingsRate}%
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[#f5f5f5] dark:bg-white/5"
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
      <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">{rateLabel}</p>
      <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
        Meta: {metaPct}% según regla {rule.needs}/{rule.wants}/{rule.savings}
      </p>
      <p className="text-xs text-[#737373] dark:text-[#a1a1aa] tabular-nums">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
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
