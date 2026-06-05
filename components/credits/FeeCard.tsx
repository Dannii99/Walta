"use client";

import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ANNUAL_TO_MONTHLY, getFeeIcon } from "@/lib/loan-fees";
import { formatCOP } from "@/lib/currency";
import type { FeeItem } from "@/types";

interface FeeCardProps {
  fee: FeeItem;
  onEdit?: (fee: FeeItem) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
}

function FeeIcon({ name }: { name: string }) {
  return React.createElement(getFeeIcon(name), {
    className: "h-5 w-5 text-primary",
  });
}

export function FeeCard({ fee, onDelete }: FeeCardProps) {
  const isMonthly = fee.type === "monthly";
  const monthlyEquivalent = isMonthly ? fee.amount / ANNUAL_TO_MONTHLY : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="group relative rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onDelete(fee.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <FeeIcon name={fee.name} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{fee.name}</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums">
            {isMonthly
              ? `${formatCOP(monthlyEquivalent)}/mes`
              : formatCOP(fee.amount)}
          </p>
          {isMonthly && (
            <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
              Anual: {formatCOP(fee.amount)}
            </p>
          )}
          <Badge
            variant="outline"
            className={`mt-1.5 text-[10px] ${
              isMonthly
                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
            }`}
          >
            {isMonthly ? "Cobro mensual" : "Pago único"}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
