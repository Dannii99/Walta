"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { createCategory, updateCategory } from "@/server/actions/category-actions";
import { getCategoryIconComponent } from "@/lib/category-icons";
import { IconPicker } from "./IconPicker";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Category, CategoryType } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  type: z.enum(["NEEDS", "WANTS", "SAVINGS", "DEBT"]),
  description: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TYPE_LABELS: Record<string, string> = {
  NEEDS: "Necesidades",
  WANTS: "Deseos",
  SAVINGS: "Ahorros",
  DEBT: "Deudas",
};

const PLACEHOLDERS: Record<string, Record<string, string>> = {
  NEEDS: {
    Home: "Hogar",
    Building: "Vivienda",
    Building2: "Apartamento",
    Key: "Alquiler",
    Wrench: "Mantenimiento",
    Lamp: "Electricidad",
    Sofa: "Muebles",
    UtensilsCrossed: "Alimentación",
    Coffee: "Café",
    ShoppingCart: "Mercado",
    Pizza: "Comida rápida",
    Wine: "Bebidas",
    Car: "Transporte",
    Bike: "Bicicleta",
    Bus: "Bus",
    Train: "Tren",
    Fuel: "Gasolina",
    HeartPulse: "Salud",
    Activity: "Ejercicio",
    Stethoscope: "Médico",
    Pill: "Medicinas",
    Heart: "Bienestar",
    Wifi: "Internet",
    CreditCard: "Tarjeta crédito",
    Wallet: "Billetera",
    Phone: "Teléfono",
    Mail: "Correo",
    Receipt: "Facturas",
    Banknote: "Efectivo",
  },
  WANTS: {
    Utensils: "Restaurantes",
    Coffee: "Café",
    Pizza: "Pizza",
    Wine: "Vinos",
    ShoppingBag: "Compras",
    ShoppingCart: "Carrito",
    Gift: "Regalos",
    Tag: "Ofertas",
    Package: "Paquetes",
    Film: "Cine",
    Gamepad2: "Videojuegos",
    Music: "Música",
    BookOpen: "Libros",
    Camera: "Fotografía",
    Palette: "Arte",
    Ticket: "Eventos",
    Plane: "Viajes",
    Ship: "Crucero",
    Car: "Auto",
    Star: "Favoritos",
    Award: "Premios",
  },
  SAVINGS: {
    PiggyBank: "Ahorro",
    TrendingUp: "Inversiones",
    Landmark: "Banco",
    Coins: "Monedas",
    Banknote: "Efectivo",
    Wallet: "Cartera",
    Building: "Propiedades",
    Award: "Metas",
    Star: "Objetivos",
    GraduationCap: "Educación",
    BookOpen: "Estudios",
    Certificate: "Certificaciones",
  },
  DEBT: {
    CreditCard: "Tarjeta crédito",
    Wallet: "Préstamo",
    Landmark: "Banco",
    Receipt: "Deuda",
    Coins: "Intereses",
    Banknote: "Efectivo",
    TrendingUp: "Interés",
    PiggyBank: "Deuda",
    Building: "Hipoteca",
    Car: "Auto",
  },
};

function getPlaceholder(icon: string | null, type: string): string {
  if (!icon) return "Nombre de la categoría";
  return PLACEHOLDERS[type]?.[icon] ?? "Nombre de la categoría";
}

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetId: string;
  category?: Category | null;
  onSaved: () => void;
}

export function AddCategoryModal({ open, onOpenChange, budgetId, category, onSaved }: AddCategoryModalProps) {
  const isMobile = useMediaQuery("(max-width: 767px)") ?? false;
  const isEdit = !!category;

  const [step, setStep] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(category?.icon ?? null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      type: (category?.type as CategoryType) ?? "NEEDS",
      description: category?.description ?? "",
    },
  });

  const watchType = watch("type");

  useEffect(() => {
    if (open) {
      setStep(selectedIcon ? 1 : 0);
      reset({
        name: category?.name ?? "",
        type: (category?.type as CategoryType) ?? "NEEDS",
        description: category?.description ?? "",
      });
      setSelectedIcon(category?.icon ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, category, reset]);

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    if (!category?.name) {
      const hint = getPlaceholder(iconName, watchType);
      if (hint !== "Nombre de la categoría") {
        setValue("name", hint, { shouldDirty: false });
      }
    }
    setStep(1);
  };

  const handleSave = async (data: FormValues) => {
    try {
      const payload = {
        name: data.name,
        type: data.type as CategoryType,
        icon: selectedIcon ?? undefined,
        description: data.description || null,
      };
      if (isEdit && category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(budgetId, payload);
      }
      onSaved();
      onOpenChange(false);
    } catch {
      // handled by parent
    }
  };

  const IconComponent = selectedIcon ? getCategoryIconComponent(selectedIcon) : null;

  const formContent = (
    <div className="space-y-5">
      {step === 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Selecciona un icono</h3>
          </div>
          <IconPicker
            selectedIcon={selectedIcon}
            onSelect={handleIconSelect}
            onClose={() => onOpenChange(false)}
            isMobile={isMobile}
          />
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 pb-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="h-8 w-8 rounded-lg bg-muted dark:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Volver a seleccionar icono"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            </button>
            <div className="flex items-center gap-2">
              {IconComponent && (
                <div className="h-8 w-8 rounded-lg bg-[var(--color-wants)]/10 flex items-center justify-center">
                  <IconComponent className="h-4 w-4 text-[var(--color-wants)]" strokeWidth={2.2} />
                </div>
              )}
              <h3 className="text-sm font-bold text-foreground">
                {isEdit ? "Editar categoría" : "Nueva categoría"}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-semibold text-foreground">
                Nombre
              </Label>
              <Input
                id="cat-name"
                {...register("name")}
                placeholder={getPlaceholder(selectedIcon, watchType)}
                className="h-10 border-border dark:border-white/10 bg-background dark:bg-white/5 text-foreground placeholder:text-muted-foreground/50"
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-type" className="text-xs font-semibold text-foreground">
                Tipo
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="cat-type" className="h-10 border-border dark:border-white/10 bg-background dark:bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["NEEDS", "WANTS", "SAVINGS", "DEBT"] as const).map((t) => (
                        <SelectItem key={t} value={t}>
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: `var(--color-${t.toLowerCase()})` }}
                            />
                            {TYPE_LABELS[t]}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs font-semibold text-foreground">
                Descripción{" "}
                <span className="text-muted-foreground font-normal">(opcional)</span>
              </Label>
              <Input
                id="cat-desc"
                {...register("description")}
                placeholder="Ej. Gastos mensuales del hogar"
                maxLength={200}
                className="h-10 border-border dark:border-white/10 bg-background dark:bg-white/5 text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--color-wants)] text-white hover:bg-[var(--color-wants)]/90"
            >
              <Save className="h-4 w-4 mr-1.5" strokeWidth={2.2} />
              {isEdit ? "Guardar cambios" : "Crear categoría"}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl bg-background dark:bg-[#17181c] shadow-2xl max-h-[92dvh] min-h-[40dvh] flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <span className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-3">
                <form onSubmit={handleSubmit(handleSave)}>{formContent}</form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold tracking-tight text-foreground">
            {step === 0 ? "Elige un icono" : isEdit ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)}>{formContent}</form>
      </DialogContent>
    </Dialog>
  );
}
