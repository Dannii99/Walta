"use client";

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCOP } from "@/lib/currency";

interface KPICardProps {
  title: string;
  value: number;
  icon: "income" | "expenses" | "available";
  subtitle?: string;
}

export function KPICard({ title, value, icon, subtitle }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(v),
    });
    return controls.stop;
  }, [value]);

  const iconMap = {
    income: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
    expenses: { icon: TrendingDown, color: "text-red-500", bg: "bg-red-50" },
    available: { icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50" },
  };

  const { icon: Icon, color, bg } = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`${bg} p-2 rounded-full`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {formatCOP(displayValue)}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
