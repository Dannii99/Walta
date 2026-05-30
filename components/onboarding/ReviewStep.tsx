"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCOP } from "@/lib/currency";
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

export function ReviewStep({
  income,
  categories,
  onCategoriesChange,
}: ReviewStepProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>("NEEDS");

  const updateCategoryName = (id: string, name: string) => {
    onCategoriesChange(
      categories.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const removeCategory = (id: string) => {
    onCategoriesChange(categories.filter((c) => c.id !== id));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    onCategoriesChange([
      ...categories,
      {
        id: `new-${Date.now()}`,
        name: newCategoryName.trim(),
        type: newCategoryType,
        suggestedAmount: 0,
      },
    ]);
    setNewCategoryName("");
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.suggestedAmount, 0);
  const isValid = totalAllocated <= income;

  const typeLabel: Record<CategoryType, string> = {
    NEEDS: "Necesidades",
    WANTS: "Deseos",
    SAVINGS: "Ahorros",
    DEBT: "Deudas",
  };

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
                    {typeLabel[category.type]}
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
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Nueva categoría..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="h-9"
          />
        </div>
        <select
          value={newCategoryType}
          onChange={(e) => setNewCategoryType(e.target.value as CategoryType)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="NEEDS">Necesidades</option>
          <option value="WANTS">Deseos</option>
          <option value="SAVINGS">Ahorros</option>
        </select>
        <Button variant="outline" size="sm" className="h-9 gap-1" onClick={addCategory}>
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
