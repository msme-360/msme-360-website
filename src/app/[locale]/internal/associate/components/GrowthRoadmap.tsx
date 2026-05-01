"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnboardingItem } from "./AssociateTypes";
import { updateChecklistItem } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GrowthRoadmapProps {
  initialChecklist: OnboardingItem[];
  hideTitle?: boolean;
}

export default function GrowthRoadmap({ initialChecklist, hideTitle }: GrowthRoadmapProps) {
  const t = useTranslations("Associate.roadmap");

  const [checklist, setChecklist] = useState(initialChecklist);
  const completedCount = checklist.filter(i => i.is_completed).length;
  const totalCount = checklist.length;
  const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Group items by category
  const categories = Array.from(new Set(checklist.map(item => item.category)));
  const groupedChecklist = categories.map(category => ({
    name: category,
    items: checklist.filter(item => item.category === category),
    progress: Math.round((checklist.filter(item => item.category === category && item.is_completed).length / 
                checklist.filter(item => item.category === category).length) * 100)
  }));

  const handleToggleChecklist = async (itemId: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling when clicking the checkbox
    const newStatus = !currentStatus;
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: newStatus } : item));
    const res = await updateChecklistItem(itemId, newStatus);
    if (!res.success) {
      toast.error(t("failure"));
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: currentStatus } : item));
    }
  };

  return (
    <div className="space-y-10">
      {!hideTitle ? (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-400" />
            {t("title")}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
              {t("completion", { value: Math.round(progressValue) })}
            </span>
            <Progress value={progressValue} className="w-32 h-2 bg-indigo-500/10" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-4 bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
            {t("overallProgress")}
          </span>
          <Progress value={progressValue} className="w-48 h-2 bg-indigo-500/10" />
          <Badge variant="outline" className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 text-[10px] font-black italic px-3 py-1">
            {Math.round(progressValue)}%
          </Badge>
        </div>
      )}

      <div className="relative">
        <Accordion type="single" collapsible className="space-y-4">
          {groupedChecklist.length > 0 ? groupedChecklist.map((group, i) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={group.name} className="border-none">
                <Card className={`glass-card border-white/5 transition-all duration-300 overflow-hidden ${
                  group.progress === 100 ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'hover:border-indigo-500/30'
                }`}>
                  <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex items-center gap-6 w-full text-left">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                        group.progress === 100 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      }`}>
                        <span className="text-xs font-black">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black uppercase tracking-widest mb-1">{group.name}</p>
                        <div className="flex items-center gap-3">
                          <Progress value={group.progress} className="h-1 flex-1 bg-white/5" />
                          <span className="text-[10px] font-bold opacity-40">{group.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 border-t border-white/5">
                    <div className="divide-y divide-white/5">
                      {group.items.map((item) => (
                        <div 
                          key={item.id}
                          onClick={(e) => handleToggleChecklist(item.id, item.is_completed, e)}
                          className="p-5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              item.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                            }`}>
                              {item.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <p className={`text-xs font-medium ${item.is_completed ? 'text-white/40 line-through' : 'text-white/80'}`}>
                              {item.item_text}
                            </p>
                          </div>
                          {item.is_completed && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[8px] uppercase tracking-tighter">
                              Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </motion.div>
          )) : (
            <div className="p-8 text-center glass-card border-white/5 rounded-2xl opacity-40 italic text-xs">
              {t("emptyStates.checklist")}
            </div>
          )}
        </Accordion>
      </div>
    </div>
  );
}
