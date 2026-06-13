"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  if (current <= 3) {
    start = 2;
    end = Math.min(4, total - 1);
  } else if (current >= total - 2) {
    start = Math.max(total - 3, 2);
    end = total - 1;
  }

  if (start > 2) pages.push("ellipsis");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) pages.push("ellipsis");

  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-1 mt-4"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
        className="rounded-full w-8 h-8 border-[#e8e8e8] dark:border-[#2a2a2e] text-[#737373] dark:text-[#a1a1aa] shrink-0"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>

      {/* Desktop numbered pages */}
      <div className="hidden md:flex items-center gap-1" role="list" aria-label="Números de página">
        {pageNumbers.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex items-center justify-center w-8 h-8 text-xs text-[#737373] dark:text-[#a1a1aa] select-none"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              role="listitem"
              onClick={() => onPageChange(item)}
              aria-label={`Ir a página ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors tabular-nums border",
                item === page
                  ? "bg-[#17181c] text-white border-[#17181c] dark:bg-white dark:text-[#17181c] dark:border-white"
                  : "bg-white dark:bg-[#17181c] text-[#737373] dark:text-[#a1a1aa] border-[#e8e8e8] dark:border-[#2a2a2e] hover:border-[#d4d4d4] dark:hover:border-[#404040]"
              )}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Mobile compact label */}
      <p className="md:hidden text-xs text-[#737373] dark:text-[#a1a1aa] px-2">
        Página{" "}
        <span className="font-bold text-[#17181c] dark:text-white">{page}</span>{" "}
        de{" "}
        <span className="font-bold text-[#17181c] dark:text-white">
          {totalPages}
        </span>
      </p>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Página siguiente"
        className="rounded-full w-8 h-8 border-[#e8e8e8] dark:border-[#2a2a2e] text-[#737373] dark:text-[#a1a1aa] shrink-0"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </nav>
  );
}
