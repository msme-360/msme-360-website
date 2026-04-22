"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Bot, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EligibilityChecks } from "./MicroAITypes";
import { useTranslations } from "next-intl";

interface EligibilityScorerProps {
  eligibilityChecks: EligibilityChecks;
  setEligibilityChecks: (checks: EligibilityChecks) => void;
}

export default function EligibilityScorer({ eligibilityChecks, setEligibilityChecks }: EligibilityScorerProps) {
  const t = useTranslations("MicroAIHub");
  const eligibilityScore = useMemo(() => {
    return Object.values(eligibilityChecks).filter(Boolean).length;
  }, [eligibilityChecks]);

  return (
    <motion.div
      key="eligibility"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="glass-card p-0 group relative overflow-hidden min-h-[500px] flex flex-col border-primary/20 shadow-glow"
    >
      <div className="p-8 border-b border-white/5 bg-primary/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("tools.eligibility.scorer")}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.eligibility.scorerSub")}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t("tools.eligibility.scoreLabel")}</span>
            <div className="flex items-center gap-2">
              <div className="text-4xl font-display font-black tracking-tighter text-primary">{(eligibilityScore / 3 * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("tools.eligibility.checklistTitle")}</h3>
            <div className="space-y-3">
              {[
                { id: 'age', label: t("tools.eligibility.checklist.age.label"), desc: t("tools.eligibility.checklist.age.desc") },
                { id: 'turnover', label: t("tools.eligibility.checklist.turnover.label"), desc: t("tools.eligibility.checklist.turnover.desc") },
                { id: 'innovation', label: t("tools.eligibility.checklist.innovation.label"), desc: t("tools.eligibility.checklist.innovation.desc") }
              ].map((q) => (
                <div
                  key={q.id}
                  onClick={() => {
                    setEligibilityChecks({
                      ...eligibilityChecks,
                      [q.id]: !eligibilityChecks[q.id as keyof EligibilityChecks]
                    });
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${eligibilityChecks[q.id as keyof EligibilityChecks]
                    ? 'bg-primary/10 border-primary/40 shadow-sm'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm tracking-tight">{q.label}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{q.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${eligibilityChecks[q.id as keyof EligibilityChecks]
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-white/20'
                      }`}>
                      {eligibilityChecks[q.id as keyof EligibilityChecks] && <ChevronRight className="w-3 h-3 rotate-90" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div className="p-8 rounded-4xl bg-background/40 border border-white/5 relative group">
            <div className="absolute inset-0 bg-primary/2 rounded-4xl group-hover:bg-primary/5 transition-colors" />
            <div className="relative text-center space-y-4">
              <Bot className="w-12 h-12 text-primary mx-auto mb-2 opacity-80" />
              <h4 className="font-bold text-lg tracking-tight">{t("tools.eligibility.aiAssessment")}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                {eligibilityScore === 3
                  ? t("tools.eligibility.assessments.excellent")
                  : eligibilityScore >= 2
                    ? t("tools.eligibility.assessments.potential")
                    : t("tools.eligibility.assessments.missing")
                }
              </p>
            </div>
          </div>
          {eligibilityScore === 3 && (
            <Button className="w-full rounded-2xl py-8 text-lg font-bold shadow-glow hover:scale-[1.02] transition-transform">
              {t("tools.eligibility.cta")} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
