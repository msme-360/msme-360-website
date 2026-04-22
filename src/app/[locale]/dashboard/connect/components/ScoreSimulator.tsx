"use client";

import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ScoreSimulatorProps {
  revenue: number;
  setRevenue: (val: number) => void;
  businessAge: number;
  setBusinessAge: (val: number) => void;
  isFormalized: boolean;
  setIsFormalized: (val: boolean) => void;
  calculatedScore: number;
}

export default function ScoreSimulator({
  revenue,
  setRevenue,
  businessAge,
  setBusinessAge,
  isFormalized,
  setIsFormalized,
  calculatedScore
}: ScoreSimulatorProps) {
  const t = useTranslations("FinancialHub");
  return (
    <motion.div
      key="simulator"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <TrendingUp className="w-40 h-40" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("simulator.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("simulator.subtitle")}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              {calculatedScore}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("simulator.scoreLabel")}</p>
          </div>
        </div>

        <div className="bg-background/40 rounded-3xl p-8 border border-white/5 space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
              <span>{t("simulator.revenue")}</span>
              <span className="text-primary font-black">₹{revenue.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={revenue}
              onChange={(e) => setRevenue(parseInt(e.target.value))}
              className="w-full accent-primary bg-primary/20 h-2 rounded-full appearance-none cursor-pointer border border-white/5"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
              <span>{t("simulator.age")}</span>
              <span className="text-primary font-black">{businessAge} {businessAge === 1 ? t("simulator.yearUnit") : t("simulator.yearsUnit")}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={businessAge}
              onChange={(e) => setBusinessAge(parseInt(e.target.value))}
              className="w-full accent-primary bg-primary/20 h-2 rounded-full appearance-none cursor-pointer border border-white/5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setIsFormalized(!isFormalized)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${isFormalized ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'
                }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isFormalized ? 'bg-primary border-primary' : 'border-white/20'
                }`}>
                {isFormalized && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
              </div>
              <div>
                <p className="text-sm font-bold">{t("simulator.formalizedTitle")}</p>
                <p className="text-[10px] text-muted-foreground font-medium italic">{t("simulator.formalizedBonus")}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t("simulator.loanPotential")}</p>
                <Zap className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-xl font-black text-emerald-400">₹{(revenue * 6).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md font-medium italic" dangerouslySetInnerHTML={{ __html: t.raw("simulator.benchmark") }} />
          <Button className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform w-full md:w-auto">
            {t("simulator.cta")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
