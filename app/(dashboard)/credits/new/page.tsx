import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoanForm } from "@/components/credits/LoanForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Crédito | Presupuesto Claro",
  description: "Crea un nuevo crédito para seguimiento.",
};

interface NewCreditPageProps {
  searchParams: Promise<{ fromSimulation?: string }>;
}

export default async function NewCreditPage({ searchParams }: NewCreditPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const fromSimulationId = params.fromSimulation;

  let defaultValues = null;

  if (fromSimulationId) {
    const simulation = await prisma.simulation.findUnique({
      where: { id: fromSimulationId },
    });

    if (simulation && simulation.userId === session.user.id) {
      const inputs = simulation.inputs as {
        price?: number;
        downPayment?: number;
        term?: number;
        rate?: number;
        formula?: string;
      };
      const result = simulation.result as {
        monthlyPayment?: number;
        totalInterest?: number;
        totalCost?: number;
      };

      defaultValues = {
        title: simulation.title,
        type: simulation.type.toLowerCase(),
        principal: (inputs.price ?? 0) - (inputs.downPayment ?? 0),
        downPayment: inputs.downPayment ?? 0,
        annualRate: inputs.rate ?? 0,
        termMonths: inputs.term ?? 0,
        formula: inputs.formula ?? "french_ea",
        monthlyPayment: result.monthlyPayment ?? 0,
        totalInterest: result.totalInterest ?? 0,
        totalCost: result.totalCost ?? 0,
        simulationId: simulation.id,
      };
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Crédito</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {defaultValues
            ? "Revisa los datos precargados desde la simulación y guarda el crédito."
            : "Completa los datos de tu crédito para empezar el seguimiento."}
        </p>
      </div>

      <LoanForm defaultValues={defaultValues} />
    </div>
  );
}
