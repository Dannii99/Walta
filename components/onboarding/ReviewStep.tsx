"use client";

import { useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCOP } from "@/lib/currency";
import { PREDEFINED_CATEGORIES, OTHER_CATEGORY_KEY, type PredefinedCategory } from "@/lib/categories";
import { getCategoryIconComponent } from "@/lib/category-icons";
import type { CategoryType } from "@/types";

const CATEGORY_COLORS: Record<CategoryType, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  suggestedAmount: number;
  icon: string;
  description?: string;
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

const TYPE_ORDER: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS"];

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

  const groupedItems = useMemo(() => {
    const result: Record<CategoryType, CategoryItem[]> = {
      NEEDS: [],
      WANTS: [],
      SAVINGS: [],
      DEBT: [],
    };
    categories.forEach((c) => {
      if (result[c.type]) {
        result[c.type].push(c);
      }
    });
    return result;
  }, [categories]);

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
    let icon: string = "Home";
    let description: string | undefined;

    if (selectedCategory === OTHER_CATEGORY_KEY) {
      const trimmed = otherName.trim();
      if (!trimmed) return;
      if (existingNames.has(trimmed.toLowerCase())) return;
      name = trimmed;
      type = otherType;
      icon = "Home";
    } else if (selectedCategory) {
      const predefined = PREDEFINED_CATEGORIES.find(
        (c) => c.name === selectedCategory
      );
      if (!predefined) return;
      name = predefined.name;
      type = predefined.type;
      icon = predefined.icon;
      description = predefined.description;
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
        icon,
        description,
      },
    ]);
    setSelectedCategory("");
    setOtherName("");
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.suggestedAmount, 0);
  const isValid = totalAllocated <= income;
  const progressPct = income > 0 ? Math.min((totalAllocated / income) * 100, 100) : 0;

  const isAddDisabled =
    !selectedCategory ||
    (selectedCategory === OTHER_CATEGORY_KEY && !otherName.trim());

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight">Revisa tus categorías</h2>
        <p className="text-muted-foreground text-sm">
          Edita los nombres o elimina las que no necesites
        </p>
      </div>

      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
        {TYPE_ORDER.map((type) => {
          const items = groupedItems[type];
          if (items.length === 0) return null;
          const color = CATEGORY_COLORS[type];

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color }}>
                  {TYPE_LABELS[type]}
                </h3>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {items.length} {items.length === 1 ? "categoría" : "categorías"}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {items.map((category) => {
                const Icon = getCategoryIconComponent(category.icon);
                return (
                  <Card
                    key={category.id}
                    className="border-l-2"
                    style={{ borderLeftColor: color }}
                  >
                    <CardContent className="p-2.5 flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          value={category.name}
                          onChange={(e) => updateCategoryName(category.id, e.target.value)}
                          className="h-8 text-sm border-transparent hover:border-border focus-visible:border-border bg-transparent"
                        />
                        {category.description && (
                          <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 px-1 truncate">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold tabular-nums">
                          {formatCOP(category.suggestedAmount)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeCategory(category.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          );
        })}
      </div>

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
          className="h-9 gap-1 w-full rounded-full"
          disabled={isAddDisabled}
        >
          <Plus className="h-4 w-4" />
          Agregar categoría
        </Button>
      </div>

      <div className="rounded-xl border border-border p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Total asignado</span>
          <span className={`text-base font-extrabold tabular-nums ${isValid ? "text-primary" : "text-destructive"}`}>
            {formatCOP(totalAllocated)}
          </span>
        </div>

        <div className="relative h-2 rounded-full overflow-hidden bg-muted">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${isValid ? "bg-gradient-to-r from-primary/60 to-primary" : "bg-gradient-to-r from-amber-500 to-destructive"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground font-medium">Ingreso mensual</span>
          <span className="text-[11px] text-muted-foreground font-semibold tabular-nums">
            {formatCOP(income)}
          </span>
        </div>

        {!isValid && (
          <p className="text-xs text-destructive font-medium pt-1">
            El total asignado excede el ingreso mensual
          </p>
        )}
      </div>
    </div>
  );
}