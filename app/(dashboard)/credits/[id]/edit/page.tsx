import { auth } from "@/lib/auth";
import { getLoanById } from "@/server/queries/loan-queries";
import { LoanForm } from "@/components/credits/LoanForm";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  await params;
  return {
    title: `Editar Crédito | Walta`,
  };
}

export default async function EditCreditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  let loan;
  try {
    loan = await getLoanById(id);
  } catch {
    notFound();
  }

  const typedLoan = {
    ...loan,
    type: loan.type as "VEHICLE" | "PERSONAL" | "HOUSING" | "OTHER",
    formula: loan.formula as "french_ea" | "nominal_monthly",
    status: loan.status as "ACTIVE" | "PAID_OFF" | "DEFAULTED",
    paidInstallments: (loan as unknown as { paidInstallments?: number }).paidInstallments ?? 0,
    fees: loan.fees ?? [],
  };

  // Build defaultValues for LoanForm
  const principalNum = parseFloat(typedLoan.principal);
  const downPaymentNum = parseFloat(typedLoan.downPayment);
  const price = principalNum + downPaymentNum;

  const defaultValues = {
    title: typedLoan.title,
    type: typedLoan.type.toLowerCase(),
    price,
    downPayment: downPaymentNum,
    annualRate: parseFloat(typedLoan.annualRate),
    termMonths: typedLoan.termMonths,
    formula: typedLoan.formula,
    monthlyPayment: parseFloat(typedLoan.monthlyPayment),
    totalInterest: parseFloat(typedLoan.totalInterest),
    totalCost: parseFloat(typedLoan.totalCost),
    startDate: typedLoan.startDate,
    paidInstallments: typedLoan.paidInstallments,
    fees: typedLoan.fees,
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Crédito</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Modifica los datos de <strong>{typedLoan.title}</strong>
        </p>
      </div>

      <LoanForm key={id} mode="edit" loanId={id} defaultValues={defaultValues} />
    </div>
  );
}
