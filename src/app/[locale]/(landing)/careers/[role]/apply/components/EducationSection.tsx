"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

export default function EducationSection() {
  const t = useTranslations("Careers.ApplyForm");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
        <h3 className="font-bold text-lg">{t('education.title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="university" className="text-muted-foreground flex items-center">
            {t('education.uniLabel')} <span className="text-primary ml-1">*</span>
          </Label>
          <Input id="university" name="university" placeholder={t('education.uniPlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="degree" className="text-muted-foreground flex items-center">
              {t('education.degreeLabel')} <span className="text-primary ml-1">*</span>
            </Label>
            <Input id="degree" name="degree" placeholder={t('education.degreePlaceholder')} required className="bg-white/5 border-white/10 h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation_year" className="text-muted-foreground flex items-center">
              {t('education.gradLabel')} <span className="text-primary ml-1">*</span>
            </Label>
            <Select name="graduation_year" required>
              <SelectTrigger className="bg-white/5 border-white/10 data-[size=default]:h-11 rounded-xl" size="default">
                <SelectValue placeholder={t('education.gradPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {["2025", "2026", "2027", "2028"].map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
