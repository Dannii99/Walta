"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCOP } from "@/lib/currency";
import { RECURRENCE_LABELS } from "@/lib/recurrence";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import type { Transaction, Category } from "@/types";
import { Pencil, Trash2, Plus } from "lucide-react";

interface RecentTransactionsProps {
  transactions: (Transaction & { category?: Category })[];
  onEdit: (transaction: Transaction & { category?: Category }) => void;
  onDelete: (transaction: Transaction & { category?: Category }) => void;
}

export function RecentTransactions({
  transactions,
  onEdit,
  onDelete,
}: RecentTransactionsProps) {
  const { setOpenAddModal } = useDashboard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Transacciones Recientes
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setOpenAddModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>No hay transacciones registradas</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setOpenAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar gasto
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {tx.description || tx.category?.name || "Sin descripción"}
                      </span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {tx.category?.name || "—"}
                      </Badge>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {RECURRENCE_LABELS[tx.recurrence]}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(tx.date).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <span className="font-bold text-sm text-red-600 shrink-0">
                      -{formatCOP(parseFloat(tx.amount))}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(tx)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(tx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
