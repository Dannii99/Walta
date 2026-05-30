import { auth } from "@/lib/auth";
import { getUserSimulations } from "@/server/queries/simulation-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulaciones | Presupuesto Claro",
  description: "Simula decisiones financieras importantes como vehculos o vivienda.",
};

export default async function SimulationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const simulations = await getUserSimulations(session.user.id);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Simulaciones</h1>
        <Link href="/simulations/vehicle">
          <Button>Nueva Simulacin</Button>
        </Link>
      </div>

      {simulations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p className="text-lg mb-2">No tienes simulaciones guardadas</p>
          <p className="text-sm">Crea tu primera simulacin de vehculo para comenzar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulations.map((sim) => {
            const inputs = sim.inputs as { price: number; downPayment: number; term: number; rate: number };
            const result = sim.result as { monthlyPayment: number; verdict: string; availableAfter: number };

            const verdictColors: Record<string, string> = {
              APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
              WARNING: "bg-amber-100 text-amber-800 border-amber-200",
              REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
            };

            const verdictLabels: Record<string, string> = {
              APPROVED: "Aprobado",
              WARNING: "Advertencia",
              REJECTED: "Rechazado",
            };

            return (
              <Card key={sim.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{sim.title}</CardTitle>
                    <Badge variant="outline" className={verdictColors[result.verdict] ?? ""}>
                      {verdictLabels[result.verdict] ?? result.verdict}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio</span>
                    <span className="font-medium">${inputs.price.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cuota inicial</span>
                    <span className="font-medium">${inputs.downPayment.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plazo</span>
                    <span className="font-medium">{inputs.term} meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tasa EA</span>
                    <span className="font-medium">{(inputs.rate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="text-muted-foreground">Pago mensual</span>
                    <span className="font-bold">${result.monthlyPayment.toLocaleString("es-CO")}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
