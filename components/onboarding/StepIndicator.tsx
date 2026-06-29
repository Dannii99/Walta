"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={index} className="flex flex-1 items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  } ${isCurrent ? "bg-gradient-to-br from-primary to-emerald-700 dark:to-emerald-600" : ""}`}
                  animate={
                    isCurrent
                      ? { scale: [1, 1.08, 1] }
                      : isCompleted
                      ? { scale: [0.9, 1] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    stepNum
                  )}
                </motion.div>
                <span
                  className={`mt-1.5 hidden text-[11px] font-semibold sm:block ${
                    isCurrent
                      ? "text-stone-900 dark:text-stone-50"
                      : isCompleted
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="relative mx-2 h-1 flex-1 sm:mx-4 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-muted" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/60 to-primary rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: isCompleted ? "100%" : isCurrent ? "50%" : "0%",
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}