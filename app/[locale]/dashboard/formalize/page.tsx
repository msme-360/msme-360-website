"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ShieldCheck, Globe, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useFormalization, FormalizeStep } from "./hooks/useFormalization";
import { FormalizeStepCard } from "./components/FormalizeStepCard";
import { EligibilityCheckerDialog } from "./components/EligibilityCheckerDialog";
import { cn } from "@/lib/utils";

export default function FormalizeWizard() {
  const t = useTranslations("FormalizationWizard");

  const steps = useMemo<FormalizeStep[]>(() => [
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
  ], [t]);

  const {
    currentStep,
    completedSteps,
    checkedItems,
    isLoading,
    isUpdating,
    showChecker,
    setShowChecker,
    checkerResult,
    checkerAnswers,
    setCheckerAnswers,
    nextStep,
    prevStep,
    toggleItem,
    runChecker,
    resetChecker,
    stepProgress
  } = useFormalization(steps);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-xl font-black font-display text-gradient tracking-tight">{t("syncing")}</p>
          <p className="text-sm text-muted-foreground font-medium italic">Establishing secure connection to Government Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div aria-label={t("title")} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="space-y-4">
          <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-4 py-1 font-black uppercase tracking-widest text-[10px]">
            <ClipboardList className="w-3.5 h-3.5 mr-2" /> {t("badge")}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-gradient leading-none">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-xl max-w-xl leading-relaxed font-medium">
            {t("description")}
          </p>
        </div>
        <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/5 rounded-2xl">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-2 w-10 rounded-xl transition-all duration-500",
                completedSteps.includes(step.id) 
                  ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                  : idx === currentStep 
                    ? "bg-primary w-16 shadow-glow" 
                    : "bg-white/5"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <FormalizeStepCard 
            step={steps[currentStep]}
            isCompleted={completedSteps.includes(steps[currentStep].id)}
            checkedItems={checkedItems[steps[currentStep].id] || []}
            onToggleItem={(item) => toggleItem(steps[currentStep].id, item)}
            onShowChecker={() => setShowChecker(true)}
            onPrev={prevStep}
            onNext={nextStep}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
            isUpdating={isUpdating}
            stepProgress={stepProgress}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 p-6 bg-accent/5 rounded-3xl border border-accent/20 flex gap-4 text-xs text-accent/80 leading-relaxed italic font-medium shadow-lg shadow-accent/5">
        <ShieldCheck className="w-6 h-6 shrink-0 opacity-60" />
        <p className="max-w-2xl">
          {t("disclaimer")}
        </p>
      </div>

      <EligibilityCheckerDialog 
        open={showChecker}
        onOpenChange={setShowChecker}
        answers={checkerAnswers}
        onAnswerChange={(key, val) => setCheckerAnswers(prev => ({...prev, [key]: val}))}
        result={checkerResult}
        onRun={runChecker}
        onReset={resetChecker}
      />
    </div>
  );
}
