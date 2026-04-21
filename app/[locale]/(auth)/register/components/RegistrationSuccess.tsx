"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RegistrationSuccess() {
  const router = useRouter();
  
  return (
    <motion.div
      key="success-state"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Check your email</h2>
      <p className="text-muted-foreground mb-8">
        We&apos;ve sent a verification link to your email address. 
        Please click the link to activate your account.
      </p>
      <Button
        onClick={() => router.push("/login")}
        variant="outline"
        className="w-full h-12 rounded-xl"
      >
        Go to login page
      </Button>
    </motion.div>
  );
}
