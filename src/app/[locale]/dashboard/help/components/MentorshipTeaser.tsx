"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function MentorshipTeaser() {
  const t = useTranslations("HelpCenter");

  return (
    <Card className="mt-8 glass-card border-accent/20 bg-linear-to-r from-accent/5 to-transparent overflow-hidden group cursor-pointer hover:border-accent/40 transition-all">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[2rem] bg-accent/10 flex items-center justify-center text-accent ring-8 ring-accent/5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black">{t("mentor.title")}</h4>
              <p className="text-sm text-muted-foreground max-w-md">{t("mentor.subtitle")}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-accent group-hover:translate-x-2 transition-transform duration-500" />
        </div>
      </CardContent>
    </Card>
  );
}
