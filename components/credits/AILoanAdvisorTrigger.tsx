"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AILoanAdvisorCard } from "./AILoanAdvisorCard";

interface AILoanAdvisorTriggerProps {
  loanId: string;
}

export function AILoanAdvisorTrigger({ loanId }: AILoanAdvisorTriggerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpen = () => {
    if (window.innerWidth >= 768) {
      setDialogOpen(true);
    } else {
      setSheetOpen(true);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSheetOpen(false);
  };

  return (
    <>
      {/* Botón visible */}
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-all shadow-sm"
        aria-label="Abrir análisis con IA"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Análisis IA
      </button>

      {/* Desktop Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-[#17181c] border border-[#e8e8e8] dark:border-[#2a2a2e] rounded-2xl">
          <div className="sticky top-0 z-10 bg-white dark:bg-[#17181c] border-b border-[#e8e8e8] dark:border-[#2a2a2e] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <h2 className="text-sm font-bold text-[#17181c] dark:text-white">
                Análisis inteligente del crédito
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="px-5 py-4">
            <AILoanAdvisorCard loanId={loanId} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#17181c] rounded-t-2xl max-h-[85dvh] overflow-y-auto shadow-xl"
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-[#17181c] border-b border-[#e8e8e8] dark:border-[#2a2a2e] px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h2 className="text-sm font-bold text-[#17181c] dark:text-white">
                    Análisis IA
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:bg-[#f5f5f5] dark:hover:bg-white/5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-5 py-4 pb-8">
                <AILoanAdvisorCard loanId={loanId} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
