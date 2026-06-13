"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export function PageTransitionOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-center w-full min-h-[calc(100dvh-5rem)] md:min-h-screen"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#26be15] to-[#1d9e10] flex items-center justify-center shadow-lg shadow-[#26be15]/20"
        >
          <Wallet className="h-7 w-7 text-white" strokeWidth={2.2} />
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-[#17181c] dark:text-white">
            Walta
          </span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#26be15] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#26be15]" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
