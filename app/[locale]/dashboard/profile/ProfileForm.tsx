"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Building2, MapPin, Mail, Globe, Edit3, Shield, Save, X, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { logger } from "@/lib/logger";

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface ProfileFormProps {
  initialProfile: {
    company_name: string;
    category: string;
    udyam_number: string;
    email: string;
    location: string;
    website: string;
  };
}

const profileFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  email: z.email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  website: z.url("Invalid website URL").or(z.literal("")),
});

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const t = useTranslations("Profile.form");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<z.infer<typeof profileFormSchema> | null>(null);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const executeUpdate = async (value: z.infer<typeof profileFormSchema>) => {
    try {
      const result = await updateProfile(value);
      if (result.success) {
        logger.info("Profile updated", "ProfileForm", { company: value.company_name });
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setShowConfirmDialog(false);
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error) {
      logger.error("Profile update failed", "ProfileForm", error);
      toast.error("Failed to update profile");
    }
  };

  const form = useForm({
    defaultValues: {
      company_name: initialProfile.company_name,
      category: initialProfile.category,
      email: initialProfile.email,
      location: initialProfile.location,
      website: initialProfile.website || "",
    },
    validators: {
      onChange: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      const isSensitiveChange = 
        value.email !== initialProfile.email || 
        value.category !== initialProfile.category || 
        value.company_name !== initialProfile.company_name;

      if (isSensitiveChange) {
        setPendingValues(value);
        setShowConfirmDialog(true);
      } else {
        await executeUpdate(value);
      }
    },
  });

  if (!isMounted) return null;

  return (
    <>
      <Card className="glass-card overflow-hidden">
        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-accent/20 border-b border-border/50" />
        <CardContent className="p-8 -mt-16 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="w-32 h-32 rounded-[2.5rem] bg-background p-1 shadow-2xl">
                  <div className="w-full h-full rounded-[2.2rem] bg-secondary flex items-center justify-center border border-border/50">
                    <Building2 className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
                <div className="pb-2">
                  <h2 className="text-2xl font-bold">{form.state.values.company_name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> {t("verified")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-fit">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl gap-2 flex-1 md:flex-initial"
                      onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }}
                    >
                      <X className="w-4 h-4" /> {t("cancel")}
                    </Button>
                    <form.Subscribe
                      selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <Button
                          type="submit"
                          className="rounded-xl gap-2 flex-1 md:flex-initial shadow-glow"
                          disabled={!canSubmit || isSubmitting}
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {isSubmitting ? t("saving") : t("save")}
                        </Button>
                      )}
                    </form.Subscribe>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl gap-2 w-full md:w-fit"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="w-4 h-4" /> {t("edit")}
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <form.Field name="company_name">
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("companyName")}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        disabled={!isEditing}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={cn("bg-secondary/30 rounded-xl", field.state.meta.errors.length ? "border-destructive" : "")}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-[10px] text-destructive flex items-center gap-1 mt-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                            {(field.state.meta.errors[0] as { message?: string })?.message || String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                <form.Field name="category">
                  {(field) => (
                    <div>
                      <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("category")}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        disabled={!isEditing}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={cn("bg-secondary/30 rounded-xl", field.state.meta.errors.length ? "border-destructive" : "")}
                      />
                    </div>
                  )}
                </form.Field>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("udyam")}</Label>
                  <Input
                    disabled={true}
                    value={initialProfile.udyam_number ?? ""}
                    className="bg-secondary/10 rounded-xl font-mono opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <form.Field name="email">
                  {(field) => (
                    <div className={cn(
                      "flex flex-col gap-1 p-4 rounded-xl border transition-all",
                      isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
                    )}>
                      <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("email")}</p>
                          {isEditing ? (
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value ?? ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0"
                            />
                          ) : (
                            <p className="font-medium">{field.state.value}</p>
                          )}
                        </div>
                      </div>
                      {field.state.meta.errors.length > 0 && isEditing && (
                        <p className="text-[10px] text-destructive flex items-center gap-1 ml-9 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {(field.state.meta.errors[0] as { message?: string })?.message || String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="location">
                  {(field) => (
                    <div className={cn(
                      "flex flex-col gap-1 p-4 rounded-xl border transition-all",
                      isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
                    )}>
                      <div className="flex items-center gap-4">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("location")}</p>
                          {isEditing ? (
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value ?? ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0"
                            />
                          ) : (
                            <p className="font-medium">{field.state.value}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </form.Field>

                <form.Field name="website">
                  {(field) => (
                    <div className={cn(
                      "flex flex-col gap-1 p-4 rounded-xl border transition-all",
                      isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
                    )}>
                      <div className="flex items-center gap-4">
                        <Globe className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("website")}</p>
                          {isEditing ? (
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value ?? ""}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0"
                            />
                          ) : (
                            <p className="font-medium">{field.state.value || "-"}</p>
                          )}
                        </div>
                      </div>
                      {field.state.meta.errors.length > 0 && isEditing && (
                        <p className="text-[10px] text-destructive flex items-center gap-1 ml-9 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          {(field.state.meta.errors[0] as { message?: string })?.message || String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="rounded-2xl border-border/50 backdrop-blur-xl bg-popover/95">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Confirm Sensitive Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are changing core business details (Email, Business Category, or Company Name). 
              Changes to these fields may affect your eligibility for certain government schemes and registrations.
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-xl bg-primary shadow-glow hover:bg-primary/90"
              onClick={() => {
                if (pendingValues) {
                  executeUpdate(pendingValues);
                }
              }}
            >
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

