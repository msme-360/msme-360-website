"use client";

import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ScoreNotice() {
  const t = useTranslations("FinancialHub");

  return (
    <div className="mt-12 p-6 rounded-3xl bg-secondary/30 border border-white/5 flex gap-4 items-start">
      <div className="p-2 bg-white/5 rounded-xl">
        <Info className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h5 className="font-bold text-sm text-foreground/80">{t("notice.title")}</h5>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("notice.description")}
        </p>
      </div>
    </div>
  );
}
