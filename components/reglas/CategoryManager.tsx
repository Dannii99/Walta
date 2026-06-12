"use client";

import { useState, useMemo, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Trash2,
  Plus,
  AlertTriangle,
  Pencil,
  Save,
  X,
  Tags,
  Search,
  Check,
  ChevronDown,
  Home,
  ShoppingBag,
  PiggyBank,
  CreditCard,
  type LucideIcon,
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
  NEEDS: "#e54d4d",
  WANTS: "#617dd5",
  SAVINGS: "#23ad1b",
  DEBT: "#9333ea",
};

const TYPE_BG: Record<CategoryType, string> = {
  NEEDS: "bg-[#e54d4d]/10 text-[#e54d4d] border-[#e54d4d]/20",
  WANTS: "bg-[#617dd5]/10 text-[#617dd5] border-[#617dd5]/20",
  SAVINGS: "bg-[#23ad1b]/10 text-[#23ad1b] border-[#23ad1b]/20",
  DEBT: "bg-[#9333ea]/10 text-[#9333ea] border-[#9333ea]/20",
};

const TYPE_ICONS: Record<CategoryType, LucideIcon> = {
  NEEDS: Home,
  WANTS: ShoppingBag,
  SAVINGS: PiggyBank,
  DEBT: CreditCard,
};

const TYPE_OPTIONS: CategoryType[] = ["NEEDS", "WANTS", "SAVINGS"];

export function CategoryManager({ budgetId, categories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<CategoryType | "all">("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<CategoryType>("NEEDS");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherName, setOtherName] = useState("");
  const [otherType, setOtherType] = useState<CategoryType>("NEEDS");
  const [showAddSection, setShowAddSection] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState<{
    category: CategoryWithCount;
    reassignTo: string;
  } | null>(null);

  const [typeChangeWarning, setTypeChangeWarning] = useState<{
    category: CategoryWithCount;
    newType: CategoryType;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const existingNames = useMemo(
    () => new Set(categories.map((c) => c.name.toLowerCase())),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    if (activeFilter === "all") return categories;
    return categories.filter((c) => c.type === activeFilter);
  }, [categories, activeFilter]);

  const filteredPredefined = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return PREDEFINED_CATEGORIES;
    return PREDEFINED_CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedPredefined = useMemo(() => {
    const groups: Record<CategoryType, PredefinedCategory[]> = {
      NEEDS: [],
      WANTS: [],
      SAVINGS: [],
      DEBT: [],
    };
    filteredPredefined.forEach((c) => {
      groups[c.type].push(c);
    });
    return groups;
  }, [filteredPredefined]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        setSearchQuery("");
        setDropdownOpen(false);
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

  const filterOptions: { value: CategoryType | "all"; label: string; count: number }[] = [
    { value: "all", label: "Todas", count: categories.length },
    { value: "NEEDS", label: "Necesidades", count: categories.filter((c) => c.type === "NEEDS").length },
    { value: "WANTS", label: "Deseos", count: categories.filter((c) => c.type === "WANTS").length },
    { value: "SAVINGS", label: "Ahorros", count: categories.filter((c) => c.type === "SAVINGS").length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-[#17181c] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5"
    >
      <header className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#17181c] dark:text-white flex items-center justify-center shrink-0">
          <Tags className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white">
            Categorías
          </h2>
          <p className="text-xs md:text-sm text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
            Agrega, edita o elimina las categorías de tu presupuesto. Son la base del dashboard.
          </p>
        </div>
      </header>

      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#e54d4d]/20 bg-[#e54d4d]/5 dark:bg-[#e54d4d]/10 p-3 text-sm text-[#e54d4d] font-medium">
            {error}
          </div>
        )}

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mr-1">
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
                  "px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors",
                  active
                    ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                    : "bg-white dark:bg-[#1a1a1e] text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e] hover:border-[#737373]"
                )}
              >
                {opt.label}
                <span className={cn("ml-1 text-[10px]", active ? "text-white/70 dark:text-[#17181c]/70" : "text-[#737373]/70 dark:text-[#a1a1aa]/70")}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-3">
          {filteredCategories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] bg-[#fafafa] dark:bg-[#1a1a1e] p-6 text-center">
              <p className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium">
                {activeFilter === "all"
                  ? "Aún no tienes categorías. Agrega una abajo."
                  : `No tienes categorías de ${TYPE_LABELS[activeFilter]}.`}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredCategories.map((category, index) => {
                const isEditing = editingId === category.id;
                const txCount = category._count.transactions;
                const type = category.type as CategoryType;
                const TypeIcon = TYPE_ICONS[type];
                const color = TYPE_COLORS[type];
                const bgClass = TYPE_BG[type];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#1a1a1e] overflow-hidden transition-colors hover:bg-[#fafafa] dark:hover:bg-[#222226]"
                    style={{ borderLeft: `4px solid ${color}` }}
                  >
                    {isEditing ? (
                      <div className="p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-10 text-sm flex-1 border-[#e8e8e8] dark:border-[#2a2a2e]"
                          autoFocus
                          placeholder="Nombre de la categoría"
                        />
                        <Select
                          value={editType}
                          onValueChange={(v) => setEditType(v as CategoryType)}
                        >
                          <SelectTrigger className="h-10 w-full sm:w-44 border-[#e8e8e8] dark:border-[#2a2a2e]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPE_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: TYPE_COLORS[t] }}
                                  />
                                  {TYPE_LABELS[t]}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-[#23ad1b] hover:bg-[#23ad1b]/10"
                            onClick={() => saveEdit(category)}
                            disabled={isPending}
                            aria-label="Guardar cambios"
                          >
                            <Save className="h-4 w-4" strokeWidth={2.2} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-[#737373] hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2e]"
                            onClick={cancelEdit}
                            disabled={isPending}
                            aria-label="Cancelar edición"
                          >
                            <X className="h-4 w-4" strokeWidth={2.2} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <TypeIcon className="h-5 w-5" style={{ color }} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-[#17181c] dark:text-white truncate">
                              {category.name}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0 border",
                                bgClass
                              )}
                            >
                              {TYPE_LABELS[type]}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5">
                            {txCount} {txCount === 1 ? "gasto" : "gastos"}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#737373] hover:text-[#17181c] hover:bg-[#f5f5f5] dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-[#2a2a2e]"
                            onClick={() => startEdit(category)}
                            disabled={isPending}
                            aria-label={`Editar ${category.name}`}
                          >
                            <Pencil className="h-4 w-4" strokeWidth={2.2} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#e54d4d] hover:text-[#e54d4d] hover:bg-[#e54d4d]/10 dark:text-[#e54d4d] dark:hover:text-[#e54d4d] dark:hover:bg-[#e54d4d]/10"
                            onClick={() => openDeleteDialog(category)}
                            disabled={isPending}
                            aria-label={`Eliminar ${category.name}`}
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2.2} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Add section toggle */}
        <div className="pt-2">
          <button
            onClick={() => setShowAddSection(!showAddSection)}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors",
              showAddSection
                ? "border-[#e8e8e8] bg-[#fafafa] text-[#17181c] dark:border-[#2a2a2e] dark:bg-[#1a1a1e] dark:text-white"
                : "border-[#e8e8e8] bg-white text-[#17181c] hover:bg-[#fafafa] dark:border-[#2a2a2e] dark:bg-[#17181c] dark:text-white dark:hover:bg-[#1a1a1e]"
            )}
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            {showAddSection ? "Cancelar" : "Agregar categoría"}
          </button>
        </div>

        {/* Add section */}
        <AnimatePresence>
          {showAddSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2 border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                  Seleccionar categoría
                </p>

                {/* Custom searchable dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] dark:text-[#a1a1aa]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setDropdownOpen(true);
                        setSelectedCategory("");
                      }}
                      onFocus={() => setDropdownOpen(true)}
                      placeholder="Buscar categoría..."
                      className={cn(
                        "w-full h-10 pl-9 pr-10 text-sm rounded-xl border",
                        "bg-white dark:bg-[#1a1a1e] border-[#e8e8e8] dark:border-[#2a2a2e]",
                        "text-[#17181c] dark:text-white placeholder:text-[#a1a1aa]",
                        "focus:outline-none focus:ring-2 focus:ring-[#617dd5]/30 focus:border-[#617dd5]"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-lg text-[#737373] hover:text-[#17181c] hover:bg-[#f5f5f5] dark:text-[#a1a1aa] dark:hover:text-white dark:hover:bg-[#2a2a2e]"
                    >
                      <ChevronDown className={cn("h-4 w-4 transition-transform", dropdownOpen && "rotate-180")} />
                    </button>
                  </div>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 top-full left-0 right-0 mt-1 rounded-xl border border-[#e8e8e8] dark:border-[#2a2a2e] bg-white dark:bg-[#17181c] shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden max-h-[320px] overflow-y-auto"
                      >
                        {TYPE_OPTIONS.map((type) => {
                          const group = groupedPredefined[type];
                          if (group.length === 0) return null;
                          const color = TYPE_COLORS[type];
                          return (
                            <div key={type}>
                              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] bg-[#fafafa] dark:bg-[#1a1a1e] sticky top-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                                  {TYPE_LABELS[type]}
                                </div>
                              </div>
                              {group.map((cat) => {
                                const isAdded = existingNames.has(cat.name.toLowerCase());
                                return (
                                  <button
                                    key={cat.name}
                                    type="button"
                                    disabled={isAdded}
                                    onClick={() => {
                                      setSelectedCategory(cat.name);
                                      setSearchQuery(cat.name);
                                      setDropdownOpen(false);
                                    }}
                                    className={cn(
                                      "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors",
                                      isAdded
                                        ? "text-[#a1a1aa] dark:text-[#737373] cursor-not-allowed"
                                        : "text-[#17181c] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e]"
                                    )}
                                  >
                                    {isAdded ? (
                                      <Check className="h-4 w-4 text-[#23ad1b] shrink-0" />
                                    ) : (
                                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                    )}
                                    <span className={cn("flex-1", isAdded && "line-through opacity-60")}>
                                      {cat.name}
                                    </span>
                                    {isAdded && (
                                      <span className="text-[10px] text-[#23ad1b] font-semibold">Agregada</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                        {/* Custom option */}
                        <div className="border-t border-[#e8e8e8] dark:border-[#2a2a2e]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory(OTHER_CATEGORY_KEY);
                              setDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors",
                              selectedCategory === OTHER_CATEGORY_KEY
                                ? "bg-[#f5f5f5] dark:bg-[#2a2a2e] text-[#17181c] dark:text-white"
                                : "text-[#17181c] dark:text-white hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2e]"
                            )}
                          >
                            <Plus className="h-4 w-4 text-[#617dd5] shrink-0" />
                            <span className="flex-1">Personalizado (otro)...</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Custom name input */}
                {selectedCategory === OTHER_CATEGORY_KEY && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Nombre personalizado..."
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                      className="h-10 flex-1 border-[#e8e8e8] dark:border-[#2a2a2e]"
                    />
                    <Select
                      value={otherType}
                      onValueChange={(v) => setOtherType(v as CategoryType)}
                    >
                      <SelectTrigger className="h-10 w-full sm:w-44 border-[#e8e8e8] dark:border-[#2a2a2e]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: TYPE_COLORS[t] }}
                              />
                              {TYPE_LABELS[t]}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Selected indicator */}
                {selectedCategory && selectedCategory !== OTHER_CATEGORY_KEY && (
                  <div className="flex items-center gap-2 rounded-lg bg-[#f5f5f5] dark:bg-[#1a1a1e] px-3 py-2">
                    <span className="text-xs text-[#737373] dark:text-[#a1a1aa]">Seleccionada:</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0"
                    >
                      {selectedCategory}
                    </Badge>
                  </div>
                )}

                <Button
                  onClick={handleAdd}
                  className="h-10 gap-1.5 w-full bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
                  disabled={isAddDisabled || isPending}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.2} />
                  Agregar categoría
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete dialog */}
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
                  <Select
                    value={deleteDialog.reassignTo}
                    onValueChange={(v) =>
                      setDeleteDialog({ ...deleteDialog, reassignTo: v })
                    }
                  >
                    <SelectTrigger className="h-10 border-[#e8e8e8] dark:border-[#2a2a2e]">
                      <SelectValue placeholder="Seleccionar categoría de destino..." />
                    </SelectTrigger>
                    <SelectContent>
                      {otherCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: TYPE_COLORS[c.type as CategoryType] }}
                            />
                            {c.name} ({TYPE_LABELS[c.type as CategoryType]})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              className="bg-[#e54d4d] text-white hover:bg-[#c43939]"
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

      {/* Type change warning dialog */}
      <AlertDialog
        open={!!typeChangeWarning}
        onOpenChange={(open) => !open && setTypeChangeWarning(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#e7964d]" strokeWidth={2.2} />
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
                    métricas del dashboard se recalcularán con estos gastos en la nueva categoría.
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
              className="bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
            >
              Cambiar tipo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
