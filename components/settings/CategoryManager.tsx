"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Trash2, Plus, AlertTriangle, Pencil, Save, X } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/server/actions/category-actions";
import { PREDEFINED_CATEGORIES, OTHER_CATEGORY_KEY, type PredefinedCategory } from "@/lib/categories";
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
      setError("Selecciona una categoría de destino para reasignar las transacciones");
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
    <Card>
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
        <CardDescription>
          Agrega, edita o elimina las categorías de tu presupuesto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aún no tienes categorías. Agrega una abajo.
            </p>
          ) : (
            categories.map((category) => {
              const isEditing = editingId === category.id;
              const txCount = category._count.transactions;
              const type = category.type as CategoryType;

              return (
                <div
                  key={category.id}
                  className="flex items-center gap-2 rounded-md border p-3"
                  style={{ borderLeft: `4px solid ${TYPE_COLORS[type]}` }}
                >
                  {isEditing ? (
                    <>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-sm flex-1"
                        autoFocus
                      />
                      <select
                        value={editType}
                        onChange={(e) => setEditType(e.target.value as CategoryType)}
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
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
                        className="h-8 w-8"
                        onClick={() => saveEdit(category)}
                        disabled={isPending}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={cancelEdit}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{category.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {TYPE_LABELS[type]}
                          </Badge>
                          <span>
                            {txCount} {txCount === 1 ? "transacción" : "transacciones"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(category)}
                        disabled={isPending}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(category)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm font-medium">Agregar categoría</p>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

          {selectedCategory === OTHER_CATEGORY_KEY && (
            <div className="flex gap-2">
              <Input
                placeholder="Nombre personalizado..."
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                className="h-9 flex-1"
              />
              <select
                value={otherType}
                onChange={(e) => setOtherType(e.target.value as CategoryType)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
            size="sm"
            className="h-9 gap-1 w-full"
            disabled={isAddDisabled || isPending}
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>
      </CardContent>

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
                  <p>
                    <strong>{deleteDialog.category.name}</strong> tiene{" "}
                    <strong>{deleteDialog.category._count.transactions}</strong>{" "}
                    transacciones asociadas. Selecciona la categoría de destino
                    para reasignarlas antes de eliminar.
                  </p>
                  <select
                    value={deleteDialog.reassignTo}
                    onChange={(e) =>
                      setDeleteDialog({ ...deleteDialog, reassignTo: e.target.value })
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                <p>
                  ¿Estás seguro de eliminar la categoría{" "}
                  <strong>{deleteDialog?.category.name}</strong>? Esta acción no
                  se puede deshacer.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Cambiar tipo de categoría
            </AlertDialogTitle>
            <AlertDialogDescription>
              {typeChangeWarning && (
                <div className="space-y-2">
                  <p>
                    <strong>{typeChangeWarning.category.name}</strong> tiene{" "}
                    <strong>{typeChangeWarning.category._count.transactions}</strong>{" "}
                    transacciones registradas como{" "}
                    <strong>
                      {TYPE_LABELS[typeChangeWarning.category.type as CategoryType]}
                    </strong>
                    .
                  </p>
                  <p>
                    Al cambiar a{" "}
                    <strong>{TYPE_LABELS[typeChangeWarning.newType]}</strong>, las
                    métricas del dashboard (KPIs, donut, salud) se recalcularán
                    con estas transacciones en la nueva categoría.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmTypeChange} disabled={isPending}>
              Cambiar tipo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
