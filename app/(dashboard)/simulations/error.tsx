"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SimulationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Simulations error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
      <h2 className="text-xl font-bold">Error al cargar simulaciones</h2>
      <p className="text-muted-foreground text-center max-w-md">
        No se pudieron cargar las simulaciones. Intenta nuevamente.
      </p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
