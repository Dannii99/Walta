"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { closeMonth } from "@/server/actions/snapshot-actions";
import { CalendarCheck, Loader2 } from "lucide-react";

interface CloseMonthButtonProps {
  budgetId: string;
}

export function CloseMonthButton({ budgetId }: CloseMonthButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    setLoading(true);
    try {
      await closeMonth(budgetId);
      router.refresh();
    } catch (err) {
      console.error("Failed to close month:", err);
      alert("No se pudo cerrar el mes. Es posible que ya exista un snapshot para este mes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClose} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <CalendarCheck className="h-4 w-4 mr-2" />
      )}
      Cerrar Mes Actual
    </Button>
  );
}
