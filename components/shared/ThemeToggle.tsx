"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  collapsible?: boolean;
}

const emptySubscribe = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

function useHydrated() {
  return useSyncExternalStore(emptySubscribe, getHydrated, getServerSnapshot);
}

export function ThemeToggle({
  className,
  showLabel = true,
  collapsible = false,
}: ThemeToggleProps) {
  const hydrated = useHydrated();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = hydrated && resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");
  const ariaLabel = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
  const labelText = hydrated && isDark ? "Tema oscuro" : "Tema claro";

  if (collapsible) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={cn(
          "group/toggle flex items-center h-10 rounded-lg px-[10px] w-full",
          "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
          "dark:text-stone-300 dark:hover:bg-stone-800/60 dark:hover:text-stone-50",
          "transition-colors duration-150 outline-none",
          "focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-stone-900",
          className
        )}
      >
        <span
          className={cn(
            "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
            "bg-stone-100 text-stone-700",
            "dark:bg-stone-800 dark:text-stone-200",
            "transition-colors"
          )}
        >
          {hydrated && isDark ? (
            <Moon className="h-4 w-4" strokeWidth={2.3} />
          ) : (
            <Sun className="h-4 w-4" strokeWidth={2.3} />
          )}
        </span>
        {showLabel && (
          <span className="ml-3 text-sm font-semibold whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {labelText}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "group/toggle flex items-center gap-2.5 rounded-lg px-2.5 py-2",
        "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-stone-900",
        className
      )}
    >
      <span
        className={cn(
          "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
          "bg-stone-100 text-stone-700",
          "dark:bg-stone-800 dark:text-stone-200",
          "transition-colors"
        )}
      >
        {hydrated && isDark ? (
          <Moon className="h-3.5 w-3.5" strokeWidth={2.3} />
        ) : (
          <Sun className="h-3.5 w-3.5" strokeWidth={2.3} />
        )}
      </span>
      {showLabel && (
        <span className="text-sm font-semibold whitespace-nowrap">
          {labelText}
        </span>
      )}
    </button>
  );
}
