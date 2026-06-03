"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Car,
  CreditCard,
  Home,
  Trash2,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TYPE_LABELS,
  TYPE_ICON_BG,
  VERDICT_LABELS,
  VERDICT_PILL,
  type DbVerdict,
  labelOr,
} from "@/lib/simulation-types";

const TYPE_ICON: Record<string, LucideIcon> = {
  VEHICLE: Car,
  PERSONAL: Wallet,
  HOUSING: Home,
  OTHER: CreditCard,
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

interface SimulationDetailHeaderProps {
  simulation: {
    id: string;
    type: string;
    title: string;
    createdAt: string;
  };
  verdict: string;
  onDelete: () => void;
}

export function SimulationDetailHeader({
  simulation,
  verdict,
  onDelete,
}: SimulationDetailHeaderProps) {
  const Icon = TYPE_ICON[simulation.type] ?? CreditCard;
  const typeLabel = labelOr(simulation.type, TYPE_LABELS);
  const dbVerdict = (["APPROVED", "WARNING", "REJECTED"] as DbVerdict[]).includes(
    verdict as DbVerdict
  )
    ? (verdict as DbVerdict)
    : "WARNING";
  const verdictLabel = VERDICT_LABELS[dbVerdict];
  const verdictPill = VERDICT_PILL[dbVerdict];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="text-stone-600 dark:text-stone-300"
        >
          <Link href="/simulations" aria-label="Volver a simulaciones">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            TYPE_ICON_BG[simulation.type] ?? TYPE_ICON_BG.OTHER
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {typeLabel}
          </p>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-tight truncate">
            {simulation.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[10px] font-bold uppercase tracking-wider ${verdictPill}`}
          >
            {verdictLabel}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Eliminar simulación"
            className="text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
        <Calendar className="h-3.5 w-3.5" />
        <span>Creada el {formatDate(simulation.createdAt)}</span>
      </div>
    </section>
  );
}
