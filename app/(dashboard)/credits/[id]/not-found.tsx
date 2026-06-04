import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreditNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 md:px-6 lg:px-10 space-y-4 max-w-2xl mx-auto text-center">
      <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
        <SearchX className="h-7 w-7 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
          404 · Crédito no encontrado
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
          Este crédito no existe
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Puede que haya sido eliminado o que el enlace no sea válido. Vuelve a la lista para ver tus créditos activos.
        </p>
      </div>
      <Button asChild>
        <Link href="/credits">
          <ArrowLeft className="h-4 w-4" />
          Volver a créditos
        </Link>
      </Button>
    </div>
  );
}
