"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CreateFromSimulationButtonProps {
  simulationId: string;
}

export function CreateFromSimulationButton({ simulationId }: CreateFromSimulationButtonProps) {
  return (
    <Link href={`/credits/new?fromSimulation=${simulationId}`}>
      <Button variant="outline" size="sm" className="gap-1">
        Iniciar seguimiento
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </Link>
  );
}
