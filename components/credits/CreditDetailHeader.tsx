"use client";

import Link from "next/link";
import { Pencil, Trash2, ArrowLeft, Car, Wallet, Home, CreditCard as CreditCardIcon, Receipt, Zap } from "lucide-react";
import { loanTypeLabel, loanTypeIconBg, loanStatusLabel, loanStatusConfig, loanFormulaLabel } from "@/lib/credit-types";
import { formatCOP } from "@/lib/currency";
import { getCurrentEffectiveMonthlyPayment } from "@/lib/loan-fees";
import { getCurrentEffectiveLoanPayment } from "@/lib/loan-engine";
import { cn } from "@/lib/utils";
import type { Loan, LoanPayment, LoanExtraPayment } from "@/types";

const TYPE_ICON: Record<string, typeof Car> = {
  VEHICLE: Car,
  PERSONAL: Wallet,
  HOUSING: Home,
  OTHER: CreditCardIcon,
};

interface CreditDetailHeaderProps {
  loan: Loan & { payments: LoanPayment[]; extraPayments: LoanExtraPayment[] };
  onDelete: () => void;
  isDeleting: boolean;
  tabs: { key: string; label: string; icon: typeof Receipt }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  onOpenActions?: () => void;
}

export function CreditDetailHeader({
  loan,
  onDelete,
  isDeleting,
  tabs,
  activeTab,
  onTabChange,
  onOpenActions,
}: CreditDetailHeaderProps) {
  const statusConfig = loanStatusConfig(loan.status);
  const TypeIcon = TYPE_ICON[loan.type] ?? CreditCardIcon;
  const bankMonthly = parseFloat(loan.monthlyPayment);
  const currentCuota = getCurrentEffectiveLoanPayment(loan);
  const totalMonthly = getCurrentEffectiveMonthlyPayment(loan);
  const cargosMonthly = totalMonthly - currentCuota;

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/credits"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#737373] dark:text-[#a1a1aa] hover:text-[#17181c] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Volver a créditos
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 min-w-0">
          <div
            className={cn(
              "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center shrink-0",
              loanTypeIconBg(loan.type)
            )}
          >
            <TypeIcon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
              {loanTypeLabel(loan.type)} · {loanFormulaLabel(loan.formula)}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white truncate">
              {loan.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                  statusConfig.badge
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {loanStatusLabel(loan.status)}
              </span>
              <span className="text-xs text-[#737373] dark:text-[#a1a1aa] tabular-nums">
                Cuota {formatCOP(totalMonthly)} · {loan.termMonths} meses
                {cargosMonthly > 0 && (
                  <span className="block text-[10px] font-normal text-[#737373] dark:text-[#a1a1aa] mt-0.5">
                    Banco {formatCOP(bankMonthly)} + Cargos {formatCOP(cargosMonthly)}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {onOpenActions && (
            <button
              type="button"
              onClick={onOpenActions}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white hover:bg-[#fafafa] dark:hover:bg-[#2a2a2e] transition-colors"
              aria-label="Abrir acciones rápidas"
            >
              <Zap className="h-3.5 w-3.5" />
              Acciones
            </button>
          )}
          <Link
            href={`/credits/${loan.id}/edit`}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] text-[#17181c] dark:text-white hover:bg-[#fafafa] dark:hover:bg-[#2a2a2e] transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Editar
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-full border border-rose-200 dark:border-rose-900 bg-white dark:bg-[#17181c] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div className="border-b border-[#e8e8e8] dark:border-[#2a2a2e]">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                data-active={isActive}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "border-[#17181c] text-[#17181c] dark:border-white dark:text-white"
                    : "border-transparent text-[#737373] dark:text-[#a1a1aa] hover:text-[#17181c] dark:hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
