import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LoanForm } from "@/components/credits/LoanForm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Credito | Presupuesto Claro",
  description: "Crea un nuevo credito para seguimiento.",
};

interface NewCreditPageProps {
  searchParams: Promise<{ fromSimulation?: string; mode?: string }>;
}

export default async function NewCreditPage({ searchParams }: NewCreditPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const fromSimulationId = params.fromSimulation;
  const mode = params.mode === "ongoing" ? "ongoing" : "new";

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
        price: inputs.price ?? 0,
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

  // Fetch budget to calculate available money for capacity preview
  const budget = await prisma.budget.findFirst({
    where: { userId: session.user.id },
    include: {
      categories: {
        include: {
          transactions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let availableMoney = 0;
  if (budget) {
    const income = Number(budget.income);
    const totalExpenses = budget.categories.reduce(
      (sum, cat) =>
        sum +
        cat.transactions.reduce(
          (catSum, tx) => catSum + Number(tx.amount),
          0
        ),
      0
    );
    availableMoney = income - totalExpenses;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "ongoing" ? "Agregar Credito en Curso" : "Nuevo Credito"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {mode === "ongoing"
            ? "Registra un credito que ya tienes en marcha para hacer seguimiento."
            : defaultValues
              ? "Revisa los datos precargados desde la simulacion y guarda el credito."
              : "Completa los datos de tu credito para empezar el seguimiento."}
        </p>
      </div>

      <LoanForm mode={mode} defaultValues={defaultValues} availableMoney={availableMoney} />
    </div>
  );
}
