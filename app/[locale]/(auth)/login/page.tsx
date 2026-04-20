"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { logger } from "@/lib/logger";
import { getRoleById } from "@/lib/constants/roles";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

type LoginFields = {
  email: string;
  password?: string;
  confirmPassword?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [step, setStep] = useState<"email" | "password" | "activate" | "unknown">("email");
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }: { value: LoginFields }) => {
      try {
        if (step === "email") {
          setIsChecking(true);
          
          // Use the real-time RPC for definitive status checking
          const { data: status, error: statusError } = await supabase
            .rpc('check_user_status', { target_email: value.email });

          if (statusError) {
            logger.error("RPC Status check failed", "LoginPage", statusError);
            toast.error("Security verification failed. Please try again.");
            setIsChecking(false);
            return;
          }

          if (status === 'unknown') {
            setStep("unknown");
            setIsChecking(false);
            return;
          }

          if (status === 'needs_activation') {
            setStep("activate");
          } else {
            setStep("password");
          }
          
          setIsChecking(false);
          return;
        }

        let user;
        if (step === "password") {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: value.email,
            password: value.password!,
          });
          if (error) throw error;
          user = data.user;
        }

        if (step === "activate") {
          if (value.password !== value.confirmPassword) {
            toast.error("Passwords do not match");
            return;
          }
          
          const { data, error } = await supabase.auth.signUp({
            email: value.email,
            password: value.password!,
          });
          if (error) throw error;
          user = data.user;
          toast.success("Account activated!");
        }

        if (user) {
          // Use the SECURITY DEFINER RPC for definitive, RLS-bypass role retrieval
          const { data: role, error: roleError } = await supabase
            .rpc('get_role_by_id', { user_id: user.id });

          if (roleError) {
            logger.error("Role retrieval failed", "LoginPage", roleError);
          }

          const roleData = getRoleById(role || 'user');
          const level = roleData.level;
          
          console.info("User authenticated", "LoginPage", { effectiveRole: roleData.id, level });
          
          // 7-Tier Strategic Redirection
          if (level === 0) {
            router.push(`/${locale}/admin/governance`);
          } else if (level === 1) {
            router.push(`/${locale}/admin/executive`);
          } else if (level === 2) {
            router.push(`/${locale}/admin/operations`);
          } else if (level === 3) {
            router.push(`/${locale}/internal/manager`);
          } else if (level === 4) {
            router.push(`/${locale}/internal/staff`);
          } else if (level === 5) {
            router.push(`/${locale}/internal/associate`);
          } else {
            router.push(`/${locale}/dashboard`);
          }
        }
        
        router.refresh();
      } catch (error) {
        console.error("Auth failed", "LoginPage", error);
        toast.error(error instanceof Error ? error.message : "Authentication failed");
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
            <p className="text-muted-foreground mt-2">Enter credentials or activate your hired account.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {step === "email" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <form.Field name="email">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Work Email</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="email"
                        placeholder="name@business.com"
                        className="rounded-xl h-12"
                      />
                    </div>
                  )}
                </form.Field>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="p-3 bg-secondary/20 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{form.getFieldValue("email")}</span>
                  <Button variant="ghost" size="sm" onClick={() => setStep("email")} className="h-7 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors uppercase tracking-widest font-black">Change</Button>
                </div>
                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor={field.name}>Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">Forgot?</Link>
                      </div>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl h-12"
                        autoFocus
                      />
                    </div>
                  )}
                </form.Field>
              </motion.div>
            )}

            {step === "activate" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-primary">Board Approval Detected</p>
                    <Button variant="ghost" size="sm" onClick={() => setStep("email")} className="h-6 text-[10px] font-black uppercase tracking-widest">Change</Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">We found your hiring profile. Initialize your corporate access by setting a secure password.</p>
                </div>
                <form.Field name="password">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Create Password</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="password"
                        placeholder="Min. 8 characters"
                        className="rounded-xl h-12"
                        autoFocus
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="confirmPassword">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name}>Confirm Password</Label>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="rounded-xl h-12"
                      />
                    </div>
                  )}
                </form.Field>
              </motion.div>
            )}

            {step === "unknown" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div className="p-6 bg-secondary/30 border border-border/50 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Account Not Found</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    The email <span className="text-foreground font-medium">{form.getFieldValue("email")}</span> is not recognized in our corporate or hiring systems.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href={`/${locale}/register`} className="w-full">
                      <Button className="w-full rounded-xl" variant="default">
                        Register MSME 360
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={() => setStep("email")} className="text-xs uppercase tracking-widest font-black">
                      Try another email
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step !== "unknown" && (
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting] as const}
              >
                {(state) => {
                  const [, isSubmitting] = state;
                  return (
                    <Button
                      type="submit"
                      disabled={isSubmitting || isChecking}
                      className="w-full h-12 rounded-xl text-base font-semibold group shadow-glow"
                    >
                      {isSubmitting || isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {step === "email" ? "Verify Identity" : step === "activate" ? "Activate Account" : "Sign In"}
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  );
                }}
              </form.Subscribe>
            )}
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
