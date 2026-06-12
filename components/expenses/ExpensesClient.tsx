"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { ExpenseList } from "./ExpenseList";
import {
  ExpenseFilters,
  DEFAULT_FILTERS,
  type ExpenseFiltersState,
} from "./ExpenseFilters";
import { ExpenseFilterSheet } from "./ExpenseFilterSheet";
import { ExpenseSummaryTabs } from "./ExpenseSummaryTabs";
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
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
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
      {/* Header */}
      <header className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
          Tus finanzas
        </p>
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-[1.1]">
              Gastos
            </h1>
            <p className="text-sm md:text-[15px] text-[#737373] dark:text-[#a1a1aa] font-medium max-w-2xl leading-relaxed">
              Gestiona cada cargo de tu presupuesto. Usa la frecuencia para
              ver el impacto real de tus gastos recurrentes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
              <Wallet className="h-3.5 w-3.5" />
              {formatMonthName()}
            </span>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5] shadow-sm h-9 px-4 text-sm font-semibold rounded-full"
            >
              <Plus className="h-4 w-4" />
              Agregar gasto
            </Button>
          </div>
        </div>
      </header>

      {/* Summary + Distribution Tabs */}
      <ExpenseSummaryTabs
        totalEquivalent={totalEquivalent}
        oneTimeTotal={oneTimeTotal}
        income={income}
        rule={rule}
        totalsByType={totalsByType}
        savingsRate={savingsRate}
      />

      {/* Expense List */}
      <section className="space-y-3">
        <div className="px-1">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
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
          onOpenFilterSheet={() => setFilterSheetOpen(true)}
        />
        <ExpenseList
          transactions={filteredTransactions}
          onEdit={setEditTransaction}
          onDelete={setPendingDelete}
          onAdd={() => setIsAddOpen(true)}
          onClearFilters={clearFilters}
        />
      </section>

      {/* Mobile Filter Sheet */}
      <ExpenseFilterSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        onChange={setFilters}
        categories={categories}
      />

      {/* Modals */}
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
