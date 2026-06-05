"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Wallet, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { ExpenseList } from "./ExpenseList";
import {
  ExpenseFilters,
  DEFAULT_FILTERS,
  type ExpenseFiltersState,
} from "./ExpenseFilters";
import { ExpenseSummary } from "./ExpenseSummary";
import { ExpenseTypeCards } from "./ExpenseTypeCards";
import { EditExpenseModal } from "./EditExpenseModal";
import { AddExpenseModal } from "./AddExpenseModal";
import { DeleteExpenseDialog } from "./DeleteExpenseDialog";
import { Button } from "@/components/ui/button";
import { formatMonthName } from "@/lib/dashboard-helpers";
import { deleteTransaction } from "@/server/actions/transaction-actions";
import type { BudgetRule, Category, Transaction } from "@/types";

interface ExpensesClientProps {
  transactions: (Transaction & { category: Category })[];
  categories: Category[];
  income: number;
  rule: BudgetRule;
  totalsByType: Record<"NEEDS" | "WANTS" | "SAVINGS", number>;
  totalEquivalent: number;
  oneTimeTotal: number;
  savingsRate: number;
}

export function ExpensesClient({
  transactions,
  categories,
  income,
  rule,
  totalsByType,
  totalEquivalent,
  oneTimeTotal,
  savingsRate,
}: ExpensesClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<ExpenseFiltersState>(DEFAULT_FILTERS);
  const [editTransaction, setEditTransaction] = useState<
    (Transaction & { category?: Category }) | null
  >(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    (Transaction & { category?: Category }) | null
  >(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      !filters.search ||
      (t.description?.toLowerCase().includes(filters.search.toLowerCase()) ??
        false);
    const matchesCategory =
      !filters.categoryId || t.categoryId === filters.categoryId;
    const matchesType = !filters.type || t.category?.type === filters.type;
    const matchesRecurrence =
      !filters.recurrence || t.recurrence === filters.recurrence;
    return matchesSearch && matchesCategory && matchesType && matchesRecurrence;
  });

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!pendingDelete) return;
    try {
      await deleteTransaction(pendingDelete.id);
      toast.success("Gasto eliminado");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("No pudimos eliminar el gasto");
      throw err;
    }
  }, [pendingDelete, router]);

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          Tus finanzas
        </p>
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
              Gastos
            </h1>
            <p className="text-sm md:text-[15px] text-stone-600 dark:text-stone-400 font-medium max-w-2xl leading-relaxed">
              Gestiona cada cargo de tu presupuesto. Usa la frecuencia para
              ver el impacto real de tus gastos recurrentes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <Wallet className="h-3.5 w-3.5" />
              {formatMonthName()}
            </span>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Agregar gasto
            </Button>
          </div>
        </div>
      </header>

      <ExpenseSummary
        totalEquivalent={totalEquivalent}
        oneTimeTotal={oneTimeTotal}
        income={income}
      />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Distribución
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:flex items-center gap-1.5">
            <ArrowLeftRight className="h-3 w-3" />
            Equivalentes mensuales según regla{" "}
            {rule.needs}/{rule.wants}/{rule.savings}
          </p>
        </div>
        <ExpenseTypeCards
          totals={totalsByType}
          income={income}
          rule={rule}
          savingsRate={savingsRate}
          totalEquivalent={totalEquivalent}
        />
      </section>

      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Lista de gastos
          </h2>
        </div>
        <ExpenseFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
          onClear={clearFilters}
          count={filteredTransactions.length}
          total={transactions.length}
        />
        <ExpenseList
          transactions={filteredTransactions}
          onEdit={setEditTransaction}
          onDelete={setPendingDelete}
          onAdd={() => setIsAddOpen(true)}
          onClearFilters={clearFilters}
        />
      </section>

      <EditExpenseModal
        open={!!editTransaction}
        onOpenChange={(open) => {
          if (!open) setEditTransaction(null);
        }}
        transaction={editTransaction}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <AddExpenseModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <DeleteExpenseDialog
        transaction={pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
