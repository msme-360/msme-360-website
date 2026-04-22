"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";

export function DashboardHeader() {
  const t = useTranslations("Dashboard");

  return (
    <div className="mb-12">
      <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
        <Briefcase className="w-3 h-3 mr-2" /> {t("badge")}
      </Badge>
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">
        {t("title")}
      </h1>
      <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
        {t("description")}
      </p>
    </div>
  );
}
