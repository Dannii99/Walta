"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { formatCOP } from "@/lib/currency";
import { loanTypeLabel } from "@/lib/credit-types";
import { EVENT_VISUAL } from "@/components/history/EventIcon";
import type { TimelineEvent as TimelineEventType } from "@/types";

interface TimelineEventProps {
  event: TimelineEventType;
  isLast: boolean;
}

const VERDICT_BADGE: Record<
  "APPROVED" | "WARNING" | "REJECTED",
  { label: string; className: string }
> = {
  APPROVED: {
    label: "Aprobado",
    className:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
  },
  WARNING: {
    label: "Ajustado",
    className:
      "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900",
  },
  REJECTED: {
    label: "Riesgoso",
    className:
      "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-900",
  },
};

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(d: Date): string {
  return dateFormatter.format(d).replace(/^(\d+)\s+de\s+(\w+)\s+de\s+/, "$1 $2 ");
}

function formatShortDate(d: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

interface RenderedBody {
  description: React.ReactNode;
  href: string;
  cta: string;
  Icon: LucideIcon;
}

function renderBody(event: TimelineEventType): RenderedBody {
  const visual = EVENT_VISUAL[event.type];

  switch (event.type) {
    case "SIMULATION_CREATED": {
      const verdict = VERDICT_BADGE[event.verdict];
      return {
        description: (
          <div className="space-y-1.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Simulación de{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50">
                {event.title}
              </span>{" "}
              ({loanTypeLabel(event.simulationType.toLowerCase())}).
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
              <span>
                Cuota:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {formatCOP(event.monthlyPayment)}
                </span>
              </span>
              <span>
                Plazo:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {event.term} meses
                </span>
              </span>
              <span className={verdict.className}>
                <span className="px-1.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider">
                  {verdict.label}
                </span>
              </span>
            </div>
          </div>
        ),
        href: `/simulations/${event.simulationId}`,
        cta: "Ver simulación",
        Icon: visual.icon,
      };
    }
    case "LOAN_CREATED": {
      return {
        description: (
          <div className="space-y-1.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Crédito{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50">
                {event.title}
              </span>{" "}
              ({loanTypeLabel(event.loanType.toLowerCase())}).
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
              <span>
                Capital:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {formatCOP(event.principal)}
                </span>
              </span>
              <span>
                Cuota:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {formatCOP(event.monthlyPayment)}
                </span>
              </span>
              <span>
                Plazo:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {event.termMonths} meses
                </span>
              </span>
              {event.simulationId && (
                <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <span>Desde simulación</span>
                </span>
              )}
            </div>
          </div>
        ),
        href: `/credits/${event.loanId}`,
        cta: "Ver crédito",
        Icon: visual.icon,
      };
    }
    case "LOAN_PAYMENT": {
      return {
        description: (
          <div className="space-y-1.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Cuota{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50 tabular-nums">
                {event.installmentNumber}
              </span>{" "}
              de {event.totalInstallments} pagada en{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50">
                {event.loanTitle}
              </span>
              .
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
              <span>
                Cuota:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {formatCOP(event.amount)}
                </span>
              </span>
              <span>
                Capital:{" "}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatCOP(event.principalPaid)}
                </span>
              </span>
              <span>
                Interés:{" "}
                <span className="font-semibold text-rose-700 dark:text-rose-400 tabular-nums">
                  {formatCOP(event.interestPaid)}
                </span>
              </span>
            </div>
          </div>
        ),
        href: `/credits/${event.loanId}`,
        cta: "Ver crédito",
        Icon: visual.icon,
      };
    }
    case "LOAN_EXTRA_PAYMENT": {
      return {
        description: (
          <div className="space-y-1.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Abono a capital de{" "}
              <span className="font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                {formatCOP(event.amount)}
              </span>{" "}
              en{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50">
                {event.loanTitle}
              </span>
              {event.note ? <span className="text-stone-500 dark:text-stone-400">. {event.note}</span> : "."}
            </p>
          </div>
        ),
        href: `/credits/${event.loanId}`,
        cta: "Ver crédito",
        Icon: visual.icon,
      };
    }
    case "LOAN_PAID_OFF": {
      return {
        description: (
          <div className="space-y-1.5">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Crédito{" "}
              <span className="font-semibold text-stone-900 dark:text-stone-50">
                {event.loanTitle}
              </span>{" "}
              pagado en su totalidad (
              <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                {event.termMonths} meses
              </span>
              ).
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
              <span>
                Intereses totales:{" "}
                <span className="font-semibold text-stone-700 dark:text-stone-300 tabular-nums">
                  {formatCOP(event.totalInterest)}
                </span>
              </span>
            </div>
          </div>
        ),
        href: `/credits/${event.loanId}`,
        cta: "Ver crédito",
        Icon: visual.icon,
      };
    }
  }
}

export function TimelineEvent({ event, isLast }: TimelineEventProps) {
  const visual = EVENT_VISUAL[event.type];
  const body = renderBody(event);
  const Icon = body.Icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative flex gap-3 md:gap-4 pl-1"
    >
      <div className="relative flex flex-col items-center pt-1.5 shrink-0">
        <div
          className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center ${visual.iconBgClass} ${visual.iconFgClass} ring-1 ${visual.ringClass}`}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
        </div>
        {!isLast && (
          <div className="flex-1 w-px bg-stone-200 dark:bg-stone-800 mt-2" />
        )}
      </div>

      <div className="flex-1 pb-5">
        <Link
          href={body.href}
          className="group block rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 md:p-5 transition-colors hover:border-stone-300 dark:hover:border-stone-700"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {visual.label}
            </span>
            <time
              dateTime={event.occurredAt.toISOString()}
              className="text-[10px] font-medium text-stone-400 dark:text-stone-500 tabular-nums"
            >
              {formatShortDate(event.occurredAt)}
            </time>
          </div>

          {body.description}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <time
              dateTime={event.occurredAt.toISOString()}
              className="text-xs text-stone-500 dark:text-stone-400"
            >
              {formatDate(event.occurredAt)}
            </time>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">
              {body.cta}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </div>
    </motion.li>
  );
}
