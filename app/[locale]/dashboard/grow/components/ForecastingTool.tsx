"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ForecastingToolProps {
  forecastVal: number;
  setForecastVal: (val: number) => void;
}

export default function ForecastingTool({ forecastVal, setForecastVal }: ForecastingToolProps) {
  const t = useTranslations("MicroAIHub");
  return (
    <motion.div 
      key="forecasting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-8 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <BarChart3 className="w-40 h-40" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              {t("tools.forecasting.simulator")}{' '}
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium italic">
              {t("tools.forecasting.simulatorSub")}
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            {t("tools.forecasting.badge")}
          </Badge>
        </div>

        <div className="bg-background/40 rounded-3xl p-8 border border-white/5">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 w-full space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>{t("tools.forecasting.inventory")}</span>
                  <span className="text-primary font-black">{forecastVal}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={forecastVal}
                  onChange={(e) => setForecastVal(parseInt(e.target.value))}
                  className="w-full accent-primary bg-secondary/30 h-1.5 rounded-full appearance-none cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">{t("tools.forecasting.stockRisk")}</p>
                  <p className={`text-xl font-bold ${forecastVal > 80 ? 'text-emerald-400' : forecastVal < 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {forecastVal > 80 ? t("tools.forecasting.riskLevels.low") : forecastVal < 30 ? t("tools.forecasting.riskLevels.high") : t("tools.forecasting.riskLevels.medium")}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">{t("tools.forecasting.priceElasticity")}</p>
                  <p className="text-xl font-bold">1.2x</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64 aspect-square rounded-full border-2 border-primary/20 flex flex-col items-center justify-center p-8 text-center relative group/inner">
              <div className="absolute inset-0 rounded-full bg-primary/5 group-hover/inner:bg-primary/10 transition-colors" />
              <AnimatePresence mode="wait">
                <motion.div 
                  key={forecastVal}
                  initial={{ scale: 0.9, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 space-y-1"
                >
                  <span className="text-4xl font-display font-black tracking-tighter text-gradient">
                    ₹{(forecastVal * 4200).toLocaleString()}
                  </span>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t("tools.forecasting.predictedRevenue")}</p>
                  <div className="flex items-center gap-1 text-primary text-xs font-black justify-center mt-2 decoration-primary underline-offset-4 decoration-2 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
                    <TrendingUp className="w-3 h-3" /> {t("tools.forecasting.growth", { value: "+12.4%" })}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-2 rounded-full border border-primary/10 animate-ping opacity-20" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform">
            {t("tools.forecasting.cta")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
