"use client";

import { motion } from "framer-motion";
import { FileText, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface RoadmapViewProps {
  onBack: () => void;
}

export default function RoadmapView({ onBack }: RoadmapViewProps) {
  const t = useTranslations("GTM");
  const roadmapSteps = [
    { phase: t("roadmap.steps.week12.phase"), task: t("roadmap.steps.week12.task"), status: t("roadmap.steps.week12.status") },
    { phase: t("roadmap.steps.week34.phase"), task: t("roadmap.steps.week34.task"), status: t("roadmap.steps.week34.status") },
    { phase: t("roadmap.steps.month2.phase"), task: t("roadmap.steps.month2.task"), status: t("roadmap.steps.month2.status") }
  ];

  return (
    <motion.div
      key="roadmap-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass-card p-8 border-primary/20 relative overflow-hidden mb-12"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <FileText className="w-64 h-64" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{t("roadmap.title")}</h2>
          <Button variant="ghost" onClick={onBack}>{t("roadmap.back")}</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roadmapSteps.map((step, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <Badge className="mb-3 bg-primary/20 text-primary border-none">{step.phase}</Badge>
              <h4 className="font-bold mb-2">{step.task}</h4>
              <p className="text-xs text-muted-foreground">{t("roadmap.strategicPriority", { status: step.status.toLowerCase() })}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-6 bg-secondary/30 rounded-2xl border border-border/50">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> {t("roadmap.summaryTitle")}
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground italic">
            &quot;{t("roadmap.summaryText")}&quot;
          </p>
        </div>
      </div>
    </motion.div>
  );
}
