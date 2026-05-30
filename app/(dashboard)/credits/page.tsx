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

      {loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg text-muted-foreground mb-2">
              No tienes créditos registrados
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Crea tu primer crédito para empezar a hacer seguimiento
            </p>
            <Link href="/credits/new">
              <Button>Crear mi primer crédito</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loans.map((loan) => (
            <LoanListCard key={loan.id} loan={{
              ...loan,
              type: loan.type as "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER",
              formula: loan.formula as "french_ea" | "nominal_monthly",
              status: loan.status as "ACTIVE" | "PAID_OFF" | "DEFAULTED",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
