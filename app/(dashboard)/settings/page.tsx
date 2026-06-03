import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | Walta",
  description: "Configura tu experiencia en Walta.",
};

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Personaliza tu experiencia en Walta.
        </p>
      </div>
    </div>
  );
}
