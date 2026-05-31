import { auth } from "@/lib/auth";
import { getLoanById } from "@/server/queries/loan-queries";
import { LoanDetailClient } from "@/components/credits/LoanDetailClient";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Crédito ${id} | Presupuesto Claro`,
  };
}

export default async function CreditDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    };

  return <LoanDetailClient loan={typedLoan} />;
}
