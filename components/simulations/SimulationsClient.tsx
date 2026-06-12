"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Calculator, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SimulationsKPI } from "./SimulationsKPI";
import { AIInsightsBanner } from "./AIInsightsBanner";
import { SimulationCard } from "./SimulationCard";
import { SimulationsFilters, type FilterState, DEFAULT_FILTERS } from "./SimulationsFilters";
import { SimulationFilterSheet } from "./SimulationFilterSheet";
import { EmptySimulationsState } from "./EmptySimulationsState";
import {
  parseSimulationInputs,
  parseSimulationResult,
} from "@/lib/simulation-types";

interface SimulationsClientProps {
  simulations: Array<{
    id: string;
    type: string;
    title: string;
    inputs: unknown;
    result: unknown;
    createdAt: Date;
  }>;
  stats: {
    total: number;
    sumMonthlyPayments: number;
    viableCount: number;
    riskyCount: number;
  };
  hasBudget: boolean;
}

export function SimulationsClient({
  simulations,
  stats,
  hasBudget,
}: SimulationsClientProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const filteredSimulations = useMemo(() => {
    return simulations.filter((sim) => {
      const result = parseSimulationResult(sim.result);

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!sim.title.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.type !== "all" && sim.type !== filters.type) {
        return false;
      }

      if (filters.verdict !== "all" && result.verdict !== filters.verdict) {
        return false;
      }

      return true;
    });
  }, [simulations, filters]);

  const hasSimulations = simulations.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            Tus decisiones
          </p>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#17181c] dark:text-white shrink-0">
              <Calculator className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-tight">
              Simulaciones
            </h1>
          </div>
          <p className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium max-w-2xl">
            Evalúa compras grandes antes de comprometerte. Te mostramos el
            impacto en tu presupuesto mes a mes.
          </p>
          {hasSimulations && <AIInsightsBanner />}
        </div>
        {hasBudget && (
          <Button
            asChild
            className="hidden md:inline-flex bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5] shadow-sm"
          >
            <Link href="/simulations/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva simulación
            </Link>
          </Button>
        )}
      </div>

      {/* KPIs */}
      {hasSimulations && (
        <SimulationsKPI
          total={stats.total}
          sumMonthlyPayments={stats.sumMonthlyPayments}
          viableCount={stats.viableCount}
          riskyCount={stats.riskyCount}
        />
      )}

      {/* No budget state */}
      {!hasBudget && <EmptyBudgetState />}

      {/* Filters */}
      {hasSimulations && (
        <SimulationsFilters
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
          totalCount={simulations.length}
          filteredCount={filteredSimulations.length}
          onOpenFilterSheet={() => setFilterSheetOpen(true)}
        />
      )}

      {/* Mobile filter sheet */}
      <SimulationFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onChange={setFilters}
      />

      {/* Empty state */}
      {hasBudget && !hasSimulations && <EmptySimulationsState />}

      {/* Card grid */}
      {hasSimulations && filteredSimulations.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.04 },
            },
          }}
        >
          {filteredSimulations.map((sim) => (
            <SimulationCard
              key={sim.id}
              simulation={{
                id: sim.id,
                type: sim.type,
                title: sim.title,
                createdAt: sim.createdAt.toISOString(),
              }}
              inputs={parseSimulationInputs(sim.inputs)}
              result={parseSimulationResult(sim.result)}
            />
          ))}
        </motion.div>
      )}

      {/* No results state */}
      {hasSimulations && filteredSimulations.length === 0 && (
        <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-[#17181c] dark:text-white">
            Sin resultados
          </p>
          <p className="text-xs text-[#737373] dark:text-[#a1a1aa]">
            No encontramos simulaciones que coincidan con los filtros
            aplicados.
          </p>
        </div>
      )}

      {/* Mobile FAB */}
      {hasBudget && (
        <Link
          href="/simulations/new"
          className="fixed bottom-[160px] right-4 md:hidden z-30 h-14 w-14 rounded-full bg-[#26be15] hover:bg-[#23ad1b] text-white shadow-lg flex items-center justify-center transition-colors"
          aria-label="Nueva simulación"
        >
          <Plus className="h-6 w-6" />
        </Link>
      )}
    </div>
  );
}

function EmptyBudgetState() {
  return (
    <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-[#e7964d]/10 dark:bg-[#e7964d]/15 flex items-center justify-center shrink-0">
        <SlidersHorizontal className="h-5 w-5 text-[#e7964d]" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-bold text-[#17181c] dark:text-white">
          Necesitas un presupuesto activo
        </h3>
        <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
          Crea primero tu presupuesto con ingresos y categorías para poder
          simular créditos y compras.
        </p>
        <Button asChild size="sm" className="mt-2 bg-[#26be15] hover:bg-[#23ad1b] text-white">
          <Link href="/onboarding">Crear presupuesto</Link>
        </Button>
      </div>
    </div>
  );
}
