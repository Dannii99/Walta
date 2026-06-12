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
  CheckCircle2,
  AlertTriangle,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TYPE_LABELS,
  VERDICT_LABELS,
  type DbVerdict,
  labelOr,
} from "@/lib/simulation-types";

const TYPE_ICON: Record<string, LucideIcon> = {
  VEHICLE: Car,
  PERSONAL: Wallet,
  HOUSING: Home,
  OTHER: CreditCard,
};

const TYPE_ICON_BG: Record<string, string> = {
  VEHICLE: "bg-[#617dd5]/15 text-[#617dd5]",
  PERSONAL: "bg-[#9333ea]/15 text-[#9333ea]",
  HOUSING: "bg-[#23ad1b]/15 text-[#23ad1b]",
  OTHER: "bg-[#737373]/15 text-[#737373]",
};

const VERDICT_ICON: Record<string, LucideIcon> = {
  APPROVED: CheckCircle2,
  WARNING: AlertTriangle,
  REJECTED: XCircle,
};

const VERDICT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  APPROVED: {
    bg: "bg-[#23ad1b]/10 dark:bg-[#23ad1b]/15",
    text: "text-[#23ad1b]",
    border: "border-[#23ad1b]/20 dark:border-[#23ad1b]/20",
  },
  WARNING: {
    bg: "bg-[#e7964d]/10 dark:bg-[#e7964d]/15",
    text: "text-[#e7964d]",
    border: "border-[#e7964d]/20 dark:border-[#e7964d]/20",
  },
  REJECTED: {
    bg: "bg-[#e54d4d]/10 dark:bg-[#e54d4d]/15",
    text: "text-[#e54d4d]",
    border: "border-[#e54d4d]/20 dark:border-[#e54d4d]/20",
  },
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
  const verdictColors = VERDICT_COLORS[dbVerdict];
  const VerdictIcon = VERDICT_ICON[dbVerdict];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="text-[#737373] dark:text-[#a1a1aa]"
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
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            {typeLabel}
          </p>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-tight truncate">
            {simulation.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${verdictColors.bg} ${verdictColors.text} ${verdictColors.border}`}
          >
            <VerdictIcon className="h-3 w-3" />
            {verdictLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Eliminar simulación"
            className="text-[#737373] hover:text-[#e54d4d] hover:bg-[#e54d4d]/10 dark:hover:bg-[#e54d4d]/10 dark:hover:text-[#e54d4d]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[#737373] dark:text-[#a1a1aa] font-medium">
        <Calendar className="h-3.5 w-3.5" />
        <span>Creada el {formatDate(simulation.createdAt)}</span>
      </div>
    </section>
  );
}
