"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/services/supabase/supabase";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid work email address"),
});

interface ForgotPasswordFormProps {
  locale: string;
}

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const [isSent, setIsSent] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(value.email, {
        redirectTo: `${window.location.origin}/${locale}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSent(true);
        toast.success("Password reset link sent to your email!");
      }
    },
  });

  if (isSent) {
    return (
      <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5 text-center">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl mb-4">
          <KeyRound className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-display font-bold">Email Sent</h1>
        <p className="text-muted-foreground mt-4 mb-8">
          We've sent a password reset link to your email.
          Please check your inbox and follow the instructions.
        </p>
        <Link href={`/${locale}/login`}>
          <Button variant="outline" className="w-full h-12 rounded-xl group">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
          <KeyRound className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">Enter your work email to receive a reset link.</p>
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
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                placeholder="name@business.com"
                className="rounded-xl h-12"
                required
                autoFocus
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive mt-1">
                  {(field.state.meta.errors[0] as any)?.message ?? field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl group shadow-glow">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}
        </form.Subscribe>

        <Link href={`/${locale}/login`} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </form>
    </div>
  );
}
