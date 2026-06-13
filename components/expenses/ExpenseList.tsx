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
  Wallet,
  SearchX,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ExpenseCard } from "./ExpenseCard";
import { Pagination } from "@/components/ui/pagination";

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
  NEEDS: "bg-[#23ad1b]",
  WANTS: "bg-[#e7964d]",
  SAVINGS: "bg-[#617dd5]",
  DEBT: "bg-[#e54d4d]",
};

const TYPE_PILL: Record<CategoryType, string> = {
  NEEDS:
    "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15 text-[#23ad1b] dark:text-[#23ad1b] border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  WANTS:
    "bg-[#e7964d]/10 dark:bg-[#e7964d]/15 text-[#e7964d] dark:text-[#e7964d] border-[#e7964d]/20 dark:border-[#e7964d]/20",
  SAVINGS:
    "bg-[#617dd5]/10 dark:bg-[#617dd5]/15 text-[#617dd5] dark:text-[#617dd5] border-[#617dd5]/20 dark:border-[#617dd5]/20",
  DEBT:
    "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15 text-[#e54d4d] dark:text-[#e54d4d] border-[#e54d4d]/20 dark:border-[#e54d4d]/20",
};

const RECURRENCE_PILL: Record<Recurrence, string> = {
  MONTHLY:
    "bg-[#8b5cf6]/10 dark:bg-[#8b5cf6]/15 text-[#8b5cf6] dark:text-[#8b5cf6] border-[#8b5cf6]/20 dark:border-[#8b5cf6]/20",
  BIWEEKLY:
    "bg-[#06b6d4]/10 dark:bg-[#06b6d4]/15 text-[#06b6d4] dark:text-[#06b6d4] border-[#06b6d4]/20 dark:border-[#06b6d4]/20",
  ONE_TIME:
    "bg-[#f5f5f5] dark:bg-[#1a1a1e] text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e]",
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
      className="flex items-center gap-1.5 hover:text-[#17181c] dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]"
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
    <div className="text-center py-12 px-4 border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] rounded-2xl bg-white dark:bg-[#17181c]">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1e] flex items-center justify-center mb-4">
        <Wallet className="h-7 w-7 text-[#737373] dark:text-[#a1a1aa]" />
      </div>
      <h3 className="text-base font-semibold text-[#17181c] dark:text-white">
        Aún no has registrado gastos
      </h3>
      <p className="text-sm text-[#737373] dark:text-[#a1a1aa] mt-1 max-w-md mx-auto">
        Empieza agregando tu primer gasto para ver tu distribución por categoría y recurrencia.
      </p>
      {onAdd && (
        <Button
          onClick={onAdd}
          className="mt-4 bg-[#17181c] text-white hover:bg-[#333438] dark:bg-white dark:text-[#17181c] dark:hover:bg-[#f5f5f5]"
        >
          Agregar gasto
        </Button>
      )}
    </div>
  );
}

function NoResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-[#e8e8e8] dark:border-[#2a2a2e] rounded-2xl bg-white dark:bg-[#17181c]">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1e] flex items-center justify-center mb-4">
        <SearchX className="h-7 w-7 text-[#737373] dark:text-[#a1a1aa]" />
      </div>
      <h3 className="text-base font-semibold text-[#17181c] dark:text-white">
        Sin resultados con esos filtros
      </h3>
      <p className="text-sm text-[#737373] dark:text-[#a1a1aa] mt-1 max-w-md mx-auto">
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
      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden bg-white dark:bg-[#17181c] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#fafafa] dark:bg-[#1e1e22] hover:bg-[#fafafa] dark:hover:bg-[#1e1e22] border-b border-[#e8e8e8] dark:border-[#2a2a2e]">
              <TableHead className="h-10 py-2">
                <SortableHeader
                  active={sortKey === "description"}
                  direction={sortDir}
                  onClick={() => handleSort("description")}
                >
                  Descripción
                </SortableHeader>
              </TableHead>
              <TableHead className="h-10 py-2">
                <SortableHeader
                  active={sortKey === "category"}
                  direction={sortDir}
                  onClick={() => handleSort("category")}
                >
                  Categoría
                </SortableHeader>
              </TableHead>
              <TableHead className="h-10 py-2">
                <SortableHeader
                  active={sortKey === "nextDate"}
                  direction={sortDir}
                  onClick={() => handleSort("nextDate")}
                >
                  Próxima fecha
                </SortableHeader>
              </TableHead>
              <TableHead className="h-10 py-2 text-right">
                <SortableHeader
                  active={sortKey === "amount"}
                  direction={sortDir}
                  onClick={() => handleSort("amount")}
                >
                  Monto
                </SortableHeader>
              </TableHead>
              <TableHead className="h-10 py-2 text-right" sticky>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
                  Acciones
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((transaction, index) => {
              const category = transaction.category;
              const type = category?.type as CategoryType | undefined;
              const amount = parseFloat(transaction.amount);
              const perPayment = getPerPaymentAmount(amount, transaction.recurrence);
              const showPerPayment =
                transaction.recurrence === "BIWEEKLY" && perPayment !== amount;
              const isOdd = index % 2 === 1;

              return (
                <TableRow
                  key={transaction.id}
                  className={`${
                    isOdd
                      ? "bg-[#fafafa]/50 dark:bg-[#1e1e22]/50"
                      : "bg-white dark:bg-[#17181c]"
                  } hover:bg-[#f5f5f5] dark:hover:bg-white/5 border-b border-[#e8e8e8]/50 dark:border-[#2a2a2e]/50 transition-colors`}
                >
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-[#17181c] dark:text-white line-clamp-2">
                        {transaction.description || (
                          <span className="text-[#a1a1aa] italic font-normal">
                            Sin descripción
                          </span>
                        )}
                      </span>
                      {transaction.recurrence && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${RECURRENCE_PILL[transaction.recurrence]}`}
                        >
                          {RECURRENCE_DESCRIPTIONS[transaction.recurrence]}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {type && (
                        <span
                          className={`h-2 w-2 rounded-full shrink-0 ${TYPE_DOT[type]}`}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-sm text-[#17181c] dark:text-white">
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
                  <TableCell className="py-3 text-sm text-[#737373] dark:text-[#a1a1aa] tabular-nums whitespace-nowrap">
                    {formatNextOccurrenceLabel(transaction.date, transaction.recurrence)}
                  </TableCell>
                  <TableCell className="py-3 text-right tabular-nums whitespace-nowrap">
                    <div className="font-semibold text-[#17181c] dark:text-white">
                      {new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      }).format(amount)}
                    </div>
                    {showPerPayment && (
                      <div className="text-[10px] text-[#a1a1aa] mt-0.5">
                        Por pago:{" "}
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          maximumFractionDigits: 0,
                        }).format(perPayment)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right" sticky>
                    <div className="flex justify-end gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="h-8 w-8 hover:bg-[#26be15]/10 hover:text-[#26be15]"
                        aria-label="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction)}
                        className="h-8 w-8 text-[#e54d4d] hover:bg-[#e54d4d]/10 hover:text-[#e54d4d]"
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

      {/* Mobile cards */}
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
