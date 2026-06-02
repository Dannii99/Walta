"use client";

import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { AddExpenseModal } from "@/components/expenses/AddExpenseModal";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useRouter } from "next/navigation";
import type { Category } from "@/types";

export function DashboardEmptyClient({ categories }: { categories: Category[] }) {
  const { openAddModal, setOpenAddModal } = useDashboard();
  const router = useRouter();

  return (
    <>
      <DashboardEmptyState />
      <AddExpenseModal
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        categories={categories}
        onSuccess={() => {
          setOpenAddModal(false);
          router.refresh();
        }}
      />
    </>
  );
}
