"use client";

import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { Wallet, TrendingUp, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniStatsRowProps {
  income: number;
  expenses: number;
  savingsCapacity: number;
  expensesPct: number;
  overBudget: boolean;
  reducedMotion?: boolean;
}

export function MiniStatsRow({
  income,
  expenses,
  savingsCapacity,
  expensesPct,
  overBudget,
  reducedMotion,
}: MiniStatsRowProps) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
    >
      <MiniStatCard
        label="Ingreso"
        value={income}
        icon={TrendingUp}
        tone="positive"
        sparklineSeed={1}
        reducedMotion={reducedMotion}
      />
      <MiniStatCard
        label={`Gastos · ${expensesPct}%`}
        value={expenses}
        icon={Wallet}
        tone={overBudget ? "danger" : "warning"}
        sparklineSeed={2}
        reducedMotion={reducedMotion}
      />
      <MiniStatCard
        label="Capacidad de ahorro"
        value={savingsCapacity}
        icon={PiggyBank}
        tone={savingsCapacity > 0 ? "positive" : "default"}
        sparklineSeed={3}
        reducedMotion={reducedMotion}
      />
    </motion.div>
  );
}

interface MiniStatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  tone?: "positive" | "warning" | "danger" | "default";
  sparklineSeed: number;
  reducedMotion?: boolean;
}

function MiniStatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  sparklineSeed,
  reducedMotion,
}: MiniStatCardProps) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.0,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(display);

  const toneConfig = {
    positive: {
      text: "text-[#23ad1b]",
      iconBg: "bg-[#23ad1b]/10",
      iconColor: "text-[#23ad1b]",
      sparklineColor: "#23ad1b",
    },
    warning: {
      text: "text-[#e7964d]",
      iconBg: "bg-[#e7964d]/10",
      iconColor: "text-[#e7964d]",
      sparklineColor: "#e7964d",
    },
    danger: {
      text: "text-[#e54d4d]",
      iconBg: "bg-[#e54d4d]/10",
      iconColor: "text-[#e54d4d]",
      sparklineColor: "#e54d4d",
    },
    default: {
      text: "text-[#17181c]",
      iconBg: "bg-[#f5f5f5]",
      iconColor: "text-[#737373]",
      sparklineColor: "#737373",
    },
  };

  const c = toneConfig[tone];

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#17181c] rounded-2xl p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-md", c.iconBg)}>
            <Icon className={cn("h-3.5 w-3.5", c.iconColor)} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa]">
            {label}
          </span>
        </div>
        {/* Mini sparkline */}
        <MiniSparkline color={c.sparklineColor} seed={sparklineSeed} />
      </div>
      <p className={cn("text-lg md:text-xl font-extrabold tabular-nums tracking-tight mt-2", c.text)}>
        {formatted}
      </p>
    </motion.div>
  );
}

function MiniSparkline({ color, seed }: { color: string; seed: number }) {
  // Generate pseudo-random points based on seed for a consistent look
  const points = 8;
  const width = 60;
  const height = 24;
  const padding = 2;

  const data = Array.from({ length: points }, (_, i) => {
    const pseudo = Math.sin((i + seed) * 1.7 + seed * 0.5) * 0.5 + 0.5;
    return +(padding + pseudo * (height - 2 * padding)).toFixed(2);
  });

  const stepX = +(width / (points - 1)).toFixed(2);
  const pathD = data
    .map((y, i) => `${i === 0 ? "M" : "L"} ${(i * stepX).toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");

  const areaD =
    pathD + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="opacity-60"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparklineGrad-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sparklineGrad-${seed})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
