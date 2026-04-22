"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export default function PersonalInfoSection() {
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
          <Label htmlFor="phone" className="text-muted-foreground">{t('personal.phoneLabel')}</Label>
          <Input id="phone" name="phone" placeholder={t('personal.phonePlaceholder')} className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience_level" className="text-muted-foreground flex items-center">
            {t('personal.statusLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="experience_level" name="experience_level" placeholder={t('personal.statusPlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
