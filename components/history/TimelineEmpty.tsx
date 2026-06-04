"use client";

import { History, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TimelineEmptyProps {
  hasBudget: boolean;
}

export function TimelineEmpty({ hasBudget }: TimelineEmptyProps) {
  return (
    <div className="text-center py-12 md:py-16 px-4 space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800">
        <History className="h-7 w-7 text-stone-500 dark:text-stone-400" strokeWidth={1.8} />
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Tu línea de tiempo está vacía
        </h3>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Las simulaciones, créditos, pagos y abonos que registres aparecerán
          aquí en orden cronológico. Es la historia de tus decisiones
          financieras, sin cierres contables manuales.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {hasBudget ? (
          <>
            <Button asChild size="sm">
              <Link href="/simulations/new">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Simular una decisión
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/credits/new">Crear un crédito</Link>
            </Button>
          </>
        ) : (
          <Button asChild size="sm">
            <Link href="/onboarding">Configurar mi presupuesto</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
