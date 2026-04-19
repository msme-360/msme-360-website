"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  RotateCcw,
  CheckCircle2,
  ListTodo,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  submitMicroAIInterest,
  fetchAIServices,
  fetchNicCodes
} from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { logger } from "@/lib/logger";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

interface OCRData {
  vendor: string;
  date: string;
  amount: string;
  gstin: string;
  items: number;
}

interface AIService {
  id?: string;
  title_key: string;
  description_key: string;
  type_key: string;
  icon_name: string;
  title?: string;
  description?: string;
  type?: string;
  icon?: React.ReactNode;
  status?: string;
}

interface NicCode {
  code: string;
  description: string;
  category?: string;
  [key: string]: string | undefined;
}

export default function MicroAIHubClient() {
  const t = useTranslations("MicroAIHub");
  const [aiServices, setAiServices] = useState<AIService[]>([]);
  const [nicCodes, setNicCodes] = useState<NicCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastVal, setForecastVal] = useState(65);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTool, setActiveTool] = useState("forecasting");
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [services, nics]: [AIService[], NicCode[]] = await Promise.all([
          fetchAIServices(),
          fetchNicCodes()
        ]);
        
        // Map services with icons and translations
        const iconMap: Record<string, React.ReactNode> = {
          "BarChart3": <BarChart3 className="w-5 h-5" />,
          "MessageSquare": <MessageSquare className="w-5 h-5" />,
          "ShieldCheck": <ShieldCheck className="w-5 h-5" />,
          "Sparkles": <Sparkles className="w-5 h-5" />,
          "Zap": <Zap className="w-5 h-5" />
        };

        setAiServices(services.map((s: AIService) => ({
          ...s,
          title: t(s.title_key),
          description: t(s.description_key),
          icon: iconMap[s.icon_name] || <Bot className="w-5 h-5" />,
          type: t(s.type_key)
        })));
        
        setNicCodes(nics);
      } catch (err) {
        logger.error("Failed to fetch MicroAI data", "MicroAIHubClient", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const tool = searchParams.get('tool');
    if (tool && ["forecasting", "ocr", "nic", "eligibility"].includes(tool)) {
      setActiveTool(tool);
    }
  }, [searchParams, t]);
  const [ocrState, setOcrState] = useState<"idle" | "scanning" | "completed">("idle");
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [nicQuery, setNicQuery] = useState("");
  const [eligibilityChecks, setEligibilityChecks] = useState({
    age: true,
    turnover: true,
    innovation: false
  });

  const eligibilityScore = useMemo(() => {
    return Object.values(eligibilityChecks).filter(Boolean).length;
  }, [eligibilityChecks]);

  const nicResults = useMemo(() => {
    if (!nicQuery) return [];
    const q = nicQuery.toLowerCase();
    return nicCodes.filter(c => 
      c.description.toLowerCase().includes(q) || 
      c.category?.toLowerCase().includes(q) ||
      (c.subtext && c.subtext.toLowerCase().includes(q))
    );
  }, [nicQuery, nicCodes]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOcrSimulation = () => {
    setOcrState("scanning");
    setTimeout(() => {
      setOcrData({
        vendor: "Bharat Electronics",
        date: "24-Oct-2023",
        amount: "₹45,200.00",
        gstin: "27AAACB1234F1Z5",
        items: 12
      });
      setOcrState("completed");
    }, 3000);
  };

  const resetOcr = () => {
    setOcrState("idle");
    setOcrData(null);
  };

  if (!isMounted) return null;

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Activity className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTool === "forecasting" ? (
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
                        {t("tools.forecasting.simulator")} <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.forecasting.simulatorSub")}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">{t("tools.forecasting.badge")}</Badge>
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
                        
                        {/* Decorative Pulse */}
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
            ) : activeTool === "eligibility" ? (
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
                              const newChecks = { ...eligibilityChecks, [q.id]: !eligibilityChecks[q.id as keyof typeof eligibilityChecks] };
                              setEligibilityChecks(newChecks);
                            }}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              eligibilityChecks[q.id as keyof typeof eligibilityChecks] 
                              ? 'bg-primary/10 border-primary/40 shadow-sm' 
                              : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm tracking-tight">{q.label}</p>
                                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{q.desc}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                eligibilityChecks[q.id as keyof typeof eligibilityChecks] 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : 'border-white/20'
                              }`}>
                                {eligibilityChecks[q.id as keyof typeof eligibilityChecks] && <ChevronRight className="w-3 h-3 rotate-90" />}
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
            ) : activeTool === "nic" ? (
              <motion.div 
                key="nic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 group relative overflow-hidden min-h-[500px] flex flex-col"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-40 h-40" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">{t("tools.nic.title")}</h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.nic.finderSub")}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">{t("tools.nic.badge")}</Badge>
                  </div>

                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <Search className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        placeholder={t("tools.nic.placeholder")}
                        className="w-full bg-secondary/20 border border-border/50 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 font-medium"
                        onChange={(e) => setNicQuery(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                      {nicResults.length === 0 ? (
                        <div className="py-12 border-2 border-dashed border-border/20 rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
                          <Bot className="w-10 h-10 mb-4" />
                          <p className="text-xs font-bold uppercase tracking-widest leading-loose">{t("tools.nic.waiting")}</p>
                        </div>
                      ) : (
                        nicResults.map((code) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={code.code}
                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all group/nic cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-primary font-black text-lg tracking-tight">{code.code}</span>
                              <Badge variant="outline" className="text-[9px] border-primary/20 text-primary uppercase">{code.category}</Badge>
                            </div>
                            <p className="text-sm font-bold tracking-tight mb-0.5">{code.description}</p>
                            <p className="text-[11px] text-muted-foreground/60 italic leading-snug">{code.subtext}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border/20">
                    <Button variant="outline" className="rounded-xl px-6 text-xs font-bold border-primary/20 hover:bg-primary/10">{t("tools.nic.cta")}</Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="ocr"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card p-8 group relative overflow-hidden min-h-[500px] flex flex-col"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-40 h-40" />
                </div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight">{t("tools.ocr.title")}</h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium italic">{t("tools.ocr.visionSub")}</p>
                    </div>
                    <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20">{t("tools.ocr.visionBadge")}</Badge>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-3xl bg-primary/5 p-12 transition-all hover:border-primary/40 hover:bg-primary/10 group/drop">
                    {ocrState === "idle" && (
                      <div className="text-center space-y-6">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-background flex items-center justify-center mx-auto shadow-2xl border border-border group-hover/drop:scale-110 transition-transform">
                          <Zap className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <p className="text-xl font-bold tracking-tight">{t("tools.ocr.dropzone")}</p>
                          <p className="text-sm text-muted-foreground mt-1">{t("tools.ocr.dropzoneSub")}</p>
                        </div>
                        <Button 
                          onClick={handleOcrSimulation}
                          className="rounded-full px-8 shadow-glow"
                        >
                          {t("tools.ocr.selectFile")}
                        </Button>
                      </div>
                    )}

                    {ocrState === "scanning" && (
                      <div className="text-center space-y-8 w-full max-w-sm">
                        <div className="relative">
                          <div className="h-64 bg-secondary/30 rounded-2xl overflow-hidden relative">
                            <motion.div 
                              initial={{ top: "-100%" }}
                              animate={{ top: "100%" }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] z-10"
                            />
                            <div className="absolute inset-0 opacity-20 flex flex-col gap-2 p-4">
                              {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-white/20 rounded-full" />)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-bold animate-pulse text-primary tracking-tight">{t("tools.ocr.scanning")}</p>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{t("tools.ocr.scanningSub")}</p>
                        </div>
                      </div>
                    )}

                    {ocrState === "completed" && ocrData && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full space-y-6"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-xl tracking-tight">{t("tools.ocr.intelligence")}</h3>
                          <Button variant="ghost" className="text-xs" onClick={resetOcr}>{t("tools.ocr.scanAnother")}</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: t("tools.ocr.fields.vendor"), value: ocrData.vendor, icon: <Activity className="w-3 h-3" /> },
                            { label: t("tools.ocr.fields.date"), value: ocrData.date, icon: <Activity className="w-3 h-3" /> },
                            { label: t("tools.ocr.fields.amount"), value: ocrData.amount, icon: <Activity className="w-3 h-3" />, primary: true },
                            { label: t("tools.ocr.fields.gstin"), value: ocrData.gstin, icon: <Activity className="w-3 h-3" /> }
                          ].map((field) => (
                            <div key={field.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">{field.label}</p>
                              <p className={`text-lg font-bold tracking-tight ${field.primary ? 'text-primary' : ''}`}>{field.value}</p>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full rounded-xl bg-primary shadow-glow gap-2 font-bold py-6">
                          {t("tools.ocr.cta")} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="glass-card p-6 flex flex-col space-y-4">
                  <div className="flex flex-row justify-between items-start">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <Skeleton className="w-4 h-4 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between mt-auto">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))
            ) : (
              aiServices.map((service) => (
                <div 
                  key={service.id} 
                  onClick={() => {
                    if (service.id === "forecasting" || service.id === "ocr" || service.id === "nic" || service.id === "eligibility") {
                      setActiveTool(service.id);
                    }
                  }}
                  className={`glass-card hover:border-primary/40 p-6 transition-all cursor-pointer group hover:bg-white/5 flex flex-col ${
                    activeTool === service.id ? 'border-primary shadow-glow ring-1 ring-primary/20' : ''
                  }`}
                >
                  <div className={`p-3 bg-secondary/50 rounded-2xl w-fit mb-4 group-hover:bg-primary/25 group-hover:scale-110 transition-all ${
                    activeTool === service.id ? 'bg-primary/20 scale-110' : ''
                  }`}>
                    {service.icon}
                  </div>
                  <h3 className={`font-bold mb-1 tracking-tight ${activeTool === service.id ? 'text-primary' : ''}`}>{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <Badge variant="outline" className={`text-[9px] uppercase tracking-widest border-none px-0 ${
                      service.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {service.status}
                    </Badge>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ${
                      activeTool === service.id ? 'text-primary translate-x-1' : ''
                    }`} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Insights */}
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
              <Button variant="outline" className="w-full text-xs font-bold rounded-xl border-primary/20 hover:bg-primary/10 transition-colors">
                {t("insights.cta")}
              </Button>
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
      </div>

      {/* Discovery Quiz & Interest Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-20">
         <AIReadinessQuiz />
         <MicroAIInterestForm />
      </div>
    </div>
  );
}

function AIReadinessQuiz() {
  const t = useTranslations("MicroAIHub.quiz");
  const [step, setStep] = useState<"intro" | "questions" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = useMemo(() => t.raw("questions") as { text: string; options: string[] }[], [t]);

  const handleStart = () => setStep("questions");
  
  const handleAnswer = (choiceIndex: number) => {
    const newAnswers = [...answers, choiceIndex];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("result");
    }
  };

  const getReadinessLevel = () => {
    const avg = answers.reduce((a, b) => a + b, 0) / answers.length;
    if (avg < 0.8) return t("levels.beginner");
    if (avg < 1.6) return t("levels.intermediate");
    return t("levels.expert");
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden min-h-[400px] flex flex-col">
       <div className="p-8 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
             {step === "intro" && (
                <motion.div 
                   key="intro"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="text-center space-y-6"
                >
                   <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{t("badge")}</Badge>
                   <h3 className="text-3xl font-black tracking-tight">{t("title")}</h3>
                   <p className="text-muted-foreground">{t("subtitle")}</p>
                   <Button onClick={handleStart} className="rounded-full px-10 shadow-glow bg-primary h-12 text-lg font-bold">
                      {t("start")}
                   </Button>
                </motion.div>
             )}

             {step === "questions" && (
                <motion.div 
                   key="q"
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                >
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t("step", { current: currentQ + 1, total: questions.length })}</p>
                      <h4 className="text-2xl font-bold tracking-tight">{questions[currentQ].text}</h4>
                   </div>
                   <div className="space-y-3">
                      {questions[currentQ].options.map((opt: string, idx: number) => (
                         <Button 
                            key={idx} 
                            variant="outline" 
                            className="w-full h-14 justify-start rounded-2xl border-border/50 hover:border-primary/40 hover:bg-primary/5 text-left text-sm font-medium px-6 hover:scale-[1.01] transition-all"
                            onClick={() => handleAnswer(idx)}
                         >
                            {opt}
                         </Button>
                      ))}
                   </div>
                </motion.div>
             )}

             {step === "result" && (
                <motion.div 
                   key="result"
                   initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                   className="text-center space-y-8"
                >
                   <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-emerald-500">
                      <CheckCircle2 className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">{t("resultTitle")}</p>
                      <h3 className="text-4xl font-black text-emerald-500 tracking-tighter">{getReadinessLevel()}</h3>
                   </div>
                   <Button variant="outline" className="rounded-xl border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10" onClick={() => setStep("intro")}>
                      <RotateCcw className="w-4 h-4 mr-2" /> {t("reset")}
                   </Button>
                </motion.div>
             )}
          </AnimatePresence>
       </div>
    </Card>
  );
}

const microAISchema = z.object({
  revenue: z.string().min(1, "Revenue band is required"),
  service: z.string().min(1, "Service selection is required"),
});

function MicroAIInterestForm() {
  const t = useTranslations("MicroAIHub.interestForm");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      revenue: "10-50L",
      service: "Demand Forecasting"
    },
    validators: {
      onChange: microAISchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const res = await submitMicroAIInterest({
          revenue_band: value.revenue,
          data_readiness: "Moderate",
          capabilities: [value.service],
          comments: "Interested via dashboard discovery"
        });
        
        if (res.success) {
          toast.success(t("success"));
        } else {
          toast.error(res.error || "Submission failed");
        }
      } catch (error) {
        logger.error("submitMicroAIInterest failed", "MicroAIInterestForm", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden p-8">
       <div className="space-y-6">
          <div className="space-y-2">
             <h3 className="text-2xl font-black flex items-center gap-2">
                <ListTodo className="w-6 h-6 text-accent" /> {t("title")}
             </h3>
             <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }} 
            className="space-y-4"
          >
             <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t("revenue")}</Label>
                <form.Field name="revenue">
                  {(field) => (
                    <>
                      <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                         <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/50">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="<10L">{t("revenueOptions.lt10L")}</SelectItem>
                            <SelectItem value="10-50L">{t("revenueOptions.10_50L")}</SelectItem>
                            <SelectItem value="50L-1Cr">{t("revenueOptions.50L_1Cr")}</SelectItem>
                            <SelectItem value=">1Cr">{t("revenueOptions.gt10Cr")}</SelectItem>
                         </SelectContent>
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {(field.state.meta.errors[0] as { message?: string })?.message}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
             </div>

             <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t("targetService")}</Label>
                <form.Field name="service">
                  {(field) => (
                    <>
                      <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                         <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/50">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="Demand Forecasting">{t("serviceOptions.forecasting")}</SelectItem>
                            <SelectItem value="SOP Automation">{t("serviceOptions.sop")}</SelectItem>
                            <SelectItem value="Vision Inventory">{t("serviceOptions.inventory")}</SelectItem>
                            <SelectItem value="DPIIT Scorer">{t("serviceOptions.eligibility")}</SelectItem>
                         </SelectContent>
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {(field.state.meta.errors[0] as { message?: string })?.message}
                        </p>
                      )}
                    </>
                  )}
                </form.Field>
             </div>

             <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-accent text-accent-foreground font-black text-lg shadow-accent/20 shadow-lg mt-4 hover:scale-[1.01] transition-transform"
             >
                {loading ? t("recording") : t("submit")} <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </form>
          
          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold opacity-40 italic">
             {t("footer")}
          </p>
       </div>
    </Card>
  );
}
