import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileSignature } from "lucide-react";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { getActiveLoanCapacity } from "@/server/queries/loan-queries";
import { getMonthlyEquivalent } from "@/lib/recurrence";
import { LoanForm } from "@/components/credits/LoanForm";
import { AvailableCreditCard } from "@/components/credits/AvailableCreditCard";
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

  const [budgets, capacity] = await Promise.all([
    getUserBudgets(userId),
    getActiveLoanCapacity(userId),
  ]);

  const budget = budgets[0] ?? null;

  if (!budget) {
    return (
      <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-4">
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
        (s, t) => s + getMonthlyEquivalent(parseFloat(t.amount), t.recurrence),
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
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/credits">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Créditos
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 shrink-0">
            <FileSignature className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isOngoing ? "En curso" : "Nuevo"}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
              {titleText}
            </h1>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-medium max-w-2xl">
          {subtitleText}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LoanForm
            mode={mode}
            defaultValues={defaultValues}
            availableMoney={availableMoney}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <AvailableCreditCard
            income={income}
            availableMoney={availableMoney}
            activeLoansCount={capacity.count}
            activeLoansMonthly={capacity.totalMonthly}
          />
        </div>
      </div>
    </div>
  );
}
