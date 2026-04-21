"use client";

import { motion, Variants } from "framer-motion";
import { 
  Target, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  BarChart3, 
  Sparkles 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface GTMStrategyGridProps {
  completedItems: string[];
  toggleItem: (id: string) => void;
  marketReach: number;
  itemVariants: Variants;
}

export default function GTMStrategyGrid({
  completedItems,
  toggleItem,
  marketReach,
  itemVariants
}: GTMStrategyGridProps) {
  const t = useTranslations("GTM");
  const competitiveChecklistItems = [
    { id: "analysis", label: t("competitive.items.analysis") },
    { id: "pricing", label: t("competitive.items.pricing") },
    { id: "usp", label: t("competitive.items.usp") },
    { id: "swot", label: t("competitive.items.swot") }
  ];

  const score = Math.round((completedItems.length / competitiveChecklistItems.length) * 100);

  return (
    <>
      {/* Competitive Strategy Bento */}
      <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Target className="w-40 h-40" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{t("competitive.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("competitive.subtitle")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {competitiveChecklistItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group/item ${
                  completedItems.includes(item.id) 
                  ? 'bg-primary/10 border-primary/30' 
                  : 'bg-white/5 border-white/5 hover:border-primary/20 hover:bg-white/10'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  completedItems.includes(item.id) 
                  ? 'bg-primary border-primary' 
                  : 'border-white/20'
                }`}>
                  {completedItems.includes(item.id) && <CheckCircle2 className="w-3 h-3 text-primary-foreground shrink-0" />}
                </div>
                <span className={`text-sm font-semibold transition-opacity ${completedItems.includes(item.id) ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold gap-2 group/btn">
              {t("competitive.launchWizard")} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Growth Stats Card */}
      <motion.div variants={itemVariants} className="glass-card p-8 bg-linear-to-br from-primary/15 via-transparent to-accent/10 border-primary/20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg opacity-80 uppercase tracking-widest text-[10px]">{t("reach.title")}</h3>
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-center py-6">
            <motion.span 
              key={marketReach}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="text-6xl font-display font-black tracking-tighter text-gradient drop-shadow-sm"
            >
              {(marketReach / 1000).toFixed(1)}k
            </motion.span>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">{t("reach.subtitle")}</p>
          </div>
          
          <div className="p-5 bg-background/50 rounded-2xl border border-white/5 space-y-4 shadow-inner">
            <div className="flex justify-between text-xs font-black italic">
              <span className="opacity-60 uppercase tracking-tighter">{t("reach.score")}</span>
              <span className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
                {score}%
              </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)] rounded-full transition-all duration-500" 
              />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed text-center px-4 font-medium italic opacity-80">
            {completedItems.length === competitiveChecklistItems.length 
              ? `"${t("reach.statusComplete")}"`
              : `"${t("reach.statusPending")}"`
            }
          </p>
        </div>
      </motion.div>

      {/* Marketing & Creative Bento */}
      <motion.div variants={itemVariants} className="glass-card p-8 group overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight leading-none">{t("marketing.titlePart1")}<br /><span className="text-accent">{t("marketing.titlePart2")}</span></h3>
        </div>
        
        <div className="space-y-4 mb-8">
          {t.raw("marketing.items").map((item: string) => (
            <div key={item} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group/item">
              <span className="text-sm font-medium opacity-80 group-hover/item:opacity-100">{item}</span>
              <Badge variant="secondary" className="bg-white/5 text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover/item:text-accent group-hover/item:bg-accent/10 transition-colors">{t("marketing.mockup")}</Badge>
            </div>
          ))}
        </div>

        <Button className="w-full rounded-xl bg-accent text-accent-foreground font-bold hover:scale-[1.02] transition-transform">
          {t("marketing.openStudio")}
        </Button>
      </motion.div>

      {/* Distribution Strategy Bento */}
      <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden bg-linear-to-br from-accent/5 to-transparent border-accent/10">
        <div className="absolute -bottom-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
          <Globe className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-4">{t("distribution.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {t("distribution.description")}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {t.raw("distribution.tags").map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-[10px] bg-white/5 border-white/10">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-background/60 border border-white/5 backdrop-blur-xl relative group/card overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart3 className="w-12 h-12 text-primary" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold tracking-tight">{t("distribution.insightsTitle")}</h4>
              </div>
              <p className="text-[11px] text-muted-foreground mb-4">{t("distribution.insightsDesc")}</p>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest mt-2 text-primary/60">{t("distribution.insightsStatus")}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
