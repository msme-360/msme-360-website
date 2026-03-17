"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Building2, MapPin, Mail, Globe, Edit3, Shield, Save, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  initialProfile: {
    company_name: string;
    category: string;
    udyam_number: string;
    email: string;
    location: string;
    website: string;
  };
  userId: string;
}

export function ProfileForm({ initialProfile, userId }: ProfileFormProps) {
  const t = useTranslations("Profile.form");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile(userId, profile);
      if (result.success) {
        toast.success(t("successToast"));
        setIsEditing(false);
      } else {
        toast.error(t("errorToast"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="glass-card overflow-hidden">
      <div className="h-32 bg-linear-to-r from-primary/20 via-primary/5 to-accent/20 border-b border-border/50" />
      <CardContent className="p-8 -mt-16 relative">
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-32 h-32 rounded-[2.5rem] bg-background p-1 shadow-2xl">
              <div className="w-full h-full rounded-[2.2rem] bg-secondary flex items-center justify-center border border-border/50">
                <Building2 className="w-12 h-12 text-primary/50" />
              </div>
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold">{profile.company_name}</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> {t("verified")}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-fit">
            {isEditing ? (
              <>
                <Button variant="outline" className="rounded-xl gap-2 flex-1 md:flex-initial" onClick={() => {
                  setProfile(initialProfile);
                  setIsEditing(false);
                }}>
                  <X className="w-4 h-4" /> {t("cancel")}
                </Button>
                <Button className="rounded-xl gap-2 flex-1 md:flex-initial shadow-glow" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? t("saving") : t("save")}
                </Button>
              </>
            ) : (
              <Button variant="outline" className="rounded-xl gap-2 w-full md:w-fit" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4" /> {t("edit")}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("companyName")}</Label>
              <Input 
                disabled={!isEditing} 
                value={profile.company_name} 
                onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                className="bg-secondary/30 rounded-xl" 
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("category")}</Label>
              <Input 
                disabled={!isEditing} 
                value={profile.category} 
                onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                className="bg-secondary/30 rounded-xl" 
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">{t("udyam")}</Label>
              <Input 
                disabled={true} 
                value={profile.udyam_number} 
                className="bg-secondary/10 rounded-xl font-mono opacity-60" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
            )}>
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("email")}</p>
                {isEditing ? (
                  <Input 
                    value={profile.email} 
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0" 
                  />
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
            </div>
            
            <div className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
            )}>
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("location")}</p>
                {isEditing ? (
                  <Input 
                    value={profile.location} 
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0" 
                  />
                ) : (
                  <p className="font-medium">{profile.location}</p>
                )}
              </div>
            </div>

            <div className={cn(
              "flex items-start gap-4 p-4 rounded-xl border transition-all",
              isEditing ? "bg-background border-primary/20" : "bg-secondary/20 border-border/50"
            )}>
              <Globe className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{t("website")}</p>
                {isEditing ? (
                  <Input 
                    value={profile.website} 
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="h-8 text-sm p-0 border-0 bg-transparent focus-visible:ring-0" 
                  />
                ) : (
                  <p className="font-medium">{profile.website}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
