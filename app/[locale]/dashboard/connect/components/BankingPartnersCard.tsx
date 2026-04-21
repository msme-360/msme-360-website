"use client";

import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function BankingPartnersCard() {
  const t = useTranslations("FinancialHub");
  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Building2 className="w-4 h-4 text-accent" />
          </div>
          <h4 className="font-bold text-sm">{t("sidebar.bankingPartners")}</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-4">{t("sidebar.bankingDesc")}</p>
        <div className="space-y-3">
          {t.raw("sidebar.bankingPartnersList").map((bank: string) => (
            <div key={bank} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
              <span className="text-xs font-medium">{bank}</span>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] uppercase tracking-tighter">{t("sidebar.fastTrack")}</Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
