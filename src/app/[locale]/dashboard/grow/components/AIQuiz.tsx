"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface AIReadinessQuizProps {
   raw: (key: string) => { text: string; options: string[] }[];
}

export default function AIReadinessQuiz({ raw }: AIReadinessQuizProps) {
   const t = useTranslations("MicroAIHub");
   const [step, setStep] = useState<"intro" | "questions" | "result">("intro");
   const [currentQ, setCurrentQ] = useState(0);
   const [answers, setAnswers] = useState<number[]>([]);

   const questions = useMemo(() => raw("quiz.questions"), [raw]);

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
      if (avg < 0.8) return t("quiz.levels.beginner");
      if (avg < 1.6) return t("quiz.levels.intermediate");
      return t("quiz.levels.expert");
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
                     <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{t("quiz.badge")}</Badge>
                     <h3 className="text-3xl font-black tracking-tight">{t("quiz.title")}</h3>
                     <p className="text-muted-foreground">{t("quiz.subtitle")}</p>
                     <Button onClick={handleStart} className="rounded-full px-10 shadow-glow bg-primary h-12 text-lg font-bold">
                        {t("quiz.start")}
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t("quiz.step", { current: currentQ + 1, total: questions.length })}</p>
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
                        <p className="text-xs font-black uppercase tracking-widest opacity-60">{t("quiz.resultTitle")}</p>
                        <h3 className="text-4xl font-black text-emerald-500 tracking-tighter">{getReadinessLevel()}</h3>
                     </div>
                     <Button variant="outline" className="rounded-xl border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10" onClick={() => {
                        setStep("intro");
                        setCurrentQ(0);
                        setAnswers([]);
                     }}>
                        <RotateCcw className="w-4 h-4 mr-2" /> {t("quiz.reset")}
                     </Button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </Card>
   );
}
