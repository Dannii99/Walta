"use client";

import { motion } from "framer-motion";

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
      className="h-14 w-14 drop-shadow-lg"
    >
      <img
        src="/logo/Walta_App_dark.svg"
        alt="Walta"
        className="h-full w-full hidden dark:block"
      />
      <img
        src="/logo/Walta_App_light.svg"
        alt="Walta"
        className="h-full w-full block dark:hidden"
      />
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
