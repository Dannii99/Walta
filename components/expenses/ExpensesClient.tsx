"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpenseList } from "./ExpenseList";
import { ExpenseFilters, type ExpenseFiltersState } from "./ExpenseFilters";
import { EditExpenseModal } from "./EditExpenseModal";
import { AddExpenseModal } from "./AddExpenseModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import { deleteTransaction } from "@/server/actions/transaction-actions";
import type { Transaction, Category } from "@/types";
import { Plus } from "lucide-react";

interface ExpensesClientProps {
  transactions: (Transaction & { category: Category })[];
  categories: Category[];
  totalsByType: Record<string, number>;
}

const typeLabels: Record<string, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const typeColors: Record<string, string> = {
  NEEDS: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WANTS: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  SAVINGS: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  DEBT: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
};

export function ExpensesClient({
  transactions,
  categories,
  totalsByType,
}: ExpensesClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<ExpenseFiltersState>({
    search: "",
    categoryId: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  });
  const [editTransaction, setEditTransaction] = useState<(Transaction & { category?: Category }) | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        !filters.search ||
        (t.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false);
      const matchesCategory =
        !filters.categoryId || t.categoryId === filters.categoryId;
      const matchesType =
        !filters.type || t.category?.type === filters.type;
      const matchesDateFrom =
        !filters.dateFrom || new Date(t.date) >= new Date(filters.dateFrom);
      const matchesDateTo =
        !filters.dateTo || new Date(t.date) <= new Date(filters.dateTo);

      return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, filters]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
        await deleteTransaction(id);
        router.refresh();
      }
    },
    [router]
  );

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Totals by type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(totalsByType).map(([type, total]) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {typeLabels[type] ?? type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCOP(total)}</div>
              <Badge variant="outline" className={typeColors[type] ?? ""}>
                {type}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Add */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lista de Gastos</h2>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Gasto
          </Button>
        </div>
        <ExpenseFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {/* Expense List */}
      <ExpenseList
        transactions={filteredTransactions}
        onEdit={setEditTransaction}
        onDelete={handleDelete}
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
    </div>
  );
}
