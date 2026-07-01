"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  AlertTriangle,
  Loader2,
  Tags,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { deleteCategory } from "@/server/actions/category-actions";
import { cn } from "@/lib/utils";
import type { Category, CategoryType } from "@/types";
import { SwipeableCategoryCard } from "./SwipeableCategoryCard";
import { AddCategoryModal } from "./AddCategoryModal";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryType | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryWithCount | null>(null);
  const [deleteState, setDeleteState] = useState<{
    category: CategoryWithCount;
    reassignTo: string;
  } | null>(null);
  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return categories;
    return categories.filter((c) => c.type === activeFilter);
  }, [categories, activeFilter]);

  const otherCategories = deleteState
    ? categories.filter((c) => c.id !== deleteState.category.id)
    : [];

  const openDeleteDialog = (category: CategoryWithCount) => {
    setError("");
    setDeleteState({ category, reassignTo: "" });
  };

  const confirmDelete = async () => {
    if (!deleteState) return;
    const { category, reassignTo } = deleteState;

    if (category._count.transactions > 0 && !reassignTo) {
      setError("Selecciona una categoría de destino para reasignar los gastos");
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategory(category.id, reassignTo || undefined);
        setDeleteState(null);
        router.refresh();
      } catch {
        setError("Error al eliminar la categoría");
      }
    });
  };

  const handleSaved = () => {
    setShowAddModal(false);
    setEditCategory(null);
    router.refresh();
  };

  const filterOptions: { value: CategoryType | "all"; label: string; count: number }[] = [
    { value: "all", label: "Todas", count: categories.length },
    { value: "NEEDS", label: "Necesidades", count: categories.filter((c) => c.type === "NEEDS").length },
    { value: "WANTS", label: "Deseos", count: categories.filter((c) => c.type === "WANTS").length },
    { value: "SAVINGS", label: "Ahorros", count: categories.filter((c) => c.type === "SAVINGS").length },
    { value: "DEBT", label: "Deudas", count: categories.filter((c) => c.type === "DEBT").length },
  ];

  const hasTx = (deleteState?.category._count.transactions ?? 0) > 0;

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
        {error && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 dark:bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

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

      <AlertDialog
        open={!!deleteState}
        onOpenChange={(open) => !open && setDeleteState(null)}
      >
        <AlertDialogContent>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0 space-y-3">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">
                  Eliminar categoría
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-muted-foreground">
                <div className="space-y-3">
                  {hasTx ? (
                    <p>
                      <strong>{deleteState?.category.name}</strong> tiene{" "}
                      <strong>{deleteState?.category._count.transactions}</strong> gastos
                      asociados. Selecciona la categoría de destino para
                      reasignarlos antes de eliminar.
                    </p>
                  ) : (
                    <p>
                      ¿Estás seguro de eliminar la categoría{" "}
                      <strong>{deleteState?.category.name}</strong>? Esta acción no se puede
                      deshacer.
                    </p>
                  )}

                  {deleteState?.category && (
                    <div className="rounded-xl border border-border bg-muted/50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground font-medium">Categoría</p>
                        <span className="text-xs font-semibold text-foreground">
                          {deleteState.category.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground font-medium">Gastos asociados</p>
                        <span className="text-xs font-semibold text-foreground">
                          {deleteState.category._count.transactions}
                        </span>
                      </div>
                    </div>
                  )}

                  {hasTx && otherCategories.length > 0 && (
                    <Select
                      value={deleteState?.reassignTo ?? ""}
                      onValueChange={(v) =>
                        deleteState && setDeleteState({ ...deleteState, reassignTo: v })
                      }
                    >
                      <SelectTrigger className="h-10 border-border">
                        <SelectValue placeholder="Seleccionar categoría de destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        {otherCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: `var(--color-${(c.type as string).toLowerCase()})`,
                                }}
                              />
                              {c.name} ({TYPE_LABELS[c.type as CategoryType]})
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </AlertDialogDescription>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteState(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending || (hasTx && !deleteState?.reassignTo)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Eliminar
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
