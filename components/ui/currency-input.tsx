"use client";

import { forwardRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

function formatCurrency(value: string): string {
  const numeric = value.replace(/[^0-9]/g, "");
  if (!numeric) return "";
  const num = Number(numeric);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function parseCurrency(value: string): number {
  const numeric = value.replace(/[^0-9]/g, "");
  return numeric ? Number(numeric) : 0;
}

export interface CurrencyInputProps {
  id?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ id, value = 0, onValueChange, className, placeholder, disabled, maxLength }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatCurrency(String(value)));
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatCurrency(String(value)));
      }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Only allow digits
      const numeric = raw.replace(/[^0-9]/g, "");
      const num = numeric ? Number(numeric) : 0;
      setDisplayValue(formatCurrency(numeric));
      onValueChange?.(num);
    };

    const handleFocus = () => {
      setIsFocused(true);
      setDisplayValue(String(parseCurrency(displayValue)));
    };

    const handleBlur = () => {
      setIsFocused(false);
      setDisplayValue(formatCurrency(String(value)));
    };

    return (
      <input
        id={id}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
