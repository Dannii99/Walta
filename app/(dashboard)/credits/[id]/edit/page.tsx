import { auth } from "@/lib/auth";
import { getLoanById } from "@/server/queries/loan-queries";
import { LoanForm } from "@/components/credits/LoanForm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import type { PastPaymentSync } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await params;
  return {
    title: "Editar Crédito | Walta",
  };
}

/**
 * Builds a `pastPaymentsSync` array from the loan's startDate and real
 * payments. Each entry corresponds to one month in the range
 * [startDate, today). Months that have a real LoanPayment are flagged as
 * "PAID". Months in a DEFAULTED loan that lack a payment are flagged as
 * "DEFAULTED". All other months are "PENDING".
 *
 * This is the single source of truth for the edit form's past-payments
 * toggles — the form just renders this list and lets the user adjust.
 */
function buildPastPaymentsSync(
  startDate: Date,
  payments: { paidDate: Date }[],
  loanStatus: string
): PastPaymentSync[] {
  const today = new Date();
  const result: PastPaymentSync[] = [];

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth(), 1);

  const current = new Date(start);
  while (current < end) {
    const month = current.getMonth();
    const year = current.getFullYear();

    const hasPayment = payments.some((p) => {
      const d = new Date(p.paidDate);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    let status: PastPaymentSync["status"];
    if (hasPayment) {
      status = "PAID";
    } else if (loanStatus === "DEFAULTED") {
      status = "DEFAULTED";
    } else {
      status = "PENDING";
    }

    result.push({ month, year, status });
    current.setMonth(current.getMonth() + 1);
  }

  return result;
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

  // Pre-populate pastPaymentsSync from the loan's real payments. The form's
  // startDate useState reads from `defaultValues.startDate` so the toggles
  // align with the actual credit start.
  const pastPaymentsSync = buildPastPaymentsSync(
    loan.startDate,
    loan.payments ?? [],
    loan.status
  );

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
    startDate: loan.startDate.toISOString().split("T")[0],
    pastPaymentsSync,
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
          Modifica los datos del crédito. La cuota inicial, las cuotas pagadas
          y el plan de amortización se recalculan con los nuevos valores.
        </p>
      </div>

      <div className="max-w-[1400px]">
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
