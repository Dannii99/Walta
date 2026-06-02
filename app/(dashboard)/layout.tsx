"use client";

import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { Sidebar } from "@/components/shared/Sidebar";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#FAFAF7]">
        <Sidebar />

        <main className="md:pl-[68px] pb-20 md:pb-0 min-w-0">
          <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-900 text-white">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-stone-900">
              Presupuesto Claro
            </span>
          </div>

          {children}
        </main>

        <MobileBottomNav />
      </div>
    </DashboardProvider>
  );
}
