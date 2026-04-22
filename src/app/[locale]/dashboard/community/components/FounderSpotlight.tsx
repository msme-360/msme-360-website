"use client";

import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function FounderSpotlight() {
  const t = useTranslations("Dashboard.Community");

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-linear-to-r from-primary to-accent rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
      <div className="relative bg-background border border-primary/20 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
          <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
          <div className="absolute inset-0 bg-accent/20 rounded-[2.5rem] -rotate-3 group-hover:-rotate-6 transition-transform duration-500" />
          <div className="relative h-full w-full bg-linear-to-br from-primary/80 to-accent/80 rounded-[2.5rem] flex items-center justify-center p-1 overflow-hidden shadow-2xl">
            <div className="h-full w-full bg-slate-900 rounded-[2.3rem] flex items-center justify-center text-5xl font-black text-white">
              AS
            </div>
          </div>
          <Badge className="absolute -bottom-2 -right-2 bg-background border-2 border-primary text-primary font-black px-4 py-1.5 rounded-full shadow-lg">
            <Star className="w-4 h-4 mr-2 fill-primary" />
            Spotlight
          </Badge>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{t("spotlight.tag")}</span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t("spotlight.name")}</h2>
            <p className="text-lg text-muted-foreground font-medium italic opacity-80">{t("spotlight.company")}</p>
          </div>
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground/90 font-medium bg-muted/30 p-6 rounded-2xl border border-border/50">
            {t("spotlight.quote")}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-500 text-xs font-black">
              <TrendingUp className="w-3.5 h-3.5" />
              +140% Growth
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-primary text-xs font-black">
              Scale Cohort &apos;25
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
