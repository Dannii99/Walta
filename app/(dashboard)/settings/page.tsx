import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { AccountSection } from "@/components/settings/AccountSection";
import { Palette, User as UserIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Walta",
  description: "Configura tu experiencia en Walta.",
};

export default function SettingsPage() {
  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Palette className="h-3 w-3" strokeWidth={2.4} />
            Configuración
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
            Personaliza tu experiencia
          </h1>
          <p className="text-sm md:text-[15px] text-stone-600 dark:text-stone-400 font-medium max-w-2xl leading-relaxed">
            Ajusta el tema visual de la app y revisa la información de tu cuenta.
          </p>
        </header>

        <section className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
          <header className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0">
              <Palette className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Apariencia
              </h2>
              <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5 leading-relaxed">
                Elige cómo se ve Walta. El modo Sistema sigue la preferencia de
                tu sistema operativo.
              </p>
            </div>
          </header>
          <ThemeSelector />
        </section>

        <section className="bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 md:p-6 space-y-5">
          <header className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0">
              <UserIcon className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base md:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
                Cuenta
              </h2>
              <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-medium mt-0.5 leading-relaxed">
                Tu información de sesión y opciones para cerrar la cuenta activa.
              </p>
            </div>
          </header>
          <AccountSection />
        </section>
      </div>
    </div>
  );
}
