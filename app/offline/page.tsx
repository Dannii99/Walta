import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export const metadata = {
  title: "Sin conexión | Walta",
  description: "Parece que no tienes conexin a internet.",
};

export default function OfflinePage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <WifiOff className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <CardTitle>Sin conexin</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            No tienes conexin a internet en este momento. Algunas funciones
            pueden no estar disponibles.
          </p>
          <p className="text-sm text-muted-foreground">
            Los datos que ya habas cargado siguen disponibles gracias al
            almacenamiento en cach del navegador.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
