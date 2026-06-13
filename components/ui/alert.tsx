import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "warning" | "success" | "destructive";
  icon?: LucideIcon;
}

const VARIANT_CLASSES: Record<NonNullable<AlertProps["variant"]>, string> = {
  default: "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900",
  info: "border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20",
  warning: "border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20",
  success: "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20",
  destructive: "border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20",
};

const ICON_COLOR_CLASSES: Record<NonNullable<AlertProps["variant"]>, string> = {
  default: "text-stone-500",
  info: "text-blue-700 dark:text-blue-400",
  warning: "text-amber-700 dark:text-amber-400",
  success: "text-emerald-700 dark:text-emerald-400",
  destructive: "text-rose-700 dark:text-rose-400",
};

export function Alert({
  className,
  variant = "default",
  icon: Icon,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-2xl border p-4 flex items-start gap-3",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {Icon ? (
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", ICON_COLOR_CLASSES[variant])} />
      ) : null}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h5
      className={cn(
        "mb-1 font-semibold text-sm leading-tight tracking-tight",
        "text-stone-900 dark:text-stone-50",
        className
      )}
    >
      {children}
    </h5>
  );
}

export function AlertDescription({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "text-sm text-stone-600 dark:text-stone-400 leading-relaxed",
        className
      )}
    >
      {children}
    </div>
  );
}
