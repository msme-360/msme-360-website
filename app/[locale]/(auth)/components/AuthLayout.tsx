"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export function AuthLayout({ children, maxWidth = "max-w-md" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full ${maxWidth}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
