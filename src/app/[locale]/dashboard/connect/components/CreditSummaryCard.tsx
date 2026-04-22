"use client";

import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function CreditSummaryCard() {
  const t = useTranslations("FinancialHub");
  return (
    <div className="glass-card p-6 border-primary/10 relative overflow-hidden group bg-linear-to-br from-primary/5 to-transparent">
      <h3 className="font-bold mb-4 flex items-center gap-2 tracking-tight">
        <PieChart className="w-5 h-5 text-primary" /> {t("sidebar.investorTitle")}
      </h3>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-background/50 border border-white/5">
          <div className="flex justify-between text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">
            <span>{t("sidebar.pitchScore")}</span>
            <span className="text-primary">68%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80" dangerouslySetInnerHTML={{ __html: t.raw("sidebar.readinessAdvice") }} />
        <Button className="w-full text-xs font-bold rounded-xl py-6 bg-secondary hover:bg-secondary/80 text-foreground shadow-glow border border-border/50">
          {t("sidebar.readinessCta")}
        </Button>
      </div>
    </div>
  );
}
