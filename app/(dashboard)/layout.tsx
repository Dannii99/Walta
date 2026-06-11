"use client";

import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { Sidebar } from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-dvh md:min-h-screen bg-[#e8e8e8] dark:bg-[#0c0d10]">
        <Sidebar />
        <main className="md:pl-[76px] pb-20 md:pb-0 min-w-0">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </DashboardProvider>
  );
}
