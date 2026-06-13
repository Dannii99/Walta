import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginHero } from "@/components/auth/LoginHero";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | Walta",
  description:
    "Accede a tu presupuesto, visualiza tu salud financiera y simula decisiones con Walta.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <LoginHero />

        <div className="flex flex-col">
          <div className="md:hidden flex items-center justify-center gap-3 px-6 pt-8 pb-2">
            <div className="h-11 w-11 shrink-0">
            <img
              src="/logo/Walta_App_dark.svg"
              alt="Walta"
              className="h-full w-full hidden dark:block"
            />
            <img
              src="/logo/Walta_App_light.svg"
              alt="Walta"
              className="h-full w-full block dark:hidden"
            />
            </div>
            <div className="min-w-0">
              <p className="text-base font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-none">
                Walta
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mt-1">
                Tu dinero, más claro.
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 md:p-10">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="md:hidden px-6 pb-6 text-center text-[10px] font-medium text-stone-500 dark:text-stone-400">
            © 2026 Walta. Hecho con cuidado para tu bolsillo.
          </p>
        </div>
      </div>
    </main>
  );
}

function LoginFormFallback() {
  return (
    <div
      role="status"
      aria-label="Cargando formulario"
      className="w-full max-w-md mx-auto space-y-4"
    >
      <div className="h-4 w-32 mx-auto md:mx-0 rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
      <div className="h-8 w-3/4 mx-auto md:mx-0 rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
      <div className="h-4 w-1/2 mx-auto md:mx-0 rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
      <div className="h-10 w-full rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
      <div className="h-11 w-full rounded-md bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
    </div>
  );
}
