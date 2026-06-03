import { auth } from "@/lib/auth";
import { getActiveBudgetWithTransactions } from "@/server/queries/transaction-queries";
import { ExpensesClient } from "@/components/expenses/ExpensesClient";
import { redirect } from "next/navigation";
import type {
  Category,
  CategoryType,
  Transaction,
  BudgetRule,
} from "@/types";
import type { Metadata } from "next";
import { getMonthlyEquivalent } from "@/lib/recurrence";

export const metadata: Metadata = {
  title: "Gastos | Walta",
  description: "Gestiona tus gastos y categorías.",
};

const DISPLAY_TYPES: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS"];

export default async function ExpensesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const budget = await getActiveBudgetWithTransactions(session.user.id);

  if (!budget) {
    return (
      <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
        <h1 className="text-2xl font-bold">Gastos</h1>
        <p className="text-muted-foreground mt-4">
          No tienes un presupuesto activo. Completa el onboarding primero.
        </p>
      </div>
    );
  }

  const income = parseFloat(budget.income);
  const rule: BudgetRule =
    (budget.rule as unknown as BudgetRule) ??
    { needs: 50, wants: 30, savings: 20 };

  const allTransactions: (Transaction & { category: Category })[] =
    budget.categories.flatMap((category) =>
      category.transactions.map((transaction) => ({
        ...transaction,
        recurrence: (transaction.recurrence ?? "MONTHLY") as Transaction["recurrence"],
        category: {
          ...category,
          type: category.type as CategoryType,
        } as Category,
      }))
    );

  const totalsByType: Record<CategoryType, number> = {
    NEEDS: 0,
    WANTS: 0,
    SAVINGS: 0,
    DEBT: 0,
  };

  let totalEquivalent = 0;
  let recurringTotal = 0;
  let oneTimeTotal = 0;

  for (const t of allTransactions) {
    const amount = parseFloat(t.amount);
    const equiv = getMonthlyEquivalent(amount, t.recurrence);
    const visibleType: CategoryType =
      t.category?.type === "DEBT" ? "SAVINGS" : t.category?.type ?? "NEEDS";

    totalsByType[visibleType] += equiv;
    totalEquivalent += equiv;

    if (t.recurrence === "ONE_TIME") {
      oneTimeTotal += amount;
    } else {
      recurringTotal += equiv;
    }
  }

  const visibleTotals = Object.fromEntries(
    DISPLAY_TYPES.map((t) => [t, totalsByType[t]])
  ) as Record<"NEEDS" | "WANTS" | "SAVINGS", number>;

  const categoriesWithType = budget.categories.map((cat) => ({
    ...cat,
    type: cat.type as CategoryType,
  })) as Category[];

  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <ExpensesClient
          transactions={allTransactions}
          categories={categoriesWithType}
          income={income}
          rule={rule}
          totalsByType={visibleTotals}
          totalEquivalent={totalEquivalent}
          recurringTotal={recurringTotal}
          oneTimeTotal={oneTimeTotal}
        />
      </div>
    </div>
  );
}
