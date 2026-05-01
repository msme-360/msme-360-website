"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

export default function TermsSection() {
  const t = useTranslations("Careers.ApplyForm");
  return (
    <div className="space-y-6 pt-10 border-t border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
        <h3 className="font-bold text-lg">{t('terms.title')}</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
          <Checkbox
            id="commitment"
            name="commitment"
            required
            className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
          />
          <Label htmlFor="commitment" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
            {t.rich('terms.commitment', {
              important: (chunks: ReactNode) => <strong>{chunks}</strong>
            })} <span className="text-primary ml-1">*</span>
          </Label>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
          <Checkbox
            id="expectations"
            name="expectations"
            required
            className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
          />
          <Label htmlFor="expectations" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
            {t.rich('terms.expectations', {
              important: (chunks: ReactNode) => <strong>{chunks}</strong>
            })} <span className="text-primary ml-1">*</span>
          </Label>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
          <Checkbox
            id="attendance"
            name="attendance"
            required
            className="mt-1 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
          />
          <Label htmlFor="attendance" className="text-sm block text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors">
            {t.rich('terms.attendance', {
              important: (chunks: ReactNode) => <strong>{chunks}</strong>
            })} <span className="text-primary ml-1">*</span>
          </Label>
        </div>
      </div>
    </div>
  );
}
