"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthLayout } from "../components/AuthLayout";
import { RegistrationForm } from "./components/RegistrationForm";
import { FeatureList } from "./components/FeatureList";
import { RegistrationSuccess } from "./components/RegistrationSuccess";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AuthLayout maxWidth="max-w-5xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <FeatureList />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <RegistrationForm key="form" onSuccess={() => setIsSubmitted(true)} />
            ) : (
              <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
                <RegistrationSuccess key="success" />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AuthLayout>
  );
}
