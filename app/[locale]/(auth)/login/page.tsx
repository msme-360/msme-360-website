"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { logger } from "@/lib/logger";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: value.email,
          password: value.password,
        });

        if (error) throw error;

        logger.info("User logged in successfully", "LoginPage", { email: value.email });
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        logger.error("Login failed", "LoginPage", error);
        let message = error instanceof Error ? error.message : "Invalid credentials";
        
        // Harden error messages for better UX
        if (message === "Email not confirmed") {
          message = "Please check your inbox (and spam) to confirm your email before logging in.";
        }
        
        toast.error(message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access MSME 360</p>
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
                  <Label htmlFor={field.name}>Email address</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    placeholder="name@business.com"
                    className={`rounded-xl h-12 ${field.state.meta.errors.length ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {(field.state.meta.errors[0] as { message?: string })?.message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={field.name}>Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className={`rounded-xl h-12 ${field.state.meta.errors.length ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {(field.state.meta.errors[0] as { message?: string })?.message}
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
                  className="w-full h-12 rounded-xl text-base font-semibold group"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register MSME
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

