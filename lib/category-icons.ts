import {
  Home,
  UtensilsCrossed,
  Car,
  HeartPulse,
  Wifi,
  CreditCard,
  Utensils,
  ShoppingBag,
  Film,
  Plane,
  PiggyBank,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const REGISTRY: Record<string, LucideIcon> = {
  Home,
  UtensilsCrossed,
  Car,
  HeartPulse,
  Wifi,
  CreditCard,
  Utensils,
  ShoppingBag,
  Film,
  Plane,
  PiggyBank,
  TrendingUp,
};

export const ICON_NAMES = Object.keys(REGISTRY);

export function getCategoryIconComponent(iconName: string | null | undefined): LucideIcon {
  if (!iconName || !REGISTRY[iconName]) {
    return Home;
  }
  return REGISTRY[iconName];
}