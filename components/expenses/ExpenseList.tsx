"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import { RECURRENCE_LABELS } from "@/lib/recurrence";
import type { Transaction, Category, CategoryType, Recurrence } from "@/types";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";

interface ExpenseListProps {
  transactions: (Transaction & { category?: Category })[];
  onEdit: (transaction: Transaction & { category?: Category }) => void;
  onDelete: (id: string) => void;
}

type SortDirection = "asc" | "desc";

const typeLabels: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const typeColors: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-500",
  WANTS: "bg-amber-500",
  SAVINGS: "bg-blue-500",
  DEBT: "bg-rose-500",
};

const recurrenceColors: Record<Recurrence, string> = {
  MONTHLY: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  BIWEEKLY: "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-900",
  ONE_TIME: "bg-gray-100 dark:bg-stone-800 text-gray-800 dark:text-stone-300 border-gray-200 dark:border-stone-700",
};

export function ExpenseList({
  transactions,
  onEdit,
  onDelete,
}: ExpenseListProps) {
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
  });

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay gastos para mostrar.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button
                onClick={toggleSort}
                className="flex items-center gap-1 hover:text-foreground"
              >
                Fecha
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Frecuencia</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => {
            const category = transaction.category;
            const type = category?.type as CategoryType;
            const amount = parseFloat(transaction.amount);

            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString("es-CO")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${type ? typeColors[type] : "bg-gray-400"}`}
                    />
                    <span className="text-sm">{category?.name ?? "-"}</span>
                    {type && (
                      <Badge variant="outline" className="text-xs">
                        {typeLabels[type]}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {transaction.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs ${recurrenceColors[transaction.recurrence]}`}
                  >
                    {RECURRENCE_LABELS[transaction.recurrence]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCOP(amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
