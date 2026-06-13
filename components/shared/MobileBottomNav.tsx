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
  { href: "/credits", label: "Créditos", icon: CreditCard },
  { href: "/reglas", label: "Reglas", icon: SlidersHorizontal },
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
        className="fixed bottom-0 left-4 right-4 -translate-y-[90px] z-40 md:hidden bg-gradient-to-br from-[#17181c] to-[#333438] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden"
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
                    "relative flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-colors",
                    isActive
                      ? "text-white"
                      : "text-[#a1a1aa]"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bottom-nav-indicator"
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-[#26be15]"
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
                "relative w-full flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-colors",
                isMoreActive
                  ? "text-white"
                  : "text-[#a1a1aa]"
              )}
              aria-label="Más opciones"
            >
              {isMoreActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-[#26be15]"
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
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: -78 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-linear-to-br from-[#17181c] to-[#333438] shadow-2xl"
            >
              <div className="flex justify-center pt-3 pb-1">
                <span className="h-1.5 w-12 rounded-full bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-5 py-2">
                <h3 className="text-base font-bold tracking-tight text-white">
                  Más opciones
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-[#a1a1aa]"
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
                            ? "bg-white/10 text-white"
                            : "text-[#a1a1aa] hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            isActive
                              ? "bg-[#26be15] text-white"
                              : "bg-white/10 text-[#a1a1aa]"
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
