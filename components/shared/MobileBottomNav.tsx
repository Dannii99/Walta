"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Calculator,
  SlidersHorizontal,
  CreditCard,
  History,
  Settings,
  MoreHorizontal,
  X,
} from "lucide-react";

const primaryTabs = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/expenses", label: "Gastos", icon: Wallet },
  { href: "/simulations", label: "Simular", icon: Calculator },
];

const moreItems = [
  { href: "/reglas", label: "Reglas", icon: SlidersHorizontal },
  { href: "/credits", label: "Créditos", icon: CreditCard },
  { href: "/history", label: "Historial", icon: History },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = moreItems.some((i) => pathname === i.href);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/85 dark:bg-stone-950/85 backdrop-blur-xl border-t border-[#E8E5E0]/60 dark:border-stone-800 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]"
        aria-label="Navegación principal"
      >
        <ul className="grid grid-cols-4">
          {primaryTabs.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-indicator"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      isActive && "scale-110"
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => setMoreOpen(true)}
              className={cn(
                "relative w-full flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                isMoreActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
              )}
              aria-label="Más opciones"
            >
              {isMoreActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <MoreHorizontal
                className={cn("h-5 w-5", isMoreActive && "scale-110")}
                strokeWidth={isMoreActive ? 2.5 : 2}
              />
              <span>Más</span>
            </button>
          </li>
        </ul>
      </nav>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-white dark:bg-stone-950 border-t border-[#E8E5E0]/60 dark:border-stone-800 shadow-2xl pb-[env(safe-area-inset-bottom)]"
            >
              <div className="flex justify-center pt-3 pb-1">
                <span className="h-1.5 w-12 rounded-full bg-stone-300/70 dark:bg-stone-700" />
              </div>
              <div className="flex items-center justify-between px-5 py-2">
                <h3 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-50">
                  Más opciones
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="px-3 pb-6 space-y-1">
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700 dark:from-blue-950/50 dark:via-indigo-950/50 dark:to-purple-950/50 dark:text-indigo-300"
                            : "text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800/60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            isActive
                              ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-md"
                              : "bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
