"use client";

import {
  Calculator,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { TIMELINE_EVENT_LABELS, type TimelineEventType } from "@/lib/timeline-types";

export interface EventVisualConfig {
  icon: LucideIcon;
  dotClass: string;
  ringClass: string;
  iconBgClass: string;
  iconFgClass: string;
  label: string;
}

export const EVENT_VISUAL: Record<TimelineEventType, EventVisualConfig> = {
  SIMULATION_CREATED: {
    icon: Calculator,
    dotClass: "bg-blue-500",
    ringClass: "ring-blue-500/30",
    iconBgClass: "bg-blue-100 dark:bg-blue-950/40",
    iconFgClass: "text-blue-700 dark:text-blue-400",
    label: TIMELINE_EVENT_LABELS.SIMULATION_CREATED,
  },
  LOAN_CREATED: {
    icon: CreditCard,
    dotClass: "bg-violet-500",
    ringClass: "ring-violet-500/30",
    iconBgClass: "bg-violet-100 dark:bg-violet-950/40",
    iconFgClass: "text-violet-700 dark:text-violet-400",
    label: TIMELINE_EVENT_LABELS.LOAN_CREATED,
  },
  LOAN_PAYMENT: {
    icon: CircleDollarSign,
    dotClass: "bg-emerald-500",
    ringClass: "ring-emerald-500/30",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-950/40",
    iconFgClass: "text-emerald-700 dark:text-emerald-400",
    label: TIMELINE_EVENT_LABELS.LOAN_PAYMENT,
  },
  LOAN_EXTRA_PAYMENT: {
    icon: PiggyBank,
    dotClass: "bg-amber-500",
    ringClass: "ring-amber-500/30",
    iconBgClass: "bg-amber-100 dark:bg-amber-950/40",
    iconFgClass: "text-amber-700 dark:text-amber-400",
    label: TIMELINE_EVENT_LABELS.LOAN_EXTRA_PAYMENT,
  },
  LOAN_PAID_OFF: {
    icon: CheckCircle2,
    dotClass: "bg-blue-500",
    ringClass: "ring-blue-500/30",
    iconBgClass: "bg-blue-100 dark:bg-blue-950/40",
    iconFgClass: "text-blue-700 dark:text-blue-400",
    label: TIMELINE_EVENT_LABELS.LOAN_PAID_OFF,
  },
};
