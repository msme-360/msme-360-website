"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { supabase } from "@/services/supabase/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface ResetPasswordFormProps {
  locale: string;
}

export function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.updateUser({ password: value.password });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        router.push(`/${locale}/login`);
      }
    },
  });

  return (
    <div className="bg-background border border-border/50 rounded-3xl p-8 md:p-10 shadow-xl shadow-primary/5">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold">New Password</h1>
        <p className="text-muted-foreground mt-2">Secure your account with a new password.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field name="password">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl h-12 pl-10"
                  required
                  autoFocus
                />
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive mt-1">
                  {(field.state.meta.errors[0] as any)?.message ?? field.state.meta.errors[0]?.toString()}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="rounded-xl h-12 pl-10"
                  required
                />
              </div>
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
                  Update Password
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
