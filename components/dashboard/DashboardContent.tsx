"use client";

import { useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { CategoryDonutChart } from "@/components/dashboard/CategoryDonutChart";
import { HealthIndicator } from "@/components/dashboard/HealthIndicator";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import { deleteTransaction } from "@/server/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Transaction, Category } from "@/types";

interface DashboardContentProps {
  budgetName: string;
  income: number;
  expenses: number;
  monthlyEquivalentExpenses: number;
  available: number;
  needsSpent: number;
  needsLimit: number;
  wantsSpent: number;
  wantsLimit: number;
  savingsSpent: number;
  savingsLimit: number;
  donutData: { name: string; value: number; color?: string }[];
  recentTransactions: (Transaction & { category?: Category })[];
  categories: Category[];
}

export function DashboardContent({
  budgetName,
  income,
  expenses,
  monthlyEquivalentExpenses,
  available,
  needsSpent,
  needsLimit,
  wantsSpent,
  wantsLimit,
  savingsSpent,
  savingsLimit,
  donutData,
  recentTransactions,
  categories,
}: DashboardContentProps) {
  const { openAddModal, setOpenAddModal, triggerRefresh } = useDashboard();

  const [editTransaction, setEditTransaction] = useState<(Transaction & { category?: Category }) | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [deleteTransactionData, setDeleteTransactionData] = useState<(Transaction & { category?: Category }) | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = (tx: Transaction & { category?: Category }) => {
    setEditTransaction(tx);
    setOpenEditModal(true);
  };

  const handleDelete = (tx: Transaction & { category?: Category }) => {
    setDeleteTransactionData(tx);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTransactionData) return;
    await deleteTransaction(deleteTransactionData.id);
    setOpenDeleteDialog(false);
    setDeleteTransactionData(null);
    triggerRefresh();
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{budgetName}</h1>
          <p className="text-muted-foreground text-sm">
            Resumen de tu presupuesto mensual
          </p>
        </div>
        <Button onClick={() => setOpenAddModal(true)}>
          + Agregar gasto
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard title="Ingreso Mensual" value={income} icon="income" />
        <KPICard
          title="Gastos del Mes"
          value={expenses}
          icon="expenses"
          subtitle={`${((expenses / income) * 100).toFixed(0)}% del presupuesto · Equiv. mensual: ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(monthlyEquivalentExpenses)}`}
        />
        <KPICard
          title="Disponible"
          value={available}
          icon="available"
          subtitle="Equiv. mensual"
        />
      </div>

      {/* Charts + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <CategoryDonutChart data={donutData} />
        </div>
        <div className="lg:col-span-2">
          <HealthIndicator
            needsSpent={needsSpent}
            needsLimit={needsLimit}
            wantsSpent={wantsSpent}
            wantsLimit={wantsLimit}
            savingsSpent={savingsSpent}
            savingsLimit={savingsLimit}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={recentTransactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modals */}
      <AddTransactionModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={triggerRefresh}
      />

      <EditTransactionModal
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        transaction={editTransaction}
        categories={categories}
        onSuccess={triggerRefresh}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar transacción</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar esta transacción de{" "}
              <strong>
                {deleteTransactionData
                  ? new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(parseFloat(deleteTransactionData.amount))
                  : ""}
              </strong>
              ? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
