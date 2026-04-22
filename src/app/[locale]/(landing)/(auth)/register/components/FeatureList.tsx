"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 font-medium bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors shadow-sm">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span>{text}</span>
    </div>
  );
}

export function FeatureList() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden md:block"
    >
      <div className="inline-flex p-3 bg-primary rounded-2xl mb-6">
        <Shield className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-4xl font-display font-bold mb-6">Start your formalization journey today.</h1>
      <div className="space-y-4">
        <FeatureItem text="Zero-fee platform for micro entrepreneurs" />
        <FeatureItem text="Guided Udyam and GST registration" />
        <FeatureItem text="Premium business templates library" />
        <FeatureItem text="Early access to MicroAI Hub tools" />
      </div>
    </motion.div>
  );
}
