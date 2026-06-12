"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { SimulationDetailHeader } from "./SimulationDetailHeader";
import { SimulationBreakdown } from "./SimulationBreakdown";
import { AIAdvisorSheet } from "./AIAdvisorSheet";
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
  const [aiOpen, setAiOpen] = useState(false);
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
        onOpenAI={() => setAiOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <SimulationBreakdown
            inputs={inputs}
            result={result}
            availableMoney={availableMoney}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#17181c] dark:text-white">
              ¿Listo para empezar?
            </h3>
            <p className="text-xs text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
              Convierte esta simulación en un crédito real para llevar el
              seguimiento de tus pagos mes a mes.
            </p>
            <Button
              asChild
              className="w-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
            >
              <Link href={`/credits/new?fromSimulation=${simulation.id}`}>
                Iniciar seguimiento
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-[#e54d4d] hover:bg-[#e54d4d]/10 dark:hover:bg-[#e54d4d]/10 hover:text-[#c43939] dark:hover:text-[#c43939]"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Eliminar simulación
            </Button>
          </div>
        </div>
      </div>

      <AIAdvisorSheet
        open={aiOpen}
        onOpenChange={setAiOpen}
        simulationId={simulation.id}
      />

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
