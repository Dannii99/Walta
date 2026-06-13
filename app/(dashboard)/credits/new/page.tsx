import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getActiveLoanCapacity } from "@/server/queries/loan-queries";
import { NewCreditPageClient } from "@/components/credits/NewCreditPageClient";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuevo Crédito | Walta",
  description: "Registra un crédito nuevo o en curso para hacer seguimiento.",
};

interface NewCreditPageProps {
  searchParams: Promise<{ fromSimulation?: string; mode?: string }>;
}

export default async function NewCreditPage({ searchParams }: NewCreditPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const params = await searchParams;
  const fromSimulationId = params.fromSimulation;
  const mode = params.mode === "ongoing" ? "ongoing" : "new";

  let defaultValues = null;

  if (fromSimulationId) {
    const simulation = await prisma.simulation.findUnique({
      where: { id: fromSimulationId },
    });

    if (simulation && simulation.userId === userId) {
      const inputs = simulation.inputs as {
        price?: number;
        downPayment?: number;
        term?: number;
        rate?: number;
        formula?: string;
        fees?: { id: string; name: string; amount: number; type: "monthly" | "upfront" }[];
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
        fees: inputs.fees ?? [],
      };
    }
  }

  const [budgets, capacity] = await Promise.all([
    getUserBudgets(userId),
    getActiveLoanCapacity(userId),
  ]);

  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-4 md:px-6 lg:px-10 pb-18 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/credits">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Créditos
          </Link>
        </Button>
        <div className="rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-6 max-w-2xl">
          <h1 className="text-lg font-bold text-stone-900 dark:text-stone-50 mb-2">
            Necesitas un presupuesto activo
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Crea primero tu presupuesto con ingresos y categorías para poder
            registrar créditos y hacer seguimiento.
          </p>
          <Button asChild className="mt-4">
            <Link href="/onboarding">Crear presupuesto</Link>
          </Button>
        </div>
      </div>
    );
  }

  const income = parseFloat(budget.income);

  const totalMonthlyExpenses = budget.categories.reduce((sum, cat) => {
    return (
      sum +
      cat.transactions.reduce(
        (s, t) => s + parseFloat(t.amount),
        0
      )
    );
  }, 0);

  const availableMoney = Math.max(0, income - totalMonthlyExpenses);

  const isOngoing = mode === "ongoing";
  const titleText = isOngoing ? "Crédito en curso" : "Nuevo crédito";
  const subtitleText = isOngoing
    ? "Registra un crédito que ya tienes en marcha para hacer seguimiento."
    : defaultValues
      ? "Revisa los datos precargados desde la simulación y guarda el crédito."
      : "Completa los datos de tu crédito para empezar el seguimiento.";

  return (
    <NewCreditPageClient
      mode={mode}
      defaultValues={defaultValues}
      availableMoney={availableMoney}
      income={income}
      activeLoansCount={capacity.count}
      activeLoansMonthly={capacity.totalMonthly}
      isOngoing={isOngoing}
      titleText={titleText}
      subtitleText={subtitleText}
    />
  );
}
