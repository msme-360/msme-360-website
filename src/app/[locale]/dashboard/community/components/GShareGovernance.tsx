"use client";

import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function GShareGovernance() {
  const t = useTranslations("Dashboard.Community");

  return (
    <div className="p-12 rounded-[3rem] bg-slate-950 border border-white/5 relative overflow-hidden group shadow-3xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <Shield className="w-10 h-10 text-white opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{t("governance.title")}</h4>
            <p className="text-sm text-muted-foreground/60 font-bold max-w-xl leading-relaxed">{t("governance.subtitle")}</p>
          </div>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 bg-white/5 text-xs font-black uppercase tracking-[0.2em] group/btn gap-3 hover:bg-white/10 transition-all">
          Review Charter <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
