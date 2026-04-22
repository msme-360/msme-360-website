"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Info,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FormalizeStep } from "../hooks/useFormalization";

interface FormalizeStepCardProps {
  step: FormalizeStep;
  isCompleted: boolean;
  checkedItems: string[];
  onToggleItem: (item: string) => void;
  onShowChecker: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  isUpdating: boolean;
  stepProgress: number;
}

export function FormalizeStepCard({
  step,
  isCompleted,
  checkedItems,
  onToggleItem,
  onShowChecker,
  onPrev,
  onNext,
  isFirst,
  isLast,
  isUpdating,
  stepProgress
}: FormalizeStepCardProps) {
  const t = useTranslations("FormalizationWizard");

  return (
    <Card className="border-white/10 shadow-2xl bg-white/[0.01] backdrop-blur-sm overflow-hidden rounded-3xl">
      <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded-2xl border border-white/10 shadow-inner group-hover:border-primary/50 transition-colors">
              {step.icon}
            </div>
            <CardTitle className="text-3xl font-black font-display tracking-tight text-white/90">{step.title}</CardTitle>
          </div>
          {isCompleted && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 px-3 py-1 font-black uppercase tracking-widest text-[10px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t("completed")}
            </Badge>
          )}
        </div>
        <CardDescription className="text-lg font-medium leading-relaxed max-w-2xl">{step.description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-8 px-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl tracking-tight uppercase opacity-40">{t("keyActions")}</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-primary tracking-tighter">{stepProgress}%</span>
              <Progress value={stepProgress} className="w-32 h-1.5 bg-white/5 shadow-inner" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {step.items.map((item, idx) => {
              const checked = checkedItems.includes(item);
              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 cursor-pointer",
                    checked
                      ? "bg-primary/5 border-primary/30 shadow-lg shadow-primary/5"
                      : "bg-white/[0.02] border-white/5 hover:border-primary/20"
                  )}
                  onClick={() => onToggleItem(item)}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => onToggleItem(item)}
                    className={cn("mt-1.5 rounded-md border-2", checked ? "bg-primary border-primary" : "border-white/20")}
                  />
                  <span className={cn(
                    "text-sm font-bold leading-relaxed",
                    checked ? "text-primary tracking-tight" : "text-muted-foreground/80"
                  )}>{item}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {step.resources.length > 0 && (
              <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("resourcesTitle")}</h4>
                </div>
                <div className="flex flex-col gap-2">
                  {step.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary/80 hover:text-primary transition-colors font-bold text-sm"
                    >
                      {res.name} <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {step.hasChecker && (
              <div className="p-6 bg-accent/5 rounded-3xl border border-accent/20 flex flex-col justify-between gap-6 shadow-lg shadow-accent/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-2xl shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-tight text-accent/90">{t("checkerPrompt")}</p>
                    <p className="text-xs font-semibold text-muted-foreground">{t("checkerSub")}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-accent/40 hover:bg-accent/10 text-accent font-black uppercase tracking-widest text-[10px] rounded-xl h-11 shadow-inner"
                  onClick={onShowChecker}
                >
                  <Zap className="w-3 h-3 mr-2" /> {t("steps.dpiit.checker.launch")}
                </Button>
              </div>
            )}

            {step.url && !step.hasChecker && (
              <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20 flex flex-col justify-between gap-6 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold leading-tight">{t("portalReady")}</p>
                </div>
                <a
                  href={step.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  {t("officialPortal")} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-white/5 bg-white/[0.01] px-0 pb-0 mt-8 group overflow-hidden">
        <div className="bg-primary/5 w-full p-5 flex gap-4 text-xs border-b border-white/5 group-hover:bg-primary/10 transition-colors">
          <div className="flex-shrink-0">
            <Badge className="h-6 px-2 bg-primary/20 text-primary border-none text-[10px] font-black uppercase tracking-widest">
              {t("founderTip")}
            </Badge>
          </div>
          <p className="text-muted-foreground leading-relaxed italic font-medium">
            &ldquo;{step.tip}&rdquo;
          </p>
        </div>
        <div className="w-full flex justify-between p-8 bg-white/[0.01]">
          <Button
            variant="ghost"
            onClick={onPrev}
            disabled={isFirst || isUpdating}
            className="rounded-xl h-12 px-6 font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> {t("back")}
          </Button>
          <div className="flex items-center gap-4">
            <Button
              onClick={onNext}
              disabled={isUpdating}
              className="rounded-2xl h-12 px-10 font-black uppercase tracking-widest shadow-glow"
            >
              {isLast ? (
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
  );
}
