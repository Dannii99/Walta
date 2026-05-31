import {
  Shield,
  ShieldCheck,
  Heart,
  FileCheck,
  Search,
  BadgePercent,
  FileText,
  Landmark,
  Truck,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import type { FeeItem } from "@/types";

export function getFeeIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  if (lower.includes("seguro") || lower.includes("insurance") || lower.includes("riesgo") || lower.includes("vida")) {
    if (lower.includes("check") || lower.includes("aprobado")) return ShieldCheck;
    if (lower.includes("vida") || lower.includes("life")) return Heart;
    return Shield;
  }
  if (lower.includes("aval") || lower.includes("garant├¡a") || lower.includes("fiador")) {
    return FileCheck;
  }
  if (lower.includes("estudio") || lower.includes("an├ílisis") || lower.includes("investigaci├│n")) {
    return Search;
  }
  if (lower.includes("comisi├│n") || lower.includes("cargo") || lower.includes("fee") || lower.includes("inter├®s")) {
    return BadgePercent;
  }
  if (lower.includes("matr├¡cula") || lower.includes("registro") || lower.includes("documento")) {
    return FileText;
  }
  if (lower.includes("banco") || lower.includes("entidad") || lower.includes("administraci├│n")) {
    return Landmark;
  }
  if (lower.includes("mensajer├¡a") || lower.includes("transporte") || lower.includes("env├¡o")) {
    return Truck;
  }
  return Receipt;
}

export function calculateTotalMonthlyFees(fees: FeeItem[]): number {
  return fees
    .filter((f) => f.type === "monthly")
    .reduce((sum, f) => sum + f.amount, 0);
}

export function calculateTotalUpfrontFees(fees: FeeItem[]): number {
  return fees
    .filter((f) => f.type === "upfront")
    .reduce((sum, f) => sum + f.amount, 0);
}
