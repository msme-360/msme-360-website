"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, ChevronLeft, ExternalLink, ShieldCheck, FileText, Globe, ClipboardList } from "lucide-react";
import { getProgress, updateProgress } from "@/app/[locale]/dashboard/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Zap, Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FormalizeWizard() {
  const t = useTranslations("FormalizationWizard");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [checkerResult, setCheckerResult] = useState<{ eligible: boolean, reason?: string } | null>(null);
  const [checkerAnswers, setCheckerAnswers] = useState<Record<string, string>>({});

  const steps = [
    {
      id: "prep",
      title: t("steps.prep.title"),
      description: t("steps.prep.description"),
      icon: <FileText className="w-5 h-5 text-primary" />,
      items: t.raw("steps.prep.items") as string[],
      tip: t("steps.prep.tip"),
      resources: t.raw("steps.prep.resources") as { name: string; url: string }[]
    },
    {
      id: "udyam",
      title: t("steps.udyam.title"),
      description: t("steps.udyam.description"),
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      url: "https://udyamregistration.gov.in/",
      items: t.raw("steps.udyam.items") as string[],
      tip: t("steps.udyam.tip"),
      resources: t.raw("steps.udyam.resources") as { name: string; url: string }[]
    },
    {
      id: "dpiit",
      title: t("steps.dpiit.title"),
      description: t("steps.dpiit.description"),
      icon: <Globe className="w-5 h-5 text-primary" />,
      url: "https://www.startupindia.gov.in/",
      items: t.raw("steps.dpiit.items") as string[],
      tip: t("steps.dpiit.tip"),
      resources: t.raw("steps.dpiit.resources") as { name: string; url: string }[],
      hasChecker: true
    },
    {
      id: "gst",
      title: t("steps.gst.title"),
      description: t("steps.gst.description"),
      icon: <FileText className="w-5 h-5 text-primary" />,
      items: t.raw("steps.gst.items") as string[],
      tip: t("steps.gst.tip"),
      resources: t.raw("steps.gst.resources") as { name: string; url: string }[]
    },
    {
      id: "bank",
      title: t("steps.bank.title"),
      description: t("steps.bank.description"),
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      items: t.raw("steps.bank.items") as string[],
      tip: t("steps.bank.tip"),
      resources: t.raw("steps.bank.resources") as { name: string; url: string }[]
    }
  ];

  // In a real app, this would come from auth. Using a placeholder for now.
  const userId = "placeholder-user-id";

  useEffect(() => {
    async function loadProgress() {
      setIsLoading(true);
      try {
        const progress = await getProgress(userId);
        const completed = progress.filter((p: any) => p.completed).map((p: any) => p.id);
        setCompletedSteps(completed);
        
        // Auto-navigate to first uncompleted step
        const firstUncompleted = steps.findIndex(s => !completed.includes(s.id));
        if (firstUncompleted !== -1) {
          setCurrentStep(firstUncompleted);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgress();
  }, []);

  const handleComplete = async (stepId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateProgress(userId, stepId, true);
      if (result.success) {
        setCompletedSteps(prev => [...prev, stepId]);
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStep = () => {
    const stepId = steps[currentStep].id;
    handleComplete(stepId);
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const toggleItem = (stepId: string, item: string) => {
    setCheckedItems(prev => {
      const current = prev[stepId] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [stepId]: updated };
    });
  };

  const stepProgress = Math.round(
    ((checkedItems[steps[currentStep].id]?.length || 0) / steps[currentStep].items.length) * 100
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium">{t("syncing")}</p>
        </div>
      </div>
    );
  }

  return (
    <div aria-label={t("title")}>
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <ClipboardList className="w-3 h-3 mr-2" /> {t("badge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{t("description")}</p>
        </div>
        <div className="flex gap-2">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`h-2 w-8 rounded-full transition-colors ${
                completedSteps.includes(step.id) || idx === currentStep ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg border border-border">
                    {steps[currentStep].icon}
                  </div>
                  <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                </div>
                {completedSteps.includes(steps[currentStep].id) && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {t("completed")}
                  </Badge>
                )}
              </div>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-xl tracking-tight">{t("keyActions")}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">{stepProgress}%</span>
                    <Progress value={stepProgress} className="w-24 h-1.5" />
                  </div>
                </div>
                
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps[currentStep].items.map((item, idx) => {
                    const isChecked = checkedItems[steps[currentStep].id]?.includes(item);
                    return (
                      <li 
                        key={idx} 
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                          isChecked 
                            ? "bg-primary/5 border-primary/30 shadow-sm" 
                            : "bg-secondary/20 border-border/50 hover:border-primary/20"
                        )}
                        onClick={() => toggleItem(steps[currentStep].id, item)}
                      >
                        <Checkbox 
                          checked={isChecked} 
                          onCheckedChange={() => toggleItem(steps[currentStep].id, item)}
                          className="mt-0.5"
                        />
                        <span className={cn(
                          "text-sm font-medium leading-tight",
                          isChecked && "text-primary ml-1"
                        )}>{item}</span>
                      </li>
                    );
                  })}
                </ul>

                {(steps[currentStep] as any).resources && (
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
                    <div className="flex items-center gap-2">
                       <Info className="w-4 h-4 text-primary" />
                       <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">{t("resourcesTitle")}</h4>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {(steps[currentStep] as any).resources.map((res: any, idx: number) => (
                        <a 
                          key={idx}
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                        >
                          {res.name} <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(steps[currentStep] as any).hasChecker && (
                  <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-accent/10 rounded-lg">
                          <ShieldCheck className="w-5 h-5 text-accent" />
                       </div>
                       <div>
                          <p className="text-sm font-bold">{t("checkerPrompt")}</p>
                          <p className="text-xs text-muted-foreground">{t("checkerSub")}</p>
                       </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-accent/30 hover:bg-accent/10 text-accent font-bold rounded-full"
                      onClick={() => setShowChecker(true)}
                    >
                      {t("steps.dpiit.checker.launch")}
                    </Button>
                  </div>
                )}

                {steps[currentStep].url && (
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium">{t("portalReady")}</p>
                    <a 
                      href={steps[currentStep].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                    >
                      {t("officialPortal")} <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col border-t border-border/50 bg-secondary/10 px-0 py-0 overflow-hidden">
               <div className="bg-primary/5 w-full p-4 flex gap-3 text-xs border-b border-border/50">
                  <Badge className="h-5 px-1.5 bg-primary/20 text-primary border-none text-[10px] font-black uppercase">{t("founderTip")}</Badge>
                  <p className="text-muted-foreground leading-snug">
                    {steps[currentStep].tip}
                  </p>
               </div>
               <div className="w-full flex justify-between px-8 py-4">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep} 
                    disabled={currentStep === 0 || isUpdating}
                    className="rounded-full"
                  >
                    <ChevronLeft className="mr-2 w-4 h-4" /> {t("back")}
                  </Button>
                  <div className="flex items-center gap-4">
                    {isUpdating && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                    <Button 
                      onClick={nextStep}
                      disabled={isUpdating}
                      className="rounded-full px-8"
                    >
                      {currentStep === steps.length - 1 ? (
                        <span className="flex items-center">
                          {t("finish")} <CheckCircle2 className="ml-2 w-4 h-4" />
                        </span>
                      ) : (
                        <>{t("next")} <ChevronRight className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>
                  </div>
               </div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/20 flex gap-3 text-xs text-accent leading-relaxed">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <p>
          {t("disclaimer")}
        </p>
      </div>

      {/* DPIIT Eligibility Checker Modal */}
      <Dialog open={showChecker} onOpenChange={setShowChecker}>
        <DialogContent className="sm:max-w-[500px] border-accent/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-black text-accent flex items-center gap-2">
               <Zap className="w-6 h-6 fill-accent/20" /> {t("steps.dpiit.checker.title")}
            </DialogTitle>
            <DialogDescription>
              {t("steps.dpiit.checker.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-8">
             <div className="space-y-4">
                <Label className="text-base font-bold">{t("steps.dpiit.checker.q1")}</Label>
                <RadioGroup 
                  onValueChange={(v) => setCheckerAnswers(prev => ({...prev, entity: v}))}
                  className="grid grid-cols-1 gap-2"
                >
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="valid" id="e1" />
                      <Label htmlFor="e1" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q1_o1")}</Label>
                   </div>
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="invalid" id="e2" />
                      <Label htmlFor="e2" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q1_o2")}</Label>
                   </div>
                </RadioGroup>
             </div>

             <div className="space-y-4">
                <Label className="text-base font-bold">{t("steps.dpiit.checker.q2")}</Label>
                <RadioGroup 
                   onValueChange={(v) => setCheckerAnswers(prev => ({...prev, age: v}))}
                   className="grid grid-cols-1 gap-2"
                >
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="valid" id="a1" />
                      <Label htmlFor="a1" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q2_o1")}</Label>
                   </div>
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="invalid" id="a2" />
                      <Label htmlFor="a2" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q2_o2")}</Label>
                   </div>
                </RadioGroup>
             </div>

             <div className="space-y-4">
                <Label className="text-base font-bold">{t("steps.dpiit.checker.q3")}</Label>
                <RadioGroup 
                   onValueChange={(v) => setCheckerAnswers(prev => ({...prev, turnover: v}))}
                   className="grid grid-cols-1 gap-2"
                >
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="valid" id="t1" />
                      <Label htmlFor="t1" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q3_o1")}</Label>
                   </div>
                   <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="invalid" id="t2" />
                      <Label htmlFor="t2" className="flex-1 cursor-pointer">{t("steps.dpiit.checker.q3_o2")}</Label>
                   </div>
                </RadioGroup>
             </div>

             {checkerResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-xl border flex gap-3",
                    checkerResult.eligible 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" 
                      : "bg-rose-500/10 border-rose-500/30 text-rose-600"
                  )}
                >
                   {checkerResult.eligible ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                   <div>
                      <p className="font-black">{t("steps.dpiit.checker.result")} {checkerResult.eligible ? t("steps.dpiit.checker.eligible") : t("steps.dpiit.checker.notEligible")}</p>
                      <p className="text-sm opacity-90">{checkerResult.reason}</p>
                   </div>
                </motion.div>
             )}
          </div>

          <DialogFooter>
            {!checkerResult ? (
              <Button 
                onClick={() => {
                   const { entity, age, turnover } = checkerAnswers;
                   if (!entity || !age || !turnover) return;
                   
                   const isEligible = entity === 'valid' && age === 'valid' && turnover === 'valid';
                   setCheckerResult({
                      eligible: isEligible,
                      reason: isEligible 
                        ? t("steps.dpiit.checker.eligibleReason")
                        : t("steps.dpiit.checker.notEligibleReason")
                   });
                }}
                disabled={!checkerAnswers.entity || !checkerAnswers.age || !checkerAnswers.turnover}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold h-12"
              >
                {t("steps.dpiit.checker.cta")}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                   setShowChecker(false);
                   setCheckerResult(null);
                   setCheckerAnswers({});
                }} 
                className="w-full rounded-full"
              >
                {t("back")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
