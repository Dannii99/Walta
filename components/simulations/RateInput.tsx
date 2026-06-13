"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle } from "lucide-react";

export type RateMode = "decimal" | "percentage_ea" | "percentage_namv";

interface RateInputProps {
  value?: number; // annual rate (decimal), e.g. 0.1718
  onRateChange?: (annualRate: number) => void;
  className?: string;
}

// Convert annual rate (decimal) → display string for a given mode
function annualToDisplay(annualRate: number, mode: RateMode): string {
  if (annualRate <= 0) return "";
  switch (mode) {
    case "decimal": {
      const monthly = annualRate / 12; // simplified; for EA this is approximate but for decimal mode we just show annual/12
      return monthly.toFixed(6);
    }
    case "percentage_ea": {
      return (annualRate * 100).toFixed(2);
    }
    case "percentage_namv": {
      return (annualRate * 100).toFixed(2);
    }
    default:
      return "";
  }
}

// Convert raw user string + mode → annual rate (decimal)
function displayToAnnual(rawValue: string, mode: RateMode): number {
  const val = parseFloat(rawValue.replace(/,/g, "."));
  if (Number.isNaN(val) || val < 0) return 0;
  switch (mode) {
    case "decimal":
      return val * 12; // user entered monthly decimal; convert to annual
    case "percentage_ea":
      return val / 100; // user entered % EA
    case "percentage_namv":
      return val / 100; // user entered % NAMV
    default:
      return 0;
  }
}

const modeLabels: Record<RateMode, string> = {
  decimal: "Decimal mensual",
  percentage_ea: "% EA",
  percentage_namv: "% NAMV",
};

const modeHelp: Record<RateMode, string> = {
  decimal: "Tasa mensual en decimal (ej: 0.0138). Se multiplica por 12 para obtener la anual.",
  percentage_ea:
    "Tasa Efectivo Anual (%). Aparece en algunos extractos bancarios.",
  percentage_namv:
    "Tasa Nominal Anual Mes Vencido (%). Es la que aparece en la mayoría de extractos bancarios colombianos.",
};

export function RateInput({ value = 0, onRateChange, className }: RateInputProps) {
  const [mode, setMode] = useState<RateMode>("percentage_ea");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState("");

  const handleModeChange = (newMode: RateMode) => {
    setMode(newMode);
    // Reformat current value into new mode
    const display = annualToDisplay(value, newMode);
    setEditingValue(display);
    // Also notify parent with same annual rate (mode change shouldn't change the rate itself)
    onRateChange?.(value);
  };

  const handleFocus = () => {
    setIsEditing(true);
    // Show raw editable value (strip trailing zeros for easier editing)
    const display = annualToDisplay(value, mode);
    setEditingValue(display);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const annual = displayToAnnual(editingValue, mode);
    setEditingValue(annualToDisplay(annual, mode));
    onRateChange?.(annual);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits, one comma or dot, and up to 4 decimals
    // Simple approach: just accept the raw value while editing
    setEditingValue(raw);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Label htmlFor="rate-input">Tasa de interés (anual)</Label>
        <div className="relative">
          <HelpCircle
            className="h-4 w-4 text-muted-foreground cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 text-xs bg-popover text-popover-foreground rounded-md shadow-lg border z-50">
              <p className="font-semibold mb-1">{modeLabels[mode]}</p>
              <p>{modeHelp[mode]}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          id="rate-input"
          type="text"
          inputMode="decimal"
          value={isEditing ? editingValue : annualToDisplay(value, mode)}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1"
        />
        <Select value={mode} onValueChange={(v) => handleModeChange(v as RateMode)}>
          <SelectTrigger className="w-[160px] shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentage_ea">{modeLabels.percentage_ea}</SelectItem>
            <SelectItem value="percentage_namv">{modeLabels.percentage_namv}</SelectItem>
            <SelectItem value="decimal">{modeLabels.decimal}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
