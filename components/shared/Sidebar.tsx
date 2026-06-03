"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  Calculator,
  SlidersHorizontal,
  CreditCard,
  History,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Gastos", icon: Wallet },
  { href: "/simulations", label: "Simulaciones", icon: Calculator },
  { href: "/reglas", label: "Reglas", icon: SlidersHorizontal },
  { href: "/credits", label: "Créditos", icon: CreditCard },
  { href: "/history", label: "Historial", icon: History },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden md:flex h-screen flex-col group",
        "w-[68px] hover:w-64 transition-[width] duration-300 ease-out",
        "border-r border-stone-200/80 bg-white",
        "dark:border-stone-800 dark:bg-stone-950"
      )}
      aria-label="Navegación lateral"
    >
      <Link
        href="/dashboard"
        className="h-16 flex items-center px-[18px] border-b border-stone-200/60 dark:border-stone-800 shrink-0"
      >
        <div className="h-9 w-9 rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center shrink-0 transition-transform hover:scale-105">
          <Wallet className="h-4 w-4 text-white dark:text-stone-900" strokeWidth={2.3} />
        </div>
        <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
          <p className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
            Walta
          </p>
          <p className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mt-1">
            Tu dinero, más claro.
          </p>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto scrollbar-none">
        <p className="px-3 mb-2 text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Navegación
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group/nav relative flex items-center h-10 rounded-lg px-[10px]",
                "text-sm font-semibold transition-colors",
                isActive
                  ? "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                  : "text-stone-700 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800/60 dark:hover:text-stone-50"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-bar"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-stone-900 dark:bg-stone-100"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center shrink-0 transition-colors",
                  isActive
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-500 group-hover/nav:text-stone-900 dark:text-stone-400 dark:group-hover/nav:text-stone-50"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2.3} />
              </div>
              <span className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-stone-200/60 dark:border-stone-800 space-y-1 shrink-0">
        <ThemeToggle showLabel collapsible />
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full justify-start gap-0 h-10 px-[10px] text-stone-500 hover:text-rose-600 hover:bg-rose-50/60 dark:text-stone-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40"
        >
          <div className="h-7 w-7 rounded-md flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4" strokeWidth={2.3} />
          </div>
          <span className="ml-3 uppercase tracking-wider whitespace-nowrap overflow-hidden text-sm font-semibold">
            Cerrar sesión
          </span>
        </Button>
      </div>
    </aside>
  );
}
