"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  style?: React.CSSProperties;
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

const AccordionContext = React.createContext<{
  type: "single" | "multiple";
  value: string[];
  onItemClick: (value: string) => void;
} | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within Accordion");
  }
  return context;
}

export function Accordion({
  type = "single",
  collapsible = true,
  className,
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
}: AccordionProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );

  const value = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : uncontrolledValue;

  const handleItemClick = React.useCallback(
    (itemValue: string) => {
      let newValue: string[];
      if (type === "single") {
        newValue = value.includes(itemValue) && collapsible ? [] : [itemValue];
      } else {
        newValue = value.includes(itemValue)
          ? value.filter((v) => v !== itemValue)
          : [...value, itemValue];
      }
      if (!isControlled) setUncontrolledValue(newValue);
      onValueChange?.(type === "single" ? newValue[0] : newValue);
    },
    [type, collapsible, value, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider value={{ type, value, onItemClick: handleItemClick }}>
      <div className={cn("w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  const { value: contextValue } = useAccordionContext();
  const isOpen = contextValue.includes(value);

  return (
    <div
      className={cn("border-border rounded-xl overflow-hidden transition-all duration-300", className)}
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
    </div>
  );
}

export function AccordionTrigger({
  className,
  children,
  asChild = false,
  style,
}: AccordionTriggerProps) {
  const { value: contextValue, onItemClick, type } = useAccordionContext();

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }
  const { value: itemValue } = itemContext;

  const isOpen = contextValue.includes(itemValue);

  return (
    <button
      type="button"
      className={cn(
        "w-full flex items-center justify-between px-4 py-4 text-left transition-colors",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      style={style}
      onClick={() => onItemClick(itemValue)}
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemValue}`}
      id={`accordion-trigger-${itemValue}`}
    >
      <span className="flex-1 pr-4">{children}</span>
      <motion.span
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex h-5 w-5 items-center justify-center shrink-0 text-muted-foreground"
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.span>
    </button>
  );
}

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

export function AccordionItemProvider({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      {children}
    </AccordionItemContext.Provider>
  );
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const { value: contextValue } = useAccordionContext();

  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }
  const { value: itemValue } = itemContext;

  const isOpen = contextValue.includes(itemValue);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`accordion-content-${itemValue}`}
          role="region"
          aria-labelledby={`accordion-trigger-${itemValue}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
          className={cn("overflow-hidden", className)}
        >
          <div className="px-4 pb-4 pt-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const AccordionItemWithProvider = ({ value, className, children }: AccordionItemProps) => (
  <AccordionItemProvider value={value}>
    <AccordionItem value={value} className={className}>
      {children}
    </AccordionItem>
  </AccordionItemProvider>
);
