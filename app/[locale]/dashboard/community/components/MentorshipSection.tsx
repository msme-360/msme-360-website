"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function MentorshipSection() {
  const t = useTranslations("Dashboard.Community");

  return (
    <Card className="glass-card border-accent/20 bg-linear-to-br from-accent/5 to-transparent overflow-hidden shadow-xl group cursor-pointer hover:border-accent/40 transition-all">
      <CardContent className="p-8 space-y-6">
        <Badge className="bg-accent text-accent-foreground font-black uppercase tracking-[0.2em] text-[8px] px-3 py-0.5 rounded-full ring-4 ring-accent/10">
          Industrial Mentors
        </Badge>
        <div className="space-y-2">
           <h4 className="text-xl font-black leading-tight italic">{t("mentorship.title")}</h4>
           <p className="text-xs text-muted-foreground font-medium leading-relaxed opacity-80">{t("mentorship.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 pt-2 group-hover:translate-x-1 transition-transform">
           <span className="text-[10px] font-black uppercase tracking-widest text-accent">{t("mentorship.cta")}</span>
           <ArrowRight className="w-4 h-4 text-accent" />
        </div>
      </CardContent>
    </Card>
  );
}
