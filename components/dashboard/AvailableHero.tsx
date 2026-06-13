"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { animate, motion } from "framer-motion";
import { Plus, ArrowRight, Nfc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/lib/dashboard-helpers";

interface AvailableHeroProps {
  available: number;
  income: number;
  expenses: number;
  savingsCapacity: number;
  expensesPct: number;
  overBudget: boolean;
  healthStatus: HealthStatus;
  dynamicMessage: string;
  onAddExpense: () => void;
  reducedMotion?: boolean;
}

function StatusBadge({ status }: { status: HealthStatus }) {
  const config = {
    healthy: { label: "Saludable", color: "bg-[#23ad1b]" },
    warning: { label: "Ajustado", color: "bg-[#e7964d]" },
    critical: { label: "Riesgoso", color: "bg-[#e7964d]" },
    deficit: { label: "Déficit", color: "bg-[#e54d4d]" },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
      <span className={cn("h-1.5 w-1.5 rounded-full", c.color)} />
      {c.label}
    </span>
  );
}

export function AvailableHero({
  available,
  healthStatus,
  dynamicMessage,
  overBudget,
  onAddExpense,
  reducedMotion,
}: AvailableHeroProps) {
  const router = useRouter();
  const [displayAvailable, setDisplayAvailable] = useState(0);
  useEffect(() => {
    const controls = animate(0, available, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayAvailable(v),
    });
    return controls.stop;
  }, [available]);

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayAvailable);

  return (
    <div className="space-y-5">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-[#17181c] to-[#333438] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        {/* Card edge shine */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="p-6 md:p-8 space-y-5">
          {/* Top row: Walta (left) + NFC + Chip (right) */}
          <div className="flex items-start justify-between gap-4 mb-12">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 shrink-0">
                <img
                  src="/logo/Walta_App_dark.svg"
                  alt="Walta"
                  className="h-full w-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold tracking-tight text-white leading-none">
                  Walta
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mt-0.5">
                  Tu dinero, más claro.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Nfc className="h-5 w-5 text-[#26be15]" strokeWidth={1.5} />
              <img
                src="/icono_chip_transparente_vector_4k.png"
                alt=""
                aria-hidden
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* Amount section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                Disponible este mes
              </p>
              <StatusBadge status={healthStatus} />
            </div>
            <p
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight tabular-nums leading-[1.05]",
                available < 0 ? "text-[#e54d4d]" : "text-white"
              )}
            >
              {formatted}
            </p>
            <p className="text-xs md:text-sm text-white/50 font-medium max-w-lg">
              {overBudget
                ? "Sobre el límite — revisa tus gastos."
                : available < 0
                ? "Estás en déficit este mes."
                : dynamicMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA buttons outside card */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          onClick={onAddExpense}
          className="bg-white text-[#17181c] hover:bg-[#f5f5f5] shadow-sm h-11 px-5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Agregar gasto
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/expenses")}
          className="border-[#26be15] text-[#26be15] hover:bg-[#26be15]/10 hover:text-[#26be15] h-11 px-5 text-sm font-semibold"
        >
          <ArrowRight className="h-4 w-4 mr-1.5" />
          Ver gastos
        </Button>
      </div>
    </div>
  );
}
