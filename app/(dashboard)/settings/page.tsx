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
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <header className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] flex items-center gap-1.5">
            <Palette className="h-3 w-3" strokeWidth={2.4} />
            Configuración
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#17181c] dark:text-white leading-[1.1]">
            Personaliza tu experiencia
          </h1>
          <p className="text-sm md:text-[15px] text-[#737373] dark:text-[#a1a1aa] font-medium max-w-2xl leading-relaxed">
            Ajusta el tema visual de la app y revisa la información de tu cuenta.
          </p>
        </header>

        <section className="bg-white dark:bg-[#17181c] rounded-2xl p-5 md:p-6 space-y-5">
          <header className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#737373] dark:text-[#a1a1aa] flex items-center justify-center shrink-0">
              <Palette className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white">
                Apariencia
              </h2>
              <p className="text-xs md:text-sm text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
                Elige cómo se ve Walta. El modo Sistema sigue la preferencia de
                tu sistema operativo.
              </p>
            </div>
          </header>
          <ThemeSelector />
        </section>

        <section className="bg-white dark:bg-[#17181c] rounded-2xl p-5 md:p-6 space-y-5">
          <header className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5 text-[#737373] dark:text-[#a1a1aa] flex items-center justify-center shrink-0">
              <UserIcon className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base md:text-lg font-bold tracking-tight text-[#17181c] dark:text-white">
                Cuenta
              </h2>
              <p className="text-xs md:text-sm text-[#737373] dark:text-[#a1a1aa] font-medium mt-0.5 leading-relaxed">
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
