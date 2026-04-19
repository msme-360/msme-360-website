"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, 
  Sparkles, 
  Target, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  BarChart3,
  Zap,
  Loader2,
  FileText,
  Building2,
  MapPin,
  IndianRupee,
  MessageSquare,
  Linkedin,
  Copy,
  Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { 
  fetchTenders, 
  fetchGTMTemplates 
} from "@/app/[locale]/dashboard/actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoToMarketHub() {
  const t = useTranslations("GTMHub");
  const [isMounted, setIsMounted] = useState(false);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [marketReach, setMarketReach] = useState(125000);
  const [tenderSector, setTenderSector] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [tenders, setTenders] = useState<Record<string, string>[]>([]);
  const [outreachTemplates, setOutreachTemplates] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredTenders = tenders.filter((t: Record<string, string>) => tenderSector === "all" || t.sector === tenderSector);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const competitiveChecklistItems = [
    { id: "analysis", label: t("competitive.items.analysis") },
    { id: "pricing", label: t("competitive.items.pricing") },
    { id: "usp", label: t("competitive.items.usp") },
    { id: "swot", label: t("competitive.items.swot") }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tList, tplList]: [Record<string, string>[], Record<string, string>[]] = await Promise.all([
          fetchTenders(),
          fetchGTMTemplates()
        ]);
        setTenders(tList);
        setOutreachTemplates(tplList.map(tpl => ({
          id: tpl.id,
          type: tpl.type,
          title: t(tpl.title_key),
          content: tpl.content_template
        })));
      } catch (err) {
        console.error("Failed to fetch GTM data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const timer = setTimeout(() => setIsMounted(true), 0);
    
    // Simulate dynamic market fluctuations
    const interval = setInterval(() => {
      setMarketReach(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [t]);

  const toggleItem = (id: string) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerateRoadmap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowRoadmap(true);
    }, 2500);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  } as const;

  if (!isMounted) return null;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <Rocket className="w-3 h-3 mr-2" /> {t("badge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border/50 hover:bg-secondary/50">
            {t("export")}
          </Button>
          <Button 
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform min-w-[180px]"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t("syncing")}</>
            ) : (
              <>{t("generateRoadmap")} <Sparkles className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showRoadmap ? (
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
                <Button variant="ghost" onClick={() => setShowRoadmap(false)}>{t("roadmap.back")}</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { phase: t("roadmap.steps.week12.phase"), task: t("roadmap.steps.week12.task"), status: t("roadmap.steps.week12.status") },
                  { phase: t("roadmap.steps.week34.phase"), task: t("roadmap.steps.week34.task"), status: t("roadmap.steps.week34.status") },
                  { phase: t("roadmap.steps.month2.phase"), task: t("roadmap.steps.month2.task"), status: t("roadmap.steps.month2.status") }
                ].map((step, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <Badge className="mb-3 bg-primary/20 text-primary border-none">{step.phase}</Badge>
                    <h4 className="font-bold mb-2">{step.task}</h4>
                    <p className="text-xs text-muted-foreground">{t("roadmap.strategicPriority", { status: step.status.toLowerCase() })}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-secondary/30 rounded-2xl border border-border/50">
                <h4 className="font-bold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> {t("roadmap.summaryTitle")}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &quot;{t("roadmap.summaryText")}&quot;
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="hub-view"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Competitive Strategy Bento */}
            <motion.div variants={item} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden">
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
            <motion.div variants={item} className="glass-card p-8 bg-linear-to-br from-primary/15 via-transparent to-accent/10 border-primary/20">
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
                      {Math.round((completedItems.length / competitiveChecklistItems.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedItems.length / competitiveChecklistItems.length) * 100}%` }}
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

            {/* Tender Alerts Bento */}
            <motion.div variants={item} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden bg-primary/2 border-primary/10">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <IndianRupee className="w-40 h-40" />
              </div>
              
              <div className="relative z-10">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-3 bg-primary/10 rounded-2xl">
                          <Building2 className="w-6 h-6 text-primary" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold tracking-tight">{t("tenders.title")}</h3>
                          <p className="text-sm text-muted-foreground">{t("tenders.subtitle")}</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-2">
                       <Select value={tenderSector} onValueChange={setTenderSector}>
                          <SelectTrigger className="w-[140px] bg-background/50 rounded-xl border-border/50 h-9 text-xs">
                             <SelectValue placeholder="Sector" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50">
                             <SelectItem value="all">All Sectors</SelectItem>
                             {t.raw("tenders.sectors").map((s: string) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                       <Button variant="outline" size="sm" className="h-9 rounded-xl border-border/50 px-4 bg-background/50">
                          <MapPin className="w-3 h-3 mr-2" /> Pan-India
                       </Button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {isLoading ? (
                       Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="flex items-center gap-4 w-full">
                                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                <div className="space-y-2 w-full">
                                   <div className="flex items-center gap-2">
                                      <Skeleton className="h-4 w-40" />
                                      <Skeleton className="h-3 w-12 rounded-full" />
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <Skeleton className="h-3 w-20" />
                                      <Skeleton className="h-3 w-16" />
                                   </div>
                                </div>
                             </div>
                             <Skeleton className="mt-4 md:mt-0 h-8 w-24 rounded-xl shrink-0" />
                          </div>
                       ))
                    ) : filteredTenders.length > 0 ? (
                       filteredTenders.map(tender => (
                          <div key={tender.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group/tender hover:border-primary/30 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/5 rounded-xl text-primary font-black text-[10px] w-12 h-12 flex items-center justify-center text-center">
                                   {tender.agency}
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-sm tracking-tight">{tender.title}</h4>
                                      <Badge variant="outline" className="text-[8px] bg-primary/10 text-primary border-none">{tender.sector}</Badge>
                                   </div>
                                   <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                      <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {tender.location}</span>
                                      <span className="flex items-center gap-1 font-black text-foreground"><IndianRupee className="w-2.5 h-2.5" /> {tender.value_text || tender.value}</span>
                                   </div>
                                </div>
                             </div>
                             <Button size="sm" className="mt-4 md:mt-0 rounded-xl bg-primary text-primary-foreground font-bold px-4 h-8 text-[10px]">
                                {t("tenders.bidCta")}
                             </Button>
                          </div>
                       ))
                    ) : (
                       <div className="py-12 text-center opacity-40 text-sm font-medium italic">
                          {t("tenders.noResults")}
                       </div>
                    )}
                 </div>
              </div>
            </motion.div>

            {/* Outreach Scripts Bento */}
            <motion.div variants={item} className="glass-card p-8 group relative overflow-hidden border-accent/20 bg-accent/2">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare className="w-40 h-40" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-accent/10 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{t("outreach.title")}</h3>
                    <p className="text-sm text-muted-foreground">{t("outreach.subtitle")}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {outreachTemplates.map(tpl => (
                    <div key={tpl.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            {tpl.type === 'whatsapp' ? <MessageSquare className="w-3 h-3 text-emerald-500" /> : <Linkedin className="w-3 h-3 text-blue-500" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{tpl.title}</span>
                         </div>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-lg hover:bg-white/10"
                            onClick={() => copyToClipboard(tpl.id, tpl.content)}
                          >
                           {copiedId === tpl.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                         </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 italic font-serif">
                         &quot;{tpl.content}&quot;
                      </p>
                    </div>
                  ))}
                </div>

                <Button variant="ghost" className="mt-auto p-0 hover:bg-transparent text-accent font-bold gap-2 group/btn">
                  View full playbook <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>

            {/* Marketing & Creative Bento */}
            <motion.div variants={item} className="glass-card p-8 group overflow-hidden">
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
            <motion.div variants={item} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden bg-linear-to-br from-accent/5 to-transparent border-accent/10">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 flex items-center justify-center gap-2">
          <Rocket className="w-3 h-3" /> {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
