"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { logger } from "@/lib/logger";

const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await supabase.auth.signUp({
          email: value.email,
          password: value.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        logger.info("User registered successfully", "RegisterPage", { email: value.email });
        toast.success("Verification email sent! Please check your inbox.");
        router.push("/login");
      } catch (error) {
        logger.error("Registration failed", "RegisterPage", error);
        let message = error instanceof Error ? error.message : "Registration failed";
        
        if (message.includes("User already registered")) {
          message = "This email is already registered. Please try logging in instead.";
        }
        
        toast.error(message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 pt-24 pb-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Branding/Value Prop */}
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

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold">Create Account</h2>
              <p className="text-muted-foreground mt-2">Get started for free in minutes.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Work Email</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="email"
                      placeholder="name@company.com"
                      className={`rounded-xl h-12 ${field.state.meta.errors.length ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {(field.state.meta.errors[0] as { message?: string })?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="Min. 8 characters"
                      className={`rounded-xl h-12 ${field.state.meta.errors.length ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {(field.state.meta.errors[0] as { message?: string })?.message}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full h-12 rounded-xl text-base font-semibold group mt-4"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Create Free Account
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 font-medium bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors shadow-sm">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span>{text}</span>
    </div>
  );
}

