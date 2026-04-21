"use client";

import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function NetworkingCallout() {
  const t = useTranslations("Dashboard.Community");

  return (
    <Card className="glass-card border-primary/10 bg-linear-to-b from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <h5 className="font-bold text-sm uppercase tracking-tighter">{t("circles.verified")}</h5>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed font-bold opacity-60">
          Accessing these circles requires an MSME 360 Verified Profile and active G-Share tier participation.
        </p>
      </CardContent>
    </Card>
  );
}
