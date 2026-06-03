"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, Mail, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

function deriveName(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name && name.trim().length > 0) return name;
  if (email && email.includes("@")) return email.split("@")[0];
  return "Usuario";
}

export function AccountSection() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
        <div className="h-20 w-full rounded-xl bg-stone-100 dark:bg-stone-800/60 animate-pulse" />
      </div>
    );
  }

  const userName = deriveName(session?.user?.name, session?.user?.email);
  const email = session?.user?.email ?? "—";
  const initials = getInitials(session?.user?.name, session?.user?.email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="flex items-center gap-3 p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900/60">
        <div className="h-12 w-12 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shrink-0 font-extrabold text-sm tracking-tight">
          {initials}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 text-stone-900 dark:text-stone-50">
            <UserIcon className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500 shrink-0" strokeWidth={2.2} />
            <p className="text-sm font-bold truncate">{userName}</p>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
            <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
            <p className="text-xs font-medium truncate">{email}</p>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-full sm:w-auto h-10 px-4 gap-1.5 border-stone-300 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800/60"
      >
        <LogOut className="h-4 w-4" strokeWidth={2.2} />
        Cerrar sesión
      </Button>
    </motion.div>
  );
}
