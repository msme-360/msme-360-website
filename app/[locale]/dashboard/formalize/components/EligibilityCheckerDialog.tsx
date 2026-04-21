"use client";

import { motion } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface EligibilityCheckerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answers: Record<string, string>;
  onAnswerChange: (key: string, value: string) => void;
  result: { eligible: boolean, reason?: string } | null;
  onRun: () => void;
  onReset: () => void;
}

export function EligibilityCheckerDialog({
  open,
  onOpenChange,
  answers,
  onAnswerChange,
  result,
  onRun,
  onReset
}: EligibilityCheckerDialogProps) {
  const t = useTranslations("FormalizationWizard");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-accent/20 bg-popover/95 backdrop-blur-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-black text-accent flex items-center gap-2">
             <Zap className="w-6 h-6 fill-accent/20" /> {t("steps.dpiit.checker.title")}
          </DialogTitle>
          <DialogDescription className="font-medium">
            {t("steps.dpiit.checker.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
           {[
             { id: "entity", q: t("steps.dpiit.checker.q1"), o1: t("steps.dpiit.checker.q1_o1"), o2: t("steps.dpiit.checker.q1_o2") },
             { id: "age", q: t("steps.dpiit.checker.q2"), o1: t("steps.dpiit.checker.q2_o1"), o2: t("steps.dpiit.checker.q2_o2") },
             { id: "turnover", q: t("steps.dpiit.checker.q3"), o1: t("steps.dpiit.checker.q3_o1"), o2: t("steps.dpiit.checker.q3_o2") },
           ].map((quiz) => (
             <div className="space-y-4" key={quiz.id}>
                <Label className="text-base font-bold tracking-tight text-foreground/90">{quiz.q}</Label>
                <RadioGroup 
                  onValueChange={(v) => onAnswerChange(quiz.id, v)}
                  className="grid grid-cols-1 gap-3"
                  value={answers[quiz.id]}
                >
                   <div className={cn(
                     "flex items-center space-x-2 p-4 rounded-2xl border transition-all cursor-pointer",
                     answers[quiz.id] === "valid" ? "bg-accent/5 border-accent/30 shadow-sm" : "border-white/5 hover:bg-white/5"
                   )}>
                      <RadioGroupItem value="valid" id={`${quiz.id}-v`} />
                      <Label htmlFor={`${quiz.id}-v`} className="flex-1 cursor-pointer font-semibold">{quiz.o1}</Label>
                   </div>
                   <div className={cn(
                     "flex items-center space-x-2 p-4 rounded-2xl border transition-all cursor-pointer",
                     answers[quiz.id] === "invalid" ? "bg-rose-500/5 border-rose-500/30" : "border-white/5 hover:bg-white/5"
                   )}>
                      <RadioGroupItem value="invalid" id={`${quiz.id}-i`} />
                      <Label htmlFor={`${quiz.id}-i`} className="flex-1 cursor-pointer font-semibold opacity-60">{quiz.o2}</Label>
                   </div>
                </RadioGroup>
             </div>
           ))}

           {result && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "p-5 rounded-2xl border flex gap-4 shadow-lg",
                  result.eligible 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 shadow-emerald-500/5" 
                    : "bg-rose-500/10 border-rose-500/30 text-rose-600 shadow-rose-500/5"
                )}
              >
                 {result.eligible ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />}
                 <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-[10px] opacity-60">{t("steps.dpiit.checker.result")}</p>
                    <p className="font-bold text-lg leading-tight">{result.eligible ? t("steps.dpiit.checker.eligible") : t("steps.dpiit.checker.notEligible")}</p>
                    <p className="text-sm font-medium opacity-90 leading-relaxed italic">{result.reason}</p>
                 </div>
              </motion.div>
           )}
        </div>

        <DialogFooter>
          {!result ? (
            <Button 
              onClick={onRun}
              disabled={!answers.entity || !answers.age || !answers.turnover}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-black h-12 uppercase tracking-widest shadow-lg shadow-accent/20"
            >
              {t("steps.dpiit.checker.cta")}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onReset} 
              className="w-full rounded-2xl font-bold h-12"
            >
              {t("back")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
