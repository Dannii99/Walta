"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TransactionList } from "./TransactionList";
import { TransactionFilters, type TransactionFiltersState } from "./TransactionFilters";
import { EditTransactionModal } from "./EditTransactionModal";
import { AddTransactionModal } from "./AddTransactionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import { deleteTransaction } from "@/server/actions/transaction-actions";
import type { Transaction, Category } from "@/types";
import { Plus } from "lucide-react";

interface TransactionsClientProps {
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
  NEEDS: "bg-emerald-100 text-emerald-800 border-emerald-200",
  WANTS: "bg-amber-100 text-amber-800 border-amber-200",
  SAVINGS: "bg-blue-100 text-blue-800 border-blue-200",
  DEBT: "bg-rose-100 text-rose-800 border-rose-200",
};

export function TransactionsClient({
  transactions,
  categories,
  totalsByType,
}: TransactionsClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<TransactionFiltersState>({
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
      if (window.confirm("Ests seguro de que deseas eliminar esta transaccin?")) {
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
          <h2 className="text-lg font-semibold">Lista de Transacciones</h2>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Transaccin
          </Button>
        </div>
        <TransactionFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        onEdit={setEditTransaction}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <EditTransactionModal
        open={!!editTransaction}
        onOpenChange={(open) => {
          if (!open) setEditTransaction(null);
        }}
        transaction={editTransaction}
        categories={categories}
        onSuccess={handleSuccess}
      />

      <AddTransactionModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        categories={categories}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
