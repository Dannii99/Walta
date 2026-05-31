import { auth } from "@/lib/auth";
import { getUserLoans } from "@/server/queries/loan-queries";
import { LoanListCard } from "@/components/credits/LoanListCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créditos | Presupuesto Claro",
  description: "Seguimiento de tus créditos y préstamos.",
};

export default async function CreditsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const loans = await getUserLoans(session.user.id);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Créditos</h1>
          <p className="text-muted-foreground text-sm">
            Seguimiento de tus préstamos y créditos activos
          </p>
        </div>
        <Link href="/credits/new">
          <Button>Nuevo crédito</Button>
        </Link>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <span className="text-xl">🆕</span>
            </div>
            <p className="font-medium mb-1">Crear crédito nuevo</p>
            <p className="text-sm text-muted-foreground mb-4">
              Simula y registra un crédito que vas a tomar
            </p>
            <Link href="/credits/new?mode=new">
              <Button variant="outline">Crear nuevo</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <span className="text-xl">📋</span>
            </div>
            <p className="font-medium mb-1">Agregar crédito en curso</p>
            <p className="text-sm text-muted-foreground mb-4">
              Registra un crédito que ya tienes y lleva seguimiento
            </p>
            <Link href="/credits/new?mode=ongoing">
              <Button variant="outline">Agregar existente</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {loans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mis créditos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loans.map((loan) => (
            <LoanListCard key={loan.id} loan={{
              ...loan,
              type: loan.type as "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER",
              formula: loan.formula as "french_ea" | "nominal_monthly",
              status: loan.status as "ACTIVE" | "PAID_OFF" | "DEFAULTED",
              paidInstallments: (loan as unknown as { paidInstallments?: number }).paidInstallments ?? 0,
            }} />
          ))}
          </div>
        </div>
      )}
    </div>
  );
}
