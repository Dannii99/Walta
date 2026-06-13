"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoanFormStepsProps {
  step: number;
  totalSteps: number;
}

const STEPS = [
  "Información básica",
  "Condiciones",
  "En curso",
];

export function LoanFormSteps({ step, totalSteps }: LoanFormStepsProps) {
  const visibleSteps = STEPS.slice(0, totalSteps);
  const progressPercent =
    totalSteps > 1 ? ((step - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="w-full">
      {/* Background bar + animated fill */}
      <div className="relative h-0.5 bg-[#e8e8e8] dark:bg-[#2a2a2e] mt-4">
        <motion.div
          className="absolute inset-y-0 left-0 bg-[#26be15]"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Steps with circles positioned above the bar */}
      <div className="relative -mt-4 flex justify-between">
        {visibleSteps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = step > stepNum;
          const isActive = step === stepNum;

          return (
            <div key={stepNum} className="flex flex-col items-center">
              {/* Circle */}
              <motion.div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0 z-10",
                  isCompleted
                    ? "bg-[#26be15] text-white"
                    : isActive
                    ? "bg-[#26be15] text-white ring-2 ring-[#26be15]/30"
                    : "bg-[#f5f5f5] dark:bg-white/5 text-[#737373] dark:text-[#a1a1aa]"
                )}
                animate={
                  isActive
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stepNum
                )}
              </motion.div>

              {/* Label */}
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium text-center",
                  isActive
                    ? "text-[#26be15] font-semibold"
                    : "text-[#737373] dark:text-[#a1a1aa]"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
