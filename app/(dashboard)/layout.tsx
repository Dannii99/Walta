"use client";

import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { Sidebar } from "@/components/shared/Sidebar";
import { Wallet } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <Sidebar />

        <main className="md:pl-[68px] pb-20 md:pb-0 min-w-0">
          <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-stone-200/80 dark:border-stone-800 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
              <Wallet className="h-4 w-4" strokeWidth={2.3} />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Walta
            </span>
          </div>

          {children}
        </main>

        <MobileBottomNav />
      </div>
    </DashboardProvider>
  );
}
