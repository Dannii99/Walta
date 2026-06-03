"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Calculator, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SimulationsKPI } from "./SimulationsKPI";
import { AIInsightsBanner } from "./AIInsightsBanner";
import { SimulationCard } from "./SimulationCard";
import { SimulationsFilters, type FilterState } from "./SimulationsFilters";
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
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    verdict: "all",
  });

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
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Tus decisiones
          </p>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 shrink-0">
              <Calculator className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
              Simulaciones
            </h1>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-medium max-w-2xl">
            Evalúa compras grandes antes de comprometerte. Te mostramos el
            impacto en tu presupuesto mes a mes.
          </p>
        </div>
        {hasBudget && (
          <Button
            asChild
            className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm"
          >
            <Link href="/simulations/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva simulación
            </Link>
          </Button>
        )}
      </div>

      {hasSimulations && (
        <SimulationsKPI
          total={stats.total}
          sumMonthlyPayments={stats.sumMonthlyPayments}
          viableCount={stats.viableCount}
          riskyCount={stats.riskyCount}
        />
      )}

      {hasSimulations && <AIInsightsBanner />}

      {!hasBudget && <EmptyBudgetState />}

      {hasSimulations && (
        <SimulationsFilters
          filters={filters}
          onChange={setFilters}
          totalCount={simulations.length}
          filteredCount={filteredSimulations.length}
        />
      )}

      {hasBudget && !hasSimulations && <EmptySimulationsState />}

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

      {hasSimulations && filteredSimulations.length === 0 && (
        <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-10 text-center space-y-2">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
            Sin resultados
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            No encontramos simulaciones que coincidan con los filtros
            aplicados.
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyBudgetState() {
  return (
    <div className="rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-5 md:p-6 flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
        <SlidersHorizontal className="h-5 w-5 text-amber-700 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
          Necesitas un presupuesto activo
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
          Crea primero tu presupuesto con ingresos y categorías para poder
          simular créditos y compras.
        </p>
        <Button asChild size="sm" className="mt-2">
          <Link href="/onboarding">Crear presupuesto</Link>
        </Button>
      </div>
    </div>
  );
}
