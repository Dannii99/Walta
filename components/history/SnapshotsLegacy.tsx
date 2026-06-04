import { HistoryChart } from "@/components/history/HistoryChart";
import { MonthlySnapshotCard } from "@/components/history/MonthlySnapshotCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { MonthlySnapshot } from "@/types";

interface SnapshotsLegacyProps {
  snapshots: MonthlySnapshot[];
}

export function SnapshotsLegacy({ snapshots }: SnapshotsLegacyProps) {
  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
        <Info className="h-4 w-4 text-amber-700 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-300">
          Sección legacy
        </AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-400">
          Estos son los cierres contables manuales que generaste antes del
          rediseño. No se crean nuevos snapshots automáticamente: las
          decisiones, simulaciones, créditos y pagos ahora viven en la pestaña
          &quot;Línea de tiempo&quot;.
        </AlertDescription>
      </Alert>

      {snapshots.length === 0 ? (
        <div className="text-center py-12 text-stone-500 dark:text-stone-400 text-sm">
          No hay snapshots manuales registrados.
        </div>
      ) : (
        <>
          <HistoryChart snapshots={snapshots} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {snapshots.map((snapshot) => (
              <MonthlySnapshotCard key={snapshot.id} snapshot={snapshot} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
