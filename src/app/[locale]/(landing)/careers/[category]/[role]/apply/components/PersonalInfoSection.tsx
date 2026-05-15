"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalInfoSection({ isGeneral = false }: { isGeneral?: boolean }) {
  const t = useTranslations("Careers.ApplyForm");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
        <h3 className="font-bold text-lg">{t('personal.title')}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-muted-foreground flex items-center">
            {t('personal.nameLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="full_name" name="full_name" placeholder={t('personal.namePlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground flex items-center">
            {t('personal.emailLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder={t('personal.emailPlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-muted-foreground flex items-center">
            {t('personal.phoneLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="phone" name="phone" placeholder={t('personal.phonePlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience_level" className="text-muted-foreground flex items-center">
            {t('personal.statusLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="experience_level" name="experience_level" placeholder={t('personal.statusPlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
      </div>

      {isGeneral && (
        <div className="space-y-2">
          <Label htmlFor="desired_role" className="text-muted-foreground flex items-center">
            {t('personal.desiredRoleLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Textarea 
            id="desired_role" 
            name="desired_role" 
            placeholder={t('personal.desiredRolePlaceholder')} 
            required 
            className="bg-white/5 border-white/10 min-h-[100px] rounded-xl resize-none" 
          />
        </div>
      )}
    </div>
  );
}
