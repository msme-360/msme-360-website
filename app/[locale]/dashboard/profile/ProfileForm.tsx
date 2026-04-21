"use client";

import { Mail, MapPin, Globe, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useProfileForm } from "./hooks/useProfileForm";
import { ProfileHeader } from "./components/ProfileHeader";
import { SensitiveChangeDialog } from "./components/SensitiveChangeDialog";
import { type DashboardProfile } from "@/types/dashboard";

interface ProfileFormProps {
  initialProfile: DashboardProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const t = useTranslations("Profile.form");
  const { 
    form, 
    isEditing, 
    setIsEditing, 
    showConfirmDialog, 
    setShowConfirmDialog, 
    handleCancel, 
    confirmUpdate 
  } = useProfileForm(initialProfile);

  return (
    <>
      <Card className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-accent/20 border-b border-white/10" />
        <CardContent className="p-8 -mt-16 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <ProfileHeader 
              companyName={form.state.values.company_name}
              isEditing={isEditing}
              onEditClick={() => setIsEditing(true)}
              onCancelClick={handleCancel}
              canSubmit={form.state.canSubmit}
              isSubmitting={form.state.isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <form.Field name="company_name">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("companyName")}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        disabled={!isEditing}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={cn(
                          "bg-secondary/30 rounded-xl h-12 transition-all", 
                          field.state.meta.errors.length ? "border-destructive ring-destructive/20" : "border-white/5 focus:border-primary/50",
                          !isEditing && "opacity-60 grayscale-[0.5]"
                        )}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-[10px] text-destructive flex items-center gap-1 mt-1 font-bold italic">
                          <AlertCircle className="w-3 h-3" />
                          {(field.state.meta.errors[0] as { message?: string })?.message || String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="category">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("category")}</Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        disabled={!isEditing}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        className={cn(
                          "bg-secondary/30 rounded-xl h-12 transition-all",
                          !isEditing && "opacity-60 grayscale-[0.5]",
                          "border-white/5 focus:border-primary/50"
                        )}
                      />
                    </div>
                  )}
                </form.Field>

                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">{t("udyam")}</Label>
                  <Input
                    disabled={true}
                    value={initialProfile.udyam_number ?? ""}
                    className="bg-secondary/10 rounded-xl font-mono opacity-40 border-white/5 h-12"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { name: "email" as const, icon: Mail, label: t("email") },
                  { name: "location" as const, icon: MapPin, label: t("location") },
                  { name: "website" as const, icon: Globe, label: t("website") },
                ].map((item) => (
                  <form.Field name={item.name} key={item.name}>
                    {(field) => (
                      <div className={cn(
                        "flex flex-col gap-1 p-5 rounded-2xl border transition-all duration-300",
                        isEditing 
                          ? "bg-background border-primary/20 shadow-lg shadow-primary/5" 
                          : "bg-white/[0.02] border-white/5"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                            isEditing ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-foreground/50"
                          )}>
                             <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{item.label}</p>
                            {isEditing ? (
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0 font-bold"
                                placeholder={`Enter ${item.label}`}
                              />
                            ) : (
                              <p className="font-bold tracking-tight text-white/90">{field.state.value || "-"}</p>
                            )}
                          </div>
                        </div>
                        {field.state.meta.errors.length > 0 && isEditing && (
                          <p className="text-[10px] text-destructive flex items-center gap-1 ml-14 font-bold italic mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {(field.state.meta.errors[0] as { message?: string })?.message || String(field.state.meta.errors[0])}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <SensitiveChangeDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmUpdate}
      />
    </>
  );
}
