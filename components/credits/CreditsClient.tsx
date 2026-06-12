"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { CreditsKPI } from "@/components/credits/CreditsKPI";
import { CreditCard } from "@/components/credits/CreditCard";
import { CreditsFilters, type CreditsFiltersValue } from "@/components/credits/CreditsFilters";
import { CreditsFilterSheet } from "@/components/credits/CreditsFilterSheet";
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
  const [sheetOpen, setSheetOpen] = useState(false);

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
        <div className="rounded-2xl p-8 md:p-12 text-center space-y-3 bg-white dark:bg-[#17181c]">
          <p className="text-base font-bold text-[#17181c] dark:text-white">
            Crea un presupuesto primero
          </p>
          <p className="text-sm text-[#737373] dark:text-[#a1a1aa] max-w-md mx-auto">
            Para registrar créditos necesitas un presupuesto activo que defina tu ingreso.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center h-9 px-4 mt-2 text-sm font-semibold rounded-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
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
        onOpenFilterSheet={() => setSheetOpen(true)}
      />

      <CreditsFilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onChange={setFilters}
      />

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center bg-white dark:bg-[#17181c]">
          <p className="text-sm font-semibold text-[#17181c] dark:text-white">
            Sin resultados
          </p>
          <p className="text-xs text-[#737373] dark:text-[#a1a1aa] mt-1">
            Ajusta los filtros para ver otros créditos.
          </p>
          <button
            type="button"
            onClick={() => setFilters(INITIAL_FILTERS)}
            className="inline-flex items-center h-8 px-3 mt-3 text-xs font-semibold rounded-full border border-[#e8e8e8] dark:border-[#2a2a2e] text-[#17181c] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e] transition-colors"
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
        <div className="flex items-center gap-2 text-[#737373] dark:text-[#a1a1aa]">
          <Landmark className="h-3.5 w-3.5" />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Módulo de créditos
          </p>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white">
          Mis créditos
        </h1>
        <p className="text-sm text-[#737373] dark:text-[#a1a1aa] max-w-md">
          Visualiza, registra y haz seguimiento al progreso de tus préstamos.
        </p>
      </div>
      <NewCreditButton />
    </div>
  );
}
