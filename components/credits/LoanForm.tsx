"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createLoan, updateLoan } from "@/server/actions/loan-actions";
import { getLoanSummary } from "@/lib/simulation-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RateInput } from "@/components/simulations/RateInput";
import { LoanPreviewCard } from "./LoanPreviewCard";
import { FeesSection } from "./FeesSection";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Settings2,
  AlertCircle,
  Sparkles,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import type { FeeItem, PastPaymentSync } from "@/types";

function getMonthlyRate(annualRate: number, formula: string): number {
  return formula === "french_ea" || formula === "constant_capital_ea"
    ? Math.pow(1 + annualRate, 1 / 12) - 1
    : annualRate / 12;
}

function calculatePreview(
  principal: number,
  annualRate: number,
  termMonths: number,
  formula: string
): { monthlyPayment: number; totalInterest: number; totalCost: number } {
  if (principal <= 0 || termMonths <= 0 || annualRate < 0) {
    return { monthlyPayment: 0, totalInterest: 0, totalCost: 0 };
  }

  const monthlyRate = getMonthlyRate(annualRate, formula);

  // French (fixed payment)
  if (formula === "french_ea" || formula === "french_namv") {
    const summary = getLoanSummary(
      principal,
      annualRate,
      termMonths,
      formula === "french_ea" ? "french_ea" : "nominal_monthly"
    );
    return summary;
  }

  // German (constant capital, decreasing payment)
  const monthlyPrincipal = principal / termMonths;
  let balance = principal;
  let totalInterest = 0;

  for (let i = 0; i < termMonths; i++) {
    const interest = balance * monthlyRate;
    totalInterest += interest;
    balance -= monthlyPrincipal;
    if (balance < 0) balance = 0;
  }

  const firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
  return {
    monthlyPayment: Number(firstMonthPayment.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalCost: Number((principal + totalInterest).toFixed(2)),
  };
}

function mapTypeToSchema(type: string): string {
  const map: Record<string, string> = {
    personal: "PERSONAL",
    mortgage: "HOUSING",
    vehicle: "VEHICLE",
    student: "OTHER",
    credit_card: "OTHER",
    microcredit: "OTHER",
  };
  return map[type] || "OTHER";
}

function mapFormulaToSchema(formula: string): string {
  if (formula === "french_ea" || formula === "constant_capital_ea") return "french_ea";
  return "nominal_monthly";
}

const LOAN_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "mortgage", label: "Hipotecario" },
  { value: "vehicle", label: "Vehículo" },
  { value: "student", label: "Estudiantil" },
  { value: "credit_card", label: "Tarjeta de Crédito" },
  { value: "microcredit", label: "Microcrédito" },
];

interface LoanFormProps {
  mode: "new" | "ongoing" | "edit";
  defaultValues?: Record<string, unknown> | null;
  availableMoney?: number;
  loanId?: string;
}

export function LoanForm({ mode, defaultValues, availableMoney = 0, loanId }: LoanFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termMode, setTermMode] = useState<"years" | "months">("years");

  // Step 1: Basic info
  const [title, setTitle] = useState((defaultValues?.title as string) || "");
  const [type, setType] = useState(
    (defaultValues?.type as string) || "personal"
  );
  const [price, setPrice] = useState((defaultValues?.price as number) || 0);
  const initialDownPayment = (defaultValues?.downPayment as number) || 0;
  const [downPaymentEnabled, setDownPaymentEnabled] = useState(
    initialDownPayment > 0
  );
  const [downPayment, setDownPayment] = useState(initialDownPayment);

  // Step 2: Terms + preview
  const [termValue, setTermValue] = useState(
    defaultValues?.termMonths
      ? termMode === "years"
        ? Math.ceil((defaultValues.termMonths as number) / 12)
        : (defaultValues.termMonths as number)
      : 5
  );
  const [annualRate, setAnnualRate] = useState(
    (defaultValues?.annualRate as number) || 0.18
  );
  const [formula, setFormula] = useState(
    (defaultValues?.formula as string) || "french_ea"
  );
  const [startDate, setStartDate] = useState(() => {
    if (defaultValues?.startDate) {
      const d = new Date(defaultValues.startDate as string | Date);
      if (!Number.isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
      }
    }
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  // Step 2: Fees
  const [fees, setFees] = useState<FeeItem[]>(
    (defaultValues?.fees as FeeItem[]) || []
  );

  // Step 3: Advanced (ongoing only)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [exactMonthlyPayment, setExactMonthlyPayment] = useState(
    (defaultValues?.exactMonthlyPayment as number) || 0
  );
  const [exactTotalInterest, setExactTotalInterest] = useState(
    (defaultValues?.exactTotalInterest as number) || 0
  );
  const [initialExtraPayment, setInitialExtraPayment] = useState(
    (defaultValues?.initialExtraPayment as number) || 0
  );

  // Calculate past months between startDate and today for sync.
  // Declared before the derived `pastPaymentsSync` so its dependencies
  // resolve in source order (required by react-hooks/immutability).
  const pastMonths = useMemo(() => {
    if (!startDate) return [];
    const start = new Date(startDate);
    const today = new Date();
    const months: { month: number; year: number; label: string }[] = [];

    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth(), 1);

    while (current < end) {
      months.push({
        month: current.getMonth(),
        year: current.getFullYear(),
        label: current.toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }, [startDate]);

  // Source of truth for past-payments toggles, keyed by `${year}-${month}`.
  // - For new/ongoing: starts empty, the user toggles each month.
  // - For edit: starts pre-populated from real `LoanPayment` records.
  //   The derived `pastPaymentsSync` below only renders entries for months in
  //   the current `pastMonths` range, so changing startDate re-projects the
  //   toggles onto the new range automatically.
  const [paymentStatuses, setPaymentStatuses] = useState<
    Record<string, "PAID" | "PENDING" | "DEFAULTED">
  >(() => {
    const initial: Record<string, "PAID" | "PENDING" | "DEFAULTED"> = {};
    const initialSync =
      (defaultValues?.pastPaymentsSync as PastPaymentSync[]) || [];
    for (const p of initialSync) {
      initial[`${p.year}-${p.month}`] = p.status;
    }
    return initial;
  });

  // Derived: the pastPaymentsSync array for the current `pastMonths` range.
  // Months without an entry in `paymentStatuses` default to "PENDING".
  const pastPaymentsSync = useMemo<PastPaymentSync[]>(
    () =>
      pastMonths.map((m) => ({
        month: m.month,
        year: m.year,
        status: paymentStatuses[`${m.year}-${m.month}`] ?? "PENDING",
      })),
    [pastMonths, paymentStatuses]
  );

  const updatePaymentStatus = useCallback(
    (
      year: number,
      month: number,
      status: "PAID" | "PENDING" | "DEFAULTED"
    ) => {
      setPaymentStatuses((current) => ({
        ...current,
        [`${year}-${month}`]: status,
      }));
    },
    []
  );

  const termMonths = useMemo(
    () => (termMode === "years" ? termValue * 12 : termValue),
    [termMode, termValue]
  );

  const principal = useMemo(() => price - downPayment, [price, downPayment]);

  const loanSummary = useMemo(() => {
    if (principal <= 0 || termMonths <= 0 || annualRate < 0) return null;
    try {
      return calculatePreview(principal, annualRate, termMonths, formula);
    } catch {
      return null;
    }
  }, [principal, annualRate, termMonths, formula]);

  const monthlyPayment = useMemo(() => {
    if (mode === "ongoing" && exactMonthlyPayment > 0) return exactMonthlyPayment;
    return loanSummary?.monthlyPayment ?? 0;
  }, [mode, exactMonthlyPayment, loanSummary]);

  const totalInterest = useMemo(() => {
    if (mode === "ongoing" && exactTotalInterest > 0) return exactTotalInterest;
    return loanSummary?.totalInterest ?? 0;
  }, [mode, exactTotalInterest, loanSummary]);

  const totalCost = useMemo(() => {
    return principal + totalInterest;
  }, [principal, totalInterest]);

  // Derived: months elapsed since startDate (capped at termMonths for display).
  // Always visible in Tab 2 as a read-only informational card.
  const mesesTranscurridos = useMemo(() => pastMonths.length, [pastMonths]);

  // Derived: count of toggles marked as PAID in pastPaymentsSync.
  // This is what gets persisted to `Loan.paidInstallments` server-side.
  const paidCount = useMemo(
    () => pastPaymentsSync.filter((p) => p.status === "PAID").length,
    [pastPaymentsSync]
  );

  const validateStep1 = useCallback(() => {
    if (!title.trim()) return "Debes ingresar un nombre para el crédito.";
    if (price <= 0) return "El precio total debe ser mayor a cero.";
    if (downPayment < 0) return "La cuota inicial no puede ser negativa.";
    if (downPayment >= price) return "La cuota inicial no puede ser igual o mayor al precio.";
    return null;
  }, [title, price, downPayment]);

  const validateStep2 = useCallback(() => {
    if (termValue < 1) return "El plazo debe ser de al menos 1.";
    if (annualRate <= 0) return "La tasa de intereses debe ser mayor a cero.";
    if (!startDate) return "Debes seleccionar la fecha de inicio.";
    return null;
  }, [termValue, annualRate, startDate]);

  const handleNext = () => {
    if (step === 1) {
      const error = validateStep1();
      if (error) {
        toast.error(error);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const error = validateStep2();
      if (error) {
        toast.error(error);
        return;
      }
      if (mode === "ongoing" || (mode === "edit" && mesesTranscurridos > 0)) {
        setStep(3);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (mode === "edit" && loanId) {
        await updateLoan(loanId, {
          title,
          type: mapTypeToSchema(type),
          principal,
          downPayment,
          annualRate,
          termMonths,
          formula: mapFormulaToSchema(formula),
          startDate: new Date(startDate),
          monthlyPayment,
          totalInterest,
          totalCost,
          fees,
          pastPaymentsSync: pastPaymentsSync.length > 0 ? pastPaymentsSync : undefined,
        });
        toast.success("Crédito actualizado");
        router.push(`/credits/${loanId}`);
        router.refresh();
      } else {
        await createLoan({
          title,
          type: mapTypeToSchema(type),
          principal,
          downPayment,
          annualRate,
          termMonths,
          formula: mapFormulaToSchema(formula),
          startDate: new Date(startDate),
          monthlyPayment,
          totalInterest,
          totalCost,
          fees,
          initialExtraPayment: mode === "ongoing" && initialExtraPayment > 0 ? initialExtraPayment : undefined,
          pastPaymentsSync: pastPaymentsSync.length > 0 ? pastPaymentsSync : undefined,
        });
        toast.success(mode === "ongoing" ? "Crédito en curso agregado" : "Crédito creado");
        router.push("/credits");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el crédito");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = mode === "ongoing" || (mode === "edit" && mesesTranscurridos > 0) ? 3 : 2;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => {
          if (s > totalSteps) return null;
          const isActive = s === step;
          const isCompleted = s < step;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : s}
              </div>
              <div className="hidden sm:block">
                <p
                  className={`text-xs font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s === 1
                    ? "Información bísica"
                    : s === 2
                      ? "Condiciones"
                      : "En curso"}
                </p>
              </div>
              {s < totalSteps && (
                <div className="h-px flex-1 bg-border mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información bísica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nombre del crédito</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Apartamento en Cedritos"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de crédito</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOAN_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio total</Label>
              <CurrencyInput
                id="price"
                value={price}
                onValueChange={setPrice}
                placeholder="0"
              />
            </div>

            <div className="space-y-3 rounded-xl border border-dashed border-stone-200 dark:border-stone-700 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label
                    htmlFor="downPayment-switch"
                    className="text-sm font-medium cursor-pointer"
                  >
                    ¿Tienes cuota inicial?
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Activa para registrar un pago inicial al crédito.
                  </p>
                </div>
                <Switch
                  id="downPayment-switch"
                  checked={downPaymentEnabled}
                  onCheckedChange={(checked) => {
                    setDownPaymentEnabled(checked);
                    if (!checked) setDownPayment(0);
                  }}
                />
              </div>
              {downPaymentEnabled && (
                <div className="space-y-2 pt-1">
                  <Label htmlFor="downPayment">Cuota inicial</Label>
                  <CurrencyInput
                    id="downPayment"
                    value={downPayment}
                    onValueChange={setDownPayment}
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            {price > 0 && downPayment > 0 && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p>
                  Monto a financiar:{" "}
                  <span className="font-semibold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(principal)}
                  </span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Esto es lo que realmente vas a pedir prestado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Terms & Preview */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Condiciones del crédito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plazo</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min={1}
                        maxLength={3}
                        value={termValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (Number.isNaN(val) || val < 1) {
                            setTermValue(1);
                          } else {
                            setTermValue(val);
                          }
                        }}
                      />
                    </div>
                    <div className="flex rounded-md border border-input overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          if (termMode === "months") {
                            setTermMode("years");
                            setTermValue(Math.ceil(termValue / 12));
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium ${
                          termMode === "years"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Años
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (termMode === "years") {
                            setTermMode("months");
                            setTermValue(termValue * 12);
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium ${
                          termMode === "months"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        Meses
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {termMonths} meses en total
                  </p>
                </div>

                <div className="space-y-2">
                  <RateInput
                    value={annualRate}
                    onRateChange={setAnnualRate}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formula">Fórmula de amortización</Label>
                  <Select value={formula} onValueChange={setFormula}>
                    <SelectTrigger id="formula">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="h-3 w-3" />
                          Recomendado
                        </SelectLabel>
                        <SelectItem value="french_ea">
                          Cuota Fija (Francés EA)
                        </SelectItem>
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Otros métodos</SelectLabel>
                        <SelectItem value="french_namv">
                          Cuota Fija (Francés NAMV)
                        </SelectItem>
                        <SelectItem value="constant_capital_ea">
                          Capital Constante (Alemán EA)
                        </SelectItem>
                        <SelectItem value="constant_capital_namv">
                          Capital Constante (Alemán NAMV)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Read-only: meses transcurridos (always visible) */}
              <div
                className="flex items-start gap-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-3"
                data-testid="meses-transcurridos"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/40 shrink-0">
                  <Calendar
                    className="h-4 w-4 text-blue-700 dark:text-blue-400"
                    strokeWidth={2.2}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {mesesTranscurridos === 0
                      ? "Aún no hay meses por sincronizar."
                      : mesesTranscurridos === 1
                        ? "Ha transcurrido 1 mes desde la fecha de inicio."
                        : `Han transcurrido ${mesesTranscurridos} meses desde la fecha de inicio.`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mesesTranscurridos === 0
                      ? "Esta fecha determina las cuotas que puedes sincronizar en el siguiente paso (si eliges crédito en curso)."
                      : mesesTranscurridos >= termMonths
                        ? "Esto cubre todo el plazo del crédito."
                        : "Podrás sincronizar estas cuotas en el siguiente paso (si eliges crédito en curso)."}
                  </p>
                </div>
              </div>

              <FeesSection fees={fees} onChange={setFees} />
            </CardContent>
          </Card>

          <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
            <LoanPreviewCard
              principal={principal}
              monthlyPayment={monthlyPayment}
              totalInterest={totalInterest}
              totalCost={totalCost}
              availableMoney={availableMoney}
              fees={fees}
            />
          </div>
        </div>
      )}

      {/* Step 3: Ongoing Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crédito en curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Read-only: cuotas pagadas según tu extracto (derived from toggles) */}
            <div
              className="flex items-start gap-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-3"
              data-testid="cuotas-pagadas-readonly"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 shrink-0">
                <FileText
                  className="h-4 w-4 text-emerald-700 dark:text-emerald-400"
                  strokeWidth={2.2}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                  Cuotas pagadas según tu extracto:{" "}
                  <span className="tabular-nums font-semibold">
                    {paidCount}
                  </span>{" "}
                  de{" "}
                  <span className="tabular-nums font-semibold">
                    {mesesTranscurridos}
                  </span>{" "}
                  posibles
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Marca abajo cuáles cuotas están pagadas, pendientes o en mora.
                </p>
              </div>
            </div>

            {/* Past Payments Sync */}
            {pastMonths.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <Label className="text-sm font-medium">Sincronizar cuotas pasadas</Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecciona el estado de cada mes pasado entre la fecha de inicio y hoy.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto rounded-lg border border-border p-2">
                  {pastMonths.map((m) => {
                    const sync = pastPaymentsSync.find(
                      (p) => p.month === m.month && p.year === m.year
                    ) || { status: "PENDING" as const };
                    return (
                      <div
                        key={`${m.year}-${m.month}`}
                        className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                      >
                        <span className="text-sm font-medium capitalize">
                          {m.label}
                        </span>
                        <div className="flex gap-1">
                          {(["PAID", "PENDING", "DEFAULTED"] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => updatePaymentStatus(m.year, m.month, status)}
                              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                sync.status === status
                                  ? status === "PAID"
                                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                                    : status === "PENDING"
                                      ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                                      : "bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900"
                                  : "bg-background text-muted-foreground border border-border hover:bg-muted"
                              }`}
                            >
                              {status === "PAID" && "Pagada"}
                              {status === "PENDING" && "Pendiente"}
                              {status === "DEFAULTED" && "En mora"}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="initialExtraPayment">
                Abono a capital ya realizado (opcional)
              </Label>
              <CurrencyInput
                id="initialExtraPayment"
                value={initialExtraPayment}
                onValueChange={setInitialExtraPayment}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Si ya hiciste un abono extra a capital antes de registrar el crédito, ingrésalo aquí. Se reflejará en tu tabla de amortización.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings2 className="h-4 w-4" />
                {showAdvanced ? "Ocultar opciones avanzadas" : "Opciones avanzadas (datos exactos del banco)"}
              </button>
            </div>

            {showAdvanced && (
              <div className="rounded-lg border border-border p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exactMonthlyPayment">
                    Cuota mensual exacta (del banco)
                  </Label>
                  <CurrencyInput
                    id="exactMonthlyPayment"
                    value={exactMonthlyPayment}
                    onValueChange={setExactMonthlyPayment}
                    placeholder="Opcional"
                  />
                  <p className="text-xs text-muted-foreground">
                    Si la cuota calculada difiere de la real, ingresa el valor
                    exacto de tu extracto.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exactTotalInterest">
                    Intereses totales exactos pagados hasta ahora
                  </Label>
                  <CurrencyInput
                    id="exactTotalInterest"
                    value={exactTotalInterest}
                    onValueChange={setExactTotalInterest}
                    placeholder="Opcional"
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional: útil si quieres ajustar el saldo con exactitud.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1 || isSubmitting}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        {step === totalSteps ? (
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Guardando..." : mode === "edit" ? "Guardar cambios" : mode === "ongoing" ? "Agregar crédito" : "Crear crédito"}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={isSubmitting} className="w-full sm:w-auto">
            {step === 1 ? "Calcular" : "Continuar"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
