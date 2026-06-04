"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { CreditsKPI } from "@/components/credits/CreditsKPI";
import { CreditCard } from "@/components/credits/CreditCard";
import { CreditsFilters, type CreditsFiltersValue } from "@/components/credits/CreditsFilters";
import { EmptyCreditsState } from "@/components/credits/EmptyCreditsState";
import { NewCreditButton } from "@/components/credits/NewCreditButton";
import { AILoanInsightsBanner } from "@/components/credits/AILoanInsightsBanner";

interface LoanListItem {
  id: string;
  title: string;
  type: string;
  status: string;
  principal: string;
  downPayment: string;
  monthlyPayment: string;
  termMonths: number;
  annualRate: string;
  formula: string;
  startDate: Date;
  createdAt: Date;
  fees: Array<{ id: string; name: string; amount: number; type: "monthly" | "upfront" }>;
  paymentsCount: number;
  extrasCount: number;
}

interface LoanStats {
  total: number;
  active: number;
  paidOff: number;
  defaulted: number;
  totalPrincipal: number;
  totalMonthlyPayment: number;
  totalRemaining: number;
}

interface CreditsClientProps {
  loans: LoanListItem[];
  stats: LoanStats;
  hasBudget: boolean;
}

const INITIAL_FILTERS: CreditsFiltersValue = {
  query: "",
  status: "all",
  type: "all",
};

export function CreditsClient({ loans, stats, hasBudget }: CreditsClientProps) {
  const [filters, setFilters] = useState<CreditsFiltersValue>(INITIAL_FILTERS);

  const filtered = useMemo(() => {
    return loans.filter((loan) => {
      if (filters.status !== "all" && loan.status !== filters.status) return false;
      if (filters.type !== "all" && loan.type !== filters.type) return false;
      if (filters.query.trim() !== "") {
        const q = filters.query.toLowerCase();
        if (!loan.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [loans, filters]);

  if (!hasBudget) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-8 md:p-12 text-center space-y-3 bg-stone-50/50 dark:bg-stone-800/20">
          <p className="text-base font-bold text-stone-900 dark:text-stone-50">
            Crea un presupuesto primero
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Para registrar créditos necesitas un presupuesto activo que defina tu ingreso.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center h-9 px-4 mt-2 text-sm font-semibold rounded-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            Empezar
          </Link>
        </div>
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <EmptyCreditsState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <AILoanInsightsBanner />

      <CreditsKPI
        total={stats.total}
        active={stats.active}
        paidOff={stats.paidOff}
        totalMonthlyPayment={stats.totalMonthlyPayment}
        defaulted={stats.defaulted}
      />

      <CreditsFilters
        value={filters}
        onChange={setFilters}
        total={loans.length}
        filtered={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-12 text-center">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
            Sin resultados
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Ajusta los filtros para ver otros créditos.
          </p>
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="inline-flex items-center h-8 px-3 mt-3 text-xs font-semibold rounded-full border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((loan, i) => (
            <CreditCard key={loan.id} loan={loan} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <Landmark className="h-3.5 w-3.5" />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Módulo de créditos
          </p>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
          Mis créditos
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">
          Visualiza, registra y haz seguimiento al progreso de tus préstamos.
        </p>
      </div>
      <NewCreditButton />
    </div>
  );
}
