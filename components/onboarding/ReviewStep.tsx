"use client";

import { useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCOP } from "@/lib/currency";
import { PREDEFINED_CATEGORIES, OTHER_CATEGORY_KEY, type PredefinedCategory } from "@/lib/categories";
import type { CategoryType } from "@/types";

const CATEGORY_COLORS: Record<CategoryType, string> = {
  NEEDS: "#EF4444",
  WANTS: "#3B82F6",
  SAVINGS: "#10B981",
  DEBT: "#8B5CF6",
};

interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  suggestedAmount: number;
}

interface ReviewStepProps {
  income: number;
  categories: CategoryItem[];
  onCategoriesChange: (categories: CategoryItem[]) => void;
}

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_OPTIONS: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS"];

export function ReviewStep({
  income,
  categories,
  onCategoriesChange,
}: ReviewStepProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [otherName, setOtherName] = useState("");
  const [otherType, setOtherType] = useState<CategoryType>("NEEDS");

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

  const updateCategoryName = (id: string, name: string) => {
    onCategoriesChange(
      categories.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const removeCategory = (id: string) => {
    onCategoriesChange(categories.filter((c) => c.id !== id));
  };

  const addCategory = () => {
    let name: string;
    let type: CategoryType;

    if (selectedCategory === OTHER_CATEGORY_KEY) {
      const trimmed = otherName.trim();
      if (!trimmed) return;
      if (existingNames.has(trimmed.toLowerCase())) return;
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

    onCategoriesChange([
      ...categories,
      {
        id: `new-${Date.now()}`,
        name,
        type,
        suggestedAmount: 0,
      },
    ]);
    setSelectedCategory("");
    setOtherName("");
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.suggestedAmount, 0);
  const isValid = totalAllocated <= income;

  const isAddDisabled =
    !selectedCategory ||
    (selectedCategory === OTHER_CATEGORY_KEY && !otherName.trim());

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Revisa tus categorías</h2>
        <p className="text-muted-foreground text-sm">
          Edita los nombres o elimina las que no necesites
        </p>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {categories.map((category) => (
          <Card key={category.id} className="border-l-4" style={{ borderLeftColor: CATEGORY_COLORS[category.type] }}>
            <CardContent className="p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category.type] }}
                  />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {TYPE_LABELS[category.type]}
                  </span>
                </div>
                <Input
                  value={category.name}
                  onChange={(e) => updateCategoryName(category.id, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{formatCOP(category.suggestedAmount)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agregar categoría */}
      <div className="space-y-2">
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
          onClick={addCategory}
          variant="outline"
          size="sm"
          className="h-9 gap-1 w-full"
          disabled={isAddDisabled}
        >
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      {/* Resumen */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total asignado</span>
          <span className={`text-lg font-bold ${isValid ? "text-emerald-600" : "text-destructive"}`}>
            {formatCOP(totalAllocated)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-muted-foreground">Ingreso mensual</span>
          <span className="text-xs text-muted-foreground">{formatCOP(income)}</span>
        </div>
        {!isValid && (
          <p className="text-xs text-destructive mt-2">
            El total asignado excede el ingreso mensual
          </p>
        )}
      </div>
    </div>
  );
}
