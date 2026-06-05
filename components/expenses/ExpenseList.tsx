"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RECURRENCE_DESCRIPTIONS,
  getPerPaymentAmount,
  getNextOccurrence,
  formatNextOccurrenceLabel,
} from "@/lib/recurrence";
import type { Category, CategoryType, Recurrence, Transaction } from "@/types";
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Wallet,
  SearchX,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ExpenseCard } from "./ExpenseCard";

interface ExpenseListProps {
  transactions: (Transaction & { category?: Category })[];
  onEdit: (transaction: Transaction & { category?: Category }) => void;
  onDelete: (transaction: Transaction & { category?: Category }) => void;
  onAdd?: () => void;
  onClearFilters?: () => void;
}

type SortKey = "description" | "amount" | "nextDate" | "category";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 25;

const TYPE_LABELS: Record<CategoryType, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const TYPE_DOT: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-500",
  WANTS: "bg-amber-500",
  SAVINGS: "bg-blue-500",
  DEBT: "bg-rose-500",
};

const TYPE_PILL: Record<CategoryType, string> = {
  NEEDS: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  WANTS: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  SAVINGS: "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  DEBT: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
};

const RECURRENCE_PILL: Record<Recurrence, string> = {
  MONTHLY:
    "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-900",
  BIWEEKLY:
    "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  ONE_TIME:
    "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700",
};

function SortableHeader({
  active,
  direction,
  onClick,
  children,
}: {
  active: boolean;
  direction: SortDir;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
    >
      {children}
      {active ? (
        direction === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

function EmptyState({
  onAdd,
}: {
  onAdd?: () => void;
}) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-stone-200/80 dark:border-stone-800 rounded-2xl">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
        <Wallet className="h-7 w-7 text-stone-500 dark:text-stone-400" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
        Aún no has registrado gastos
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
        Empieza agregando tu primer gasto para ver tu distribución por categoría y recurrencia.
      </p>
      {onAdd && (
        <Button
          onClick={onAdd}
          className="mt-4 bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          Agregar gasto
        </Button>
      )}
    </div>
  );
}

function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-stone-200/80 dark:border-stone-800 rounded-2xl">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-stone-500 dark:text-stone-400" />
      </div>
      <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">
        Sin resultados con esos filtros
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
        Prueba ajustando la búsqueda, categoría, tipo o frecuencia.
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear} className="mt-4">
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 mt-4 px-1">
      <p className="text-xs text-stone-500 dark:text-stone-400">
        Página <span className="font-bold text-stone-700 dark:text-stone-200">{page}</span> de{" "}
        <span className="font-bold text-stone-700 dark:text-stone-200">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Siguiente
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function ExpenseList({
  transactions,
  onEdit,
  onDelete,
  onAdd,
  onClearFilters,
}: ExpenseListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const arr = [...transactions];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") {
        cmp = parseFloat(a.amount) - parseFloat(b.amount);
      } else if (sortKey === "nextDate") {
        const na = getNextOccurrence(new Date(a.date), a.recurrence)?.getTime() ?? 0;
        const nb = getNextOccurrence(new Date(b.date), b.recurrence)?.getTime() ?? 0;
        cmp = na - nb;
      } else if (sortKey === "category") {
        cmp = (a.category?.name ?? "").localeCompare(b.category?.name ?? "", "es");
      } else {
        cmp = (a.description ?? "").localeCompare(b.description ?? "", "es");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [transactions, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  if (transactions.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  if (sorted.length === 0) {
    return <NoResultsState onClear={onClearFilters} />;
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  active={sortKey === "description"}
                  direction={sortDir}
                  onClick={() => handleSort("description")}
                >
                  Descripción
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader
                  active={sortKey === "category"}
                  direction={sortDir}
                  onClick={() => handleSort("category")}
                >
                  Categoría
                </SortableHeader>
              </TableHead>
              <TableHead>Recurrencia</TableHead>
              <TableHead>
                <SortableHeader
                  active={sortKey === "nextDate"}
                  direction={sortDir}
                  onClick={() => handleSort("nextDate")}
                >
                  Próxima fecha
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right">
                <SortableHeader
                  active={sortKey === "amount"}
                  direction={sortDir}
                  onClick={() => handleSort("amount")}
                >
                  Monto
                </SortableHeader>
              </TableHead>
              <TableHead className="text-right" sticky>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((transaction) => {
              const category = transaction.category;
              const type = category?.type as CategoryType | undefined;
              const amount = parseFloat(transaction.amount);
              const perPayment = getPerPaymentAmount(amount, transaction.recurrence);
              const showPerPayment =
                transaction.recurrence === "BIWEEKLY" && perPayment !== amount;

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="max-w-xs">
                    <span className="text-sm font-medium text-stone-900 dark:text-stone-50 line-clamp-2">
                      {transaction.description || (
                        <span className="text-stone-400 italic font-normal">
                          Sin descripción
                        </span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      {type && (
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${TYPE_DOT[type]}`}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm truncate">
                        {category?.name ?? "—"}
                      </span>
                      {type && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${TYPE_PILL[type]}`}
                        >
                          {TYPE_LABELS[type]}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${RECURRENCE_PILL[transaction.recurrence]}`}
                    >
                      {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-stone-600 dark:text-stone-400 tabular-nums whitespace-nowrap">
                    {formatNextOccurrenceLabel(transaction.date, transaction.recurrence)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums whitespace-nowrap">
                    <div className="font-medium">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(amount)}
                    </div>
                    {showPerPayment && (
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                        Por pago:{" "}
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        }).format(perPayment)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right" sticky>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8"
                        aria-label="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {paginated.map((transaction) => (
          <ExpenseCard
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
