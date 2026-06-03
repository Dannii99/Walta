"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface Option {
  id: Theme;
  label: string;
  description: string;
  icon: typeof Sun;
}

const OPTIONS: Option[] = [
  {
    id: "light",
    label: "Claro",
    description: "Interfaz brillante para entornos bien iluminados.",
    icon: Sun,
  },
  {
    id: "dark",
    label: "Oscuro",
    description: "Reduce el cansancio visual en ambientes con poca luz.",
    icon: Moon,
  },
  {
    id: "system",
    label: "Sistema",
    description: "Sigue la preferencia de tu sistema operativo.",
    icon: Monitor,
  },
];

const emptySubscribe = () => () => {};
const getHydrated = () => true;
const getServerSnapshot = () => false;

function useHydrated() {
  return useSyncExternalStore(emptySubscribe, getHydrated, getServerSnapshot);
}

export function ThemeSelector() {
  const hydrated = useHydrated();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = hydrated ? (theme as Theme) : undefined;
  const effective = hydrated ? resolvedTheme : undefined;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isActive = current === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={isActive}
              className={cn(
                "relative flex flex-col items-start text-left p-4 rounded-xl",
                "border transition-all duration-150 outline-none",
                "focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-stone-900",
                isActive
                  ? "border-stone-900 bg-stone-50 dark:border-stone-100 dark:bg-stone-800/60"
                  : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50 dark:border-stone-800 dark:bg-stone-900/50 dark:hover:border-stone-700 dark:hover:bg-stone-800/30"
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
                    isActive
                      ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                      : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.3} />
                </span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="h-5 w-5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center"
                    aria-hidden
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </motion.span>
                )}
              </div>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-50">
                {opt.label}
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5 leading-relaxed">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
      {hydrated && (
        <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
          Tema activo:{" "}
          <span className="font-semibold text-stone-700 dark:text-stone-200 capitalize">
            {effective === "dark" ? "oscuro" : "claro"}
          </span>
          {current === "system" && " (siguiendo al sistema)"}
        </p>
      )}
    </div>
  );
}
