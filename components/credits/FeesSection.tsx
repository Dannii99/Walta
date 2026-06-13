"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeeCard } from "./FeeCard";
import { FeeForm } from "./FeeForm";
import { calculateTotalMonthlyFees, calculateTotalUpfrontFees } from "@/lib/loan-fees";
import { formatCOP } from "@/lib/currency";
import type { FeeItem } from "@/types";

interface FeesSectionProps {
  fees: FeeItem[];
  onChange: (fees: FeeItem[]) => void;
}

export function FeesSection({ fees, onChange }: FeesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (fee: FeeItem) => {
    onChange([...fees, fee]);
    setIsAdding(false);
  };

  const handleUpdate = (updated: FeeItem) => {
    onChange(fees.map((f) => (f.id === updated.id ? updated : f)));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    onChange(fees.filter((f) => f.id !== id));
  };

  const monthlyTotal = calculateTotalMonthlyFees(fees);
  const upfrontTotal = calculateTotalUpfrontFees(fees);
  const isEmpty = fees.length === 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Cargos adicionales
        </h3>
        {fees.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {fees.length} cargo{fees.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <motion.div
        layout
        className="flex flex-col gap-3"
      >
        <AnimatePresence mode="popLayout">
          {fees.map((fee) =>
            editingId === fee.id ? (
              <FeeForm
                key={fee.id}
                initialFee={fee}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <FeeCard
                key={fee.id}
                fee={fee}
                onEdit={() => setEditingId(fee.id)}
                onDelete={handleDelete}
              />
            )
          )}

          {isAdding && (
            <FeeForm
              key="adding"
              onSave={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          )}

          {isEmpty && !isAdding && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 p-6 text-center"
            >
              <Receipt
                className="h-8 w-8 mx-auto text-stone-400 dark:text-stone-500 mb-2"
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                ¿Tienes cargos extra en tu extracto?
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Seguros, comisiones o matrículas que el banco suma a tu cuota
                o cobra por separado.
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                className="mt-3"
                size="sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Agregar cargo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAdding && !isEmpty && (
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setIsAdding(true)}
            className="flex min-h-[60px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-input bg-muted/50 p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <span className="text-xs font-medium">+ Agregar otro cargo</span>
          </motion.button>
        )}
      </motion.div>

      {(monthlyTotal > 0 || upfrontTotal > 0) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {monthlyTotal > 0 && (
            <span>
              Cargos mensuales: <span className="font-medium text-foreground">{formatCOP(monthlyTotal)}/mes</span>
            </span>
          )}
          {upfrontTotal > 0 && (
            <span>
              Cargos iniciales: <span className="font-medium text-foreground">{formatCOP(upfrontTotal)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
