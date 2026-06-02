"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import {
  LayoutDashboard,
  Wallet,
  Calculator,
  CreditCard,
  History,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Gastos", icon: Wallet },
  { href: "/simulations", label: "Simulaciones", icon: Calculator },
  { href: "/credits", label: "Créditos", icon: CreditCard },
  { href: "/history", label: "Historial", icon: History },
  { href: "/settings", label: "Configuración", icon: Settings },
];

function NavLink({
  href,
  label,
  Icon,
  isActive,
}: {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-indigo-700"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:translate-x-0.5"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active-bar"
          className="absolute -left-4 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 shrink-0",
          isActive
            ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/30"
            : "bg-muted/60 text-muted-foreground group-hover:bg-accent-foreground/10 group-hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.3} />
      </div>
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50/50 via-background to-blue-50/30">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl sticky top-0 h-screen">
          <div className="px-5 pt-6 pb-5 border-b border-border/40">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-extrabold tracking-tight bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Presupuesto
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  Claro
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Navegación
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  Icon={item.icon}
                  isActive={isActive}
                />
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-border/40">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50/60"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {/* Mobile top bar (compact) */}
          <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-border/60 bg-background/80 backdrop-blur-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white shadow-md">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Presupuesto Claro
            </span>
          </div>

          {children}
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />
      </div>
    </DashboardProvider>
  );
}
