"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Trash2,
  Plus,
  AlertTriangle,
  Pencil,
  Save,
  X,
  Tags,
} from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/server/actions/category-actions";
import { PREDEFINED_CATEGORIES, OTHER_CATEGORY_KEY, type PredefinedCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Category, CategoryType } from "@/types";

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

const TYPE_COLORS: Record<CategoryType, string> = {
  NEEDS: "#EF4444",
  WANTS: "#3B82F6",
  SAVINGS: "#10B981",
  DEBT: "#8B5CF6",
};

const TYPE_OPTIONS: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS"];

export function CategoryManager({ budgetId, categories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<CategoryType>("NEEDS");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherName, setOtherName] = useState("");
  const [otherType, setOtherType] = useState<CategoryType>("NEEDS");

  const [deleteDialog, setDeleteDialog] = useState<{
    category: CategoryWithCount;
    reassignTo: string;
  } | null>(null);

  const [typeChangeWarning, setTypeChangeWarning] = useState<{
    category: CategoryWithCount;
    newType: CategoryType;
  } | null>(null);

  const existingNames = useMemo(
    () => new Set(categories.map((c) => c.name.toLowerCase())),
    [categories]
  );

  const grouped = useMemo(() => {
    const groups: Record<CategoryType, PredefinedCategory[]> = {
      NEEDS: [],
      WANTS: [],
      SAVINGS: [],
      DEBT: [],
    };
    PREDEFINED_CATEGORIES.forEach((c) => {
      groups[c.type].push(c);
    });
    return groups;
  }, []);

  const handleAdd = () => {
    setError("");
    let name: string;
    let type: CategoryType;

    if (selectedCategory === OTHER_CATEGORY_KEY) {
      const trimmed = otherName.trim();
      if (!trimmed) return;
      if (existingNames.has(trimmed.toLowerCase())) {
        setError("Ya existe una categoría con ese nombre");
        return;
      }
      name = trimmed;
      type = otherType;
    } else if (selectedCategory) {
      const predefined = PREDEFINED_CATEGORIES.find(
        (c) => c.name === selectedCategory
      );
      if (!predefined) return;
      name = predefined.name;
      type = predefined.type;
    } else {
      return;
    }

    startTransition(async () => {
      try {
        await createCategory(budgetId, { name, type });
        setSelectedCategory("");
        setOtherName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear la categoría");
      }
    });
  };

  const startEdit = (category: CategoryWithCount) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditType(category.type as CategoryType);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const performUpdate = async (categoryId: string, name: string, type: CategoryType) => {
    try {
      await updateCategory(categoryId, { name, type });
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la categoría");
    }
  };

  const saveEdit = async (category: CategoryWithCount) => {
    setError("");
    const newName = editName.trim();
    if (!newName) {
      setError("El nombre no puede estar vacío");
      return;
    }
    if (
      newName.toLowerCase() !== category.name.toLowerCase() &&
      existingNames.has(newName.toLowerCase())
    ) {
      setError("Ya existe una categoría con ese nombre");
      return;
    }

    if (editType !== category.type && category._count.transactions > 0) {
      setTypeChangeWarning({ category, newType: editType });
      return;
    }

    startTransition(async () => {
      await performUpdate(category.id, newName, editType);
    });
  };

  const confirmTypeChange = () => {
    if (!typeChangeWarning) return;
    const { category, newType } = typeChangeWarning;
    const newName = editName.trim();
    setTypeChangeWarning(null);
    startTransition(async () => {
      await performUpdate(category.id, newName, newType);
    });
  };

  const openDeleteDialog = (category: CategoryWithCount) => {
    setError("");
    setDeleteDialog({ category, reassignTo: "" });
  };

  const confirmDelete = async () => {
    if (!deleteDialog) return;
    const { category, reassignTo } = deleteDialog;

    if (category._count.transactions > 0 && !reassignTo) {
      setError("Selecciona una categoría de destino para reasignar los gastos");
      return;
    }

    startTransition(async () => {
      try {
        await deleteCategory(category.id, reassignTo || undefined);
        setDeleteDialog(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al eliminar la categoría");
      }
    });
  };

  const isAddDisabled =
    !selectedCategory ||
    (selectedCategory === OTHER_CATEGORY_KEY && !otherName.trim());

  const otherCategories = deleteDialog
    ? categories.filter((c) => c.id !== deleteDialog.category.id)
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white border border-stone-200/80 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
          <Tags className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900">
            Categorías
          </h2>
          <p className="text-xs md:text-sm text-stone-500 font-medium mt-0.5 leading-relaxed">
            Agrega, edita o elimina las categorías de tu presupuesto. Las
            categorías son la base del dashboard.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-3 text-sm text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-none">
          {categories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/50 p-6 text-center">
              <p className="text-sm text-stone-600 font-medium">
                Aún no tienes categorías. Agrega una abajo.
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const isEditing = editingId === category.id;
              const txCount = category._count.transactions;
              const type = category.type as CategoryType;

              return (
                <div
                  key={category.id}
                  className="flex items-center gap-2 rounded-xl border border-stone-200/80 bg-white p-3 transition-colors hover:bg-stone-50/50"
                  style={{ borderLeft: `4px solid ${TYPE_COLORS[type]}` }}
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-9 text-sm flex-1"
                        autoFocus
                      />
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as CategoryType)}
                        className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                      >
                        {(Object.keys(TYPE_LABELS) as CategoryType[]).map((t) => (
                          <option key={t} value={t}>
                            {TYPE_LABELS[t]}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                        onClick={() => saveEdit(category)}
                        disabled={isPending}
                        aria-label="Guardar cambios"
                      >
                        <Save className="h-4 w-4" strokeWidth={2.2} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                        onClick={cancelEdit}
                        disabled={isPending}
                        aria-label="Cancelar edición"
                      >
                        <X className="h-4 w-4" strokeWidth={2.2} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-stone-900 truncate">
                          {category.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1 font-medium">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0",
                              "border-stone-200 text-stone-600"
                            )}
                          >
                            {TYPE_LABELS[type]}
                          </Badge>
                          <span>
                            {txCount} {txCount === 1 ? "gasto" : "gastos"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                        onClick={() => startEdit(category)}
                        disabled={isPending}
                        aria-label={`Editar ${category.name}`}
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2.2} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => openDeleteDialog(category)}
                        disabled={isPending}
                        aria-label={`Eliminar ${category.name}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                      </Button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-stone-200/60">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Agregar categoría
            </p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            >
              <option value="">Seleccionar categoría de la lista...</option>
              <optgroup label="Necesidades">
                {grouped.NEEDS.map((c) => (
                  <option
                    key={c.name}
                    value={c.name}
                    disabled={existingNames.has(c.name.toLowerCase())}
                  >
                    {c.name}
                    {existingNames.has(c.name.toLowerCase()) ? " (ya agregada)" : ""}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Deseos">
                {grouped.WANTS.map((c) => (
                  <option
                    key={c.name}
                    value={c.name}
                    disabled={existingNames.has(c.name.toLowerCase())}
                  >
                    {c.name}
                    {existingNames.has(c.name.toLowerCase()) ? " (ya agregada)" : ""}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Ahorros">
                {grouped.SAVINGS.map((c) => (
                  <option
                    key={c.name}
                    value={c.name}
                    disabled={existingNames.has(c.name.toLowerCase())}
                  >
                    {c.name}
                    {existingNames.has(c.name.toLowerCase()) ? " (ya agregada)" : ""}
                  </option>
                ))}
              </optgroup>
              <option value={OTHER_CATEGORY_KEY}>Otro (personalizado)...</option>
            </select>
          </div>

          {selectedCategory === OTHER_CATEGORY_KEY && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Nombre personalizado..."
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                className="h-10 flex-1"
              />
              <select
                value={otherType}
                onChange={(e) => setOtherType(e.target.value as CategoryType)}
                className="h-10 rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 sm:w-44"
              >
                {TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={handleAdd}
            variant="outline"
            className="h-10 gap-1.5 w-full border-stone-300 text-stone-700 hover:bg-stone-50"
            disabled={isAddDisabled || isPending}
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Agregar categoría
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar categoría</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog && deleteDialog.category._count.transactions > 0 ? (
                <div className="space-y-3">
                  <div>
                    <strong>{deleteDialog.category.name}</strong> tiene{" "}
                    <strong>{deleteDialog.category._count.transactions}</strong>{" "}
                    gastos asociados. Selecciona la categoría de destino
                    para reasignarlos antes de eliminar.
                  </div>
                  <select
                    value={deleteDialog.reassignTo}
                    onChange={(e) =>
                      setDeleteDialog({ ...deleteDialog, reassignTo: e.target.value })
                    }
                    className="flex h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                  >
                    <option value="">Seleccionar categoría de destino...</option>
                    {otherCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({TYPE_LABELS[c.type as CategoryType]})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  ¿Estás seguro de eliminar la categoría{" "}
                  <strong>{deleteDialog?.category.name}</strong>? Esta acción no
                  se puede deshacer.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={
                isPending ||
                (!!deleteDialog &&
                  deleteDialog.category._count.transactions > 0 &&
                  !deleteDialog.reassignTo)
              }
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!typeChangeWarning}
        onOpenChange={(open) => !open && setTypeChangeWarning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={2.2} />
              Cambiar tipo de categoría
            </AlertDialogTitle>
            <AlertDialogDescription>
              {typeChangeWarning && (
                <div className="space-y-2">
                  <div>
                    <strong>{typeChangeWarning.category.name}</strong> tiene{" "}
                    <strong>{typeChangeWarning.category._count.transactions}</strong>{" "}
                    gastos registrados como{" "}
                    <strong>
                      {TYPE_LABELS[typeChangeWarning.category.type as CategoryType]}
                    </strong>
                    .
                  </div>
                  <div>
                    Al cambiar a{" "}
                    <strong>{TYPE_LABELS[typeChangeWarning.newType]}</strong>, las
                    métricas del dashboard (KPIs, donut, salud) se recalcularán
                    con estos gastos en la nueva categoría.
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmTypeChange}
              disabled={isPending}
              className="bg-stone-900 text-white hover:bg-stone-800"
            >
              Cambiar tipo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.section>
  );
}
