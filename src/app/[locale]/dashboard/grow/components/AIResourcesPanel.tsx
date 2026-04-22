"use client";

import { Bot, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface AIResourcesPanelProps {
  activeTool: string;
}

export function AIResourcesPanel({ activeTool }: AIResourcesPanelProps) {
  const t = useTranslations("MicroAIHub");
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 border-primary/10 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        <h3 className="font-bold mb-4 flex items-center gap-2 tracking-tight">
          <Bot className="w-5 h-5 text-primary" /> {t("insights.title")}
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-medium leading-relaxed italic opacity-80">
              {activeTool === "forecasting"
                ? t("insights.forecasting")
                : t("insights.general")
              }
            </p>
          </div>
          <button className="w-full text-xs font-bold rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors h-10">
            {t("insights.cta")}
          </button>
        </div>
      </div>

      <div className="glass-card p-6 overflow-hidden relative group border-accent/10">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
          <Maximize2 className="w-20 h-20" />
        </div>
        <h3 className="font-bold mb-2 tracking-tight">{t("infrastructure.title")}</h3>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          {t("infrastructure.description")}
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black opacity-60 uppercase tracking-widest">
            <span>{t("infrastructure.computeLabel")}</span>
            <span className="text-primary">{t("infrastructure.usage", { current: 8.2, total: 10 })}</span>
          </div>
          <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "82%" }}
              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
