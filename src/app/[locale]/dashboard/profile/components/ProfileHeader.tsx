"use client";

import { Building2, Shield, Edit3, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  companyName: string;
  isEditing: boolean;
  onEditClick: () => void;
  onCancelClick: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
}

export function ProfileHeader({
  companyName,
  isEditing,
  onEditClick,
  onCancelClick,
  canSubmit,
  isSubmitting
}: ProfileHeaderProps) {
  const t = useTranslations("Profile.form");

  return (
    <div className="flex flex-col md:flex-row gap-6 items-end justify-between relative z-10">
      <div className="flex flex-col md:flex-row gap-6 items-end">
        <div className="w-32 h-32 rounded-[2.5rem] bg-background p-1 shadow-2xl">
          <div className="w-full h-full rounded-[2.2rem] bg-secondary flex items-center justify-center border border-border/50 group-hover:border-primary/30 transition-colors">
            <Building2 className="w-12 h-12 text-primary/50" />
          </div>
        </div>
        <div className="pb-2">
          <h2 className="text-2xl font-black font-display tracking-tight text-gradient">{companyName}</h2>
          <p className="text-muted-foreground flex items-center gap-2 font-medium">
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
              onClick={onCancelClick}
            >
              <X className="w-4 h-4" /> {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="rounded-xl gap-2 flex-1 md:flex-initial shadow-glow"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSubmitting ? t("saving") : t("save")}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl gap-2 w-full md:w-fit group hover:border-primary/50 transition-all font-bold"
            onClick={onEditClick}
          >
            <Edit3 className="w-4 h-4 group-hover:text-primary transition-colors" /> {t("edit")}
          </Button>
        )}
      </div>
    </div>
  );
}
