"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HistoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("History error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 space-y-4 max-w-md mx-auto">
      <Alert variant="destructive" icon={AlertTriangle}>
        <AlertTitle>Error al cargar el historial</AlertTitle>
        <AlertDescription>
          No se pudo cargar la línea de tiempo. Intenta nuevamente.
        </AlertDescription>
      </Alert>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
