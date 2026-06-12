import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserLoans, getLoanStats } from "@/server/queries/loan-queries";
import { getUserBudgets } from "@/server/queries/budget-queries";
import { CreditsClient } from "@/components/credits/CreditsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créditos | Walta",
  description: "Seguimiento de tus préstamos, créditos y abonos a capital.",
};

export default async function CreditsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const loans = await getUserLoans(userId);
  const stats = await getLoanStats(userId);
  const budgets = await getUserBudgets(userId);
  const hasBudget = budgets.length > 0;

  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <CreditsClient
        loans={loans as unknown as Array<{
          id: string;
          title: string;
          type: string;
          status: string;
          principal: string;
          downPayment: string;
          monthlyPayment: string;
          termMonths: number;
          annualRate: string;
          formula: string;
          startDate: Date;
          createdAt: Date;
          fees: Array<{ id: string; name: string; amount: number; type: "monthly" | "upfront" }>;
          paymentsCount: number;
          extrasCount: number;
        }>}
        stats={stats}
        hasBudget={hasBudget}
      />
    </div>
  );
}
