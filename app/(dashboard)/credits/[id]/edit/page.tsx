import { auth } from "@/lib/auth";
import { getLoanById } from "@/server/queries/loan-queries";
import { LoanForm } from "@/components/credits/LoanForm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await params;
  return {
    title: "Editar Crédito | Walta",
  };
}

export default async function EditCreditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const loan = await getLoanById(id);
  if (!loan) {
    notFound();
  }

  const principalNum = parseFloat(loan.principal);
  const downPaymentNum = parseFloat(loan.downPayment);
  const price = principalNum + downPaymentNum;

  const defaultValues = {
    title: loan.title,
    type: loan.type.toLowerCase(),
    price,
    downPayment: downPaymentNum,
    annualRate: parseFloat(loan.annualRate),
    termMonths: loan.termMonths,
    formula: loan.formula,
    monthlyPayment: parseFloat(loan.monthlyPayment),
    totalInterest: parseFloat(loan.totalInterest),
    totalCost: parseFloat(loan.totalCost),
    startDate: loan.startDate,
    paidInstallments: loan.paidInstallments ?? 0,
    fees: loan.fees ?? [],
  };

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/credits/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Volver al crédito
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 shrink-0">
            <PencilLine className="h-4 w-4" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Editar
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight truncate">
              {loan.title}
            </h1>
          </div>
        </div>
        <p className="text-sm text-stone-600 dark:text-stone-400 font-medium max-w-2xl">
          Modifica los datos del crédito. Los pagos ya registrados no se
          modificarán, pero el plan de amortización se recalcula con los nuevos
          valores.
        </p>
      </div>

      <div className="max-w-3xl">
        <LoanForm
          key={id}
          mode="edit"
          loanId={id}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
}
