import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SimulationNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 md:px-6 lg:px-10 space-y-4 max-w-360 mx-auto">
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">
        Simulación no encontrada
      </h2>
      <p className="text-sm text-stone-600 dark:text-stone-400 text-center max-w-md">
        Esta simulación no existe o ya fue eliminada.
      </p>
      <Button asChild variant="outline">
        <Link href="/simulations">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Volver a simulaciones
        </Link>
      </Button>
    </div>
  );
}
