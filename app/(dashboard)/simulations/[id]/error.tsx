"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SimulationDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Simulation detail error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 md:px-6 lg:px-10 space-y-4 max-w-360 mx-auto">
      <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
        No pudimos cargar la simulación
      </h2>
      <p className="text-sm text-stone-600 dark:text-stone-400 text-center max-w-md">
        Hubo un error al obtener los datos. Intenta nuevamente o vuelve a la
        lista de simulaciones.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset}>Reintentar</Button>
        <Button asChild variant="outline">
          <Link href="/simulations">Volver a simulaciones</Link>
        </Button>
      </div>
    </div>
  );
}
