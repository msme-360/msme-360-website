"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  roleTitle: string;
  locale: string;
}

export default function SuccessState({ roleTitle, locale }: SuccessStateProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 text-center max-w-md border-primary/20"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Application Sent!</h2>
        <p className="text-muted-foreground mb-8">
          Thank you for applying for the <strong>{roleTitle}</strong> role. Our team will review your profile and reach out if there&apos;s a match.
        </p>

        <Link href={`/${locale}/careers`} className="block w-full">
          <Button className="w-full font-bold shadow-glow">Return to Careers</Button>
        </Link>
      </motion.div>
    </div>
  );
}
