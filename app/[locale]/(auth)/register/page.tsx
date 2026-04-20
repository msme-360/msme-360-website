"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { logger } from "@/lib/logger";

const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  full_name: z.string().min(2, "Full name required"),
  phone: z.string().optional(),
  designation: z.string().min(2, "Professional designation required"),
  bio: z.string().max(160, "Bio must be under 160 characters").optional(),
  linkedin_url: z.url("Invalid LinkedIn URL").optional().or(z.literal("")),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      phone: "",
      designation: "",
      bio: "",
      linkedin_url: "",
    } as RegisterValues,
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        let avatarUrl = "";
        
        // 1. SignUp with MetaData
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: value.email,
          password: value.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: value.full_name,
              phone: value.phone,
              designation: value.designation,
              bio: value.bio,
              linkedin_url: value.linkedin_url,
            }
          },
        });

        if (signUpError) throw signUpError;

        // 2. Handle Avatar Upload (if any)
        if (avatarFile && data.user) {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${data.user.id}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);
            avatarUrl = publicUrl;
            
            // Update auth metadata with real url if possible
            await supabase.auth.updateUser({
              data: { avatar_url: avatarUrl }
            });
          }
        }

        logger.info("User registered with full profile", "RegisterPage", { email: value.email });
        setIsSubmitted(true);
        toast.success("Verification email sent!");
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

  const nextStep = () => {
    // Basic validation check before moving (can be more granular)
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    { title: "Credentials", icon: Shield },
    { title: "Identity", icon: ArrowRight },
    { title: "Portfolio", icon: ArrowRight },
    { title: "Aesthetics", icon: ArrowRight },
    { title: "Socials", icon: ArrowRight },
  ];

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
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-display font-bold">{steps[currentStep].title}</h2>
                      <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of 5</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-primary h-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(currentStep + 1) * 20}%` }}
                      />
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (currentStep < 4) {
                        nextStep();
                      } else {
                        form.handleSubmit();
                      }
                    }}
                    className="space-y-5"
                  >
                    {currentStep === 0 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <form.Field name="email">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Work Email</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                type="email"
                                placeholder="name@company.com"
                                className="rounded-xl h-12"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="password">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Password</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                type="password"
                                placeholder="Min. 8 characters"
                                className="rounded-xl h-12"
                              />
                            </div>
                          )}
                        </form.Field>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <form.Field name="full_name">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Full Name</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="John Doe"
                                className="rounded-xl h-12"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="phone">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Phone Number</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="+1 234 567 890"
                                className="rounded-xl h-12"
                              />
                            </div>
                          )}
                        </form.Field>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <form.Field name="designation">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Designation</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Managing Partner"
                                className="rounded-xl h-12"
                              />
                            </div>
                          )}
                        </form.Field>
                        <form.Field name="bio">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>Bio</Label>
                              <textarea
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="w-full min-h-[100px] bg-background border border-input rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          )}
                        </form.Field>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="space-y-4">
                          <Label>Profile Picture</Label>
                          <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border rounded-2xl bg-secondary/10">
                            {avatarPreview ? (
                              <div className="relative group">
                                <Image 
                                  src={avatarPreview} 
                                  alt="Preview" 
                                  width={96} 
                                  height={96} 
                                  className="w-24 h-24 rounded-full object-cover border-2 border-primary" 
                                />
                                <button 
                                  type="button"
                                  onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <AlertCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                                <Shield className="w-10 h-10 text-muted-foreground" />
                              </div>
                            )}
                            <div className="text-center">
                              <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setAvatarFile(file);
                                    setAvatarPreview(URL.createObjectURL(file));
                                  }
                                }}
                              />
                              <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <Button type="button" variant="outline" className="rounded-xl" asChild>
                                  <span>{avatarPreview ? "Change Photo" : "Upload Photo"}</span>
                                </Button>
                              </Label>
                              <p className="text-xs text-muted-foreground mt-2">Personalize your board presence.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <form.Field name="linkedin_url">
                          {(field) => (
                            <div className="space-y-2">
                              <Label htmlFor={field.name}>LinkedIn Profile URL</Label>
                              <Input
                                id={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="https://linkedin.com/in/username"
                                className="rounded-xl h-12"
                              />
                              <p className="text-xs text-muted-foreground">Link your professional network to MSME 360.</p>
                            </div>
                          )}
                        </form.Field>
                      </motion.div>
                    )}

                    <div className="flex gap-3 pt-4">
                      {currentStep > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="flex-1 h-12 rounded-xl"
                        >
                          Back
                        </Button>
                      )}
                      
                      <form.Subscribe selector={(state) => [state.isSubmitting]}>
                        {([isSubmitting]) => (
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] h-12 rounded-xl text-base font-semibold group"
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : currentStep < 4 ? (
                              <>
                                Next Step
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            ) : (
                              "Complete Registration"
                            )}
                          </Button>
                        )}
                      </form.Subscribe>
                    </div>
                  </form>

                  <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </motion.div>
              ) : (
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
              )}
            </AnimatePresence>
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

