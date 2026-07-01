"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Plus,
  Tags,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Category, CategoryType } from "@/types";
import { SwipeableCategoryCard } from "./SwipeableCategoryCard";
import { AddCategoryModal } from "./AddCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

type CategoryWithCount = Category & {
  _count: { transactions: number };
};

interface CategoryManagerProps {
  budgetId: string;
  categories: CategoryWithCount[];
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

export function CategoryManager({ budgetId, categories }: CategoryManagerProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryType | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryWithCount | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithCount | null>(null);
  const shouldReduceMotion = useReducedMotion() ?? false;
  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return categories;
    return categories.filter((c) => c.type === activeFilter);
  }, [categories, activeFilter]);

  const otherCategories = categoryToDelete
    ? categories.filter((c) => c.id !== categoryToDelete.id)
    : [];

  const openDeleteDialog = (category: CategoryWithCount) => {
    setCategoryToDelete(category);
  };

  const handleSaved = () => {
    setShowAddModal(false);
    setEditCategory(null);
  };

  const handleDeleted = () => {
    setCategoryToDelete(null);
  };

  const filterOptions: { value: CategoryType | "all"; label: string; count: number }[] = [
    { value: "all", label: "Todas", count: categories.length },
    { value: "NEEDS", label: "Necesidades", count: categories.filter((c) => c.type === "NEEDS").length },
    { value: "WANTS", label: "Deseos", count: categories.filter((c) => c.type === "WANTS").length },
    { value: "SAVINGS", label: "Ahorros", count: categories.filter((c) => c.type === "SAVINGS").length },
    { value: "DEBT", label: "Deudas", count: categories.filter((c) => c.type === "DEBT").length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-muted dark:bg-white/5 text-foreground dark:text-white flex items-center justify-center shrink-0">
          <Tags className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-foreground dark:text-white">
            Categorías
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground font-medium mt-0.5 leading-relaxed">
            Gestiona las categorías donde se organizan tus gastos.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 shrink-0">
            Filtrar
          </span>
          {filterOptions.map((opt) => {
            const active = activeFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setActiveFilter(opt.value)}
                className={cn(
                  "shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                  active
                    ? "bg-foreground text-background border-foreground dark:bg-white dark:text-[#17181c] dark:border-white"
                    : "bg-background dark:bg-[#1a1a1e] text-muted-foreground border-border dark:border-white/10 hover:border-muted-foreground"
                )}
              >
                {opt.label}
                <span className={cn("ml-1 text-[10px]", active ? "text-background/70 dark:text-[#17181c]/70" : "text-muted-foreground/70")}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredCategories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border dark:border-white/10 bg-muted/50 dark:bg-[#1a1a1e] p-6 text-center">
              <p className="text-sm text-muted-foreground font-medium">
                {activeFilter === "all"
                  ? "Aún no tienes categorías. Agrega la primera."
                  : `No tienes categorías de ${TYPE_LABELS[activeFilter]}.`}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <SwipeableCategoryCard
                    category={category}
                    onEdit={setEditCategory}
                    onDelete={openDeleteDialog}
                    reducedMotion={shouldReduceMotion}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
            "border-border dark:border-white/10 bg-background dark:bg-[#17181c] text-foreground hover:bg-muted dark:hover:bg-[#1a1a1e]"
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Agregar categoría
        </button>
      </div>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        budgetId={budgetId}
        category={null}
        onSaved={handleSaved}
      />

      <AddCategoryModal
        open={!!editCategory}
        onOpenChange={(open) => { if (!open) setEditCategory(null); }}
        budgetId={budgetId}
        category={editCategory}
        onSaved={handleSaved}
      />

      {categoryToDelete && (
        <DeleteCategoryModal
          open={!!categoryToDelete}
          onOpenChange={(open) => { if (!open) setCategoryToDelete(null); }}
          category={categoryToDelete}
          otherCategories={otherCategories}
          onDeleted={handleDeleted}
        />
      )}
    </motion.div>
  );
}
