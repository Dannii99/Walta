"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <h2 className="text-xl font-semibold">Error al cargar el crédito</h2>
          <p className="text-muted-foreground text-sm">
            {error.message || "Ocurrió un error inesperado."}
          </p>
          <div className="flex gap-3">
            <Button onClick={reset}>Reintentar</Button>
            <Link href="/credits">
              <Button variant="outline">Volver a créditos</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
