"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { TrendingUp, Search, ArrowRight, Building2, CheckCircle2, Zap, Info, DollarSign, PieChart, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchSchemes as fetchSchemesAction } from "@/app/[locale]/dashboard/actions";


interface Scheme {
  id: string;
  url: string;
  [key: string]: string;
}

export default function FinancialConnectClient() {
  const t = useTranslations("FinancialHub");
  const st = useTranslations("Schemes");
  const [revenue, setRevenue] = useState(500000);
  const [businessAge, setBusinessAge] = useState(2);
  const [isFormalized, setIsFormalized] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"simulator" | "schemes">("simulator");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const hasMounted = React.useRef(false);

  const getSchemesLocal = async (query?: string) => {
    setLoading(true);
    const data = await fetchSchemesAction(query);
    setSchemes(data as Scheme[]);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getSchemesLocal(); // async — setState runs after await, not synchronously
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (hasMounted.current) {
      const timer = setTimeout(() => {
        getSchemesLocal(searchQuery);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const calculatedScore = (() => {
    let newScore = 600;
    newScore += Math.min(businessAge * 20, 100);
    newScore += Math.min((revenue / 100000) * 10, 150);
    if (isFormalized) newScore += 100;
    return Math.min(newScore, 900);
  })();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <DollarSign className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main interactive area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-4">
            <Button 
              variant={activeTab === "simulator" ? "default" : "secondary"} 
              onClick={() => setActiveTab("simulator")}
              className="rounded-full px-6"
            >
              {t("tabs.simulator")}
            </Button>
            <Button 
              variant={activeTab === "schemes" ? "default" : "secondary"} 
              onClick={() => setActiveTab("schemes")}
              className="rounded-full px-6"
            >
              {t("tabs.schemes")}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "simulator" ? (
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
                    {/* Monthly Revenue Slider */}
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

                    {/* Business Age Slider */}
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

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setIsFormalized(!isFormalized)}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                          isFormalized ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isFormalized ? 'bg-primary border-primary' : 'border-white/20'
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
            ) : (
              <motion.div
                key="schemes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-6 flex flex-col md:flex-row gap-4 items-center">
                   <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={t("schemes.searchPlaceholder")} 
                      className="pl-10 rounded-xl bg-secondary/30 ring-0 focus-visible:ring-primary/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                   <Button variant="outline" className="rounded-xl px-6 shrink-0 w-full md:w-auto">{t("schemes.filterCta")}</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {loading && schemes.length === 0 ? (
                    <div className="col-span-3 py-20 text-center opacity-50 italic">{t("schemes.searching")}</div>
                  ) : schemes.map((scheme: Scheme) => {
                    return (
                      <div key={scheme.id} className="glass-card p-6 flex flex-col group hover:border-primary/40 transition-all">
                        <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20 text-[9px] uppercase tracking-widest font-black">
                          {st(`${scheme.id}.category`)}
                        </Badge>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{st(`${scheme.id}.title`)}</h3>
                        <p className="text-xs text-muted-foreground mb-6 line-clamp-2">{st(`${scheme.id}.description`)}</p>
                         <div className="mt-auto pt-6 border-t border-border/50">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t("schemes.benefitLabel")}</p>
                            <p className="text-xs font-black text-primary">{st(`${scheme.id}.subsidy`)}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            asChild
                            className="w-full text-xs font-bold gap-2 p-0 h-auto hover:bg-transparent hover:text-primary group/btn"
                          >
                             <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                              {t("schemes.visitPortal")} <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
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
        </div>
      </div>

       <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 text-[10px] text-muted-foreground leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-primary" />
        <p>
          <strong>{t("notice.title")}</strong> {t("notice.text")}
        </p>
      </div>
    </div>
  );
}
