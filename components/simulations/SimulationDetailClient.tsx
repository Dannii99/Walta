"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { SimulationDetailHeader } from "./SimulationDetailHeader";
import { SimulationBreakdown } from "./SimulationBreakdown";
import { AIAdvisorCard } from "./AIAdvisorCard";
import { DeleteSimulationDialog } from "./DeleteSimulationDialog";
import { Button } from "@/components/ui/button";
import { deleteSimulation } from "@/server/actions/simulation-actions";
import { invalidateInsightsCache } from "@/server/actions/ai-actions";
import type {
  SimulationInputRow,
  SimulationResultRow,
} from "@/lib/simulation-types";

interface SimulationDetailClientProps {
  simulation: {
    id: string;
    type: string;
    title: string;
    createdAt: string;
  };
  inputs: SimulationInputRow;
  result: SimulationResultRow;
  availableMoney: number;
}

export function SimulationDetailClient({
  simulation,
  inputs,
  result,
  availableMoney,
}: SimulationDetailClientProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const handleDelete = async () => {
    startDelete(async () => {
      try {
        await deleteSimulation(simulation.id);
        await invalidateInsightsCache();
        toast.success("Simulación eliminada");
        router.push("/simulations");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "No se pudo eliminar";
        toast.error(message);
        throw err;
      }
    });
  };

  return (
    <div className="space-y-6">
      <SimulationDetailHeader
        simulation={simulation}
        verdict={result.verdict}
        onDelete={() => setDeleteOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <SimulationBreakdown
            inputs={inputs}
            result={result}
            availableMoney={availableMoney}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AIAdvisorCard simulationId={simulation.id} />

          <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 md:p-6 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
              ¿Listo para empezar?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Convierte esta simulación en un crédito real para llevar el
              seguimiento de tus pagos mes a mes.
            </p>
            <Button
              asChild
              className="w-full bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
            >
              <Link href={`/credits/new?fromSimulation=${simulation.id}`}>
                Iniciar seguimiento
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Eliminar simulación
            </Button>
          </div>
        </div>
      </div>

      <DeleteSimulationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        simulation={{
          id: simulation.id,
          title: simulation.title,
          type: simulation.type,
          monthlyPayment: result.monthlyPayment,
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
