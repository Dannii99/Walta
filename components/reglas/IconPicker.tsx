"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check } from "lucide-react";
import { ICON_NAMES, getCategoryIconComponent } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  selectedIcon: string | null;
  onSelect: (iconName: string) => void;
  onClose: () => void;
  isMobile?: boolean;
}

const COLUMNS = { desktop: 8, tablet: 6, mobile: 5 };

export function IconPicker({ selectedIcon, onSelect, onClose, isMobile }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(-1);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ICON_NAMES;
    return ICON_NAMES.filter((name) => name.toLowerCase().includes(q));
  }, [query]);

  const cols = isMobile ? COLUMNS.mobile : COLUMNS.desktop;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const len = filtered.length;
      if (len === 0) return;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          setFocusIndex((prev) => (prev + 1) % len);
          break;
        case "ArrowLeft":
          e.preventDefault();
          setFocusIndex((prev) => (prev - 1 + len) % len);
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusIndex((prev) => Math.min(prev + cols, len - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusIndex((prev) => Math.max(prev - cols, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < len) {
            onSelect(filtered[focusIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, focusIndex, cols, onSelect, onClose]
  );

  useEffect(() => {
    if (focusIndex >= 0 && gridRef.current) {
      const items = gridRef.current.querySelectorAll<HTMLButtonElement>("[role='gridcell']");
      items[focusIndex]?.focus();
    }
  }, [focusIndex]);

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setFocusIndex(-1);
          }}
          placeholder="Buscar icono..."
          className={cn(
            "w-full h-10 pl-9 pr-4 text-sm rounded-xl border",
            "bg-background dark:bg-white/5 border-border dark:border-white/10",
            "text-foreground placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-wants)]/30 focus:border-[var(--color-wants)]"
          )}
          autoFocus
          aria-label="Buscar icono"
        />
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label="Selector de iconos"
        className={cn(
          "grid gap-2",
          "grid-cols-5",
          "sm:grid-cols-6",
          "lg:grid-cols-8"
        )}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((iconName, i) => {
            const Icon = getCategoryIconComponent(iconName);
            const selected = selectedIcon === iconName;
            const focused = focusIndex === i;
            return (
              <motion.button
                key={iconName}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.15 }}
                role="gridcell"
                aria-selected={selected}
                aria-label={iconName}
                onClick={() => onSelect(iconName)}
                onMouseEnter={() => setFocusIndex(i)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl border p-3 transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wants)]",
                  selected
                    ? "border-[var(--color-wants)] bg-[var(--color-wants)]/10 ring-2 ring-[var(--color-wants)]/30"
                    : focused
                    ? "border-border dark:border-white/20 bg-muted dark:bg-white/10"
                    : "border-border dark:border-white/10 bg-muted/50 dark:bg-transparent hover:bg-muted dark:hover:bg-white/5"
                )}
                tabIndex={focused ? 0 : -1}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 text-foreground dark:text-white" strokeWidth={1.8} />
                  {selected && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[var(--color-wants)] flex items-center justify-center">
                      <Check className="h-2 w-2 text-white" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-muted-foreground dark:text-white/50 leading-tight text-center truncate w-full">
                  {iconName}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">No se encontraron iconos para &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
