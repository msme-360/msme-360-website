"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnboardingItem } from "./AssociateTypes";
import { updateChecklistItem } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";

interface GrowthRoadmapProps {
  initialChecklist: OnboardingItem[];
}

export default function GrowthRoadmap({ initialChecklist }: GrowthRoadmapProps) {
  const [checklist, setChecklist] = useState(initialChecklist);
  const completedCount = checklist.filter(i => i.is_completed).length;
  const totalCount = checklist.length;
  const progressValue = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleChecklist = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: newStatus } : item));
    const res = await updateChecklistItem(itemId, newStatus);
    if (!res.success) {
      toast.error("Failed to update checklist.");
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: currentStatus } : item));
    }
  };

  return (
    <div className="lg:col-span-2 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold flex items-center gap-3">
          <Target className="w-6 h-6 text-indigo-400" />
          Growth Roadmap
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
            Total Completion: {Math.round(progressValue)}%
          </span>
          <Progress value={progressValue} className="w-32 h-2 bg-indigo-500/10" />
        </div>
      </div>

      <div className="relative space-y-4">
        {checklist.length > 0 ? checklist.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className={`glass-card border-white/5 transition-all duration-300 cursor-pointer ${
                item.is_completed ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' : 'hover:border-indigo-500/30'
              }`}
              onClick={() => handleToggleChecklist(item.id, item.is_completed)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    item.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-white/20'
                  }`}>
                    {item.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${item.is_completed ? 'text-white/40 line-through' : 'text-white'}`}>
                      {item.item_text}
                    </p>
                    <Badge variant="outline" className="text-[8px] uppercase tracking-widest p-0 border-none opacity-40">
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )) : (
          <div className="p-8 text-center glass-card border-white/5 rounded-2xl opacity-40 italic text-xs">
            No checklist protocols initialized for this personnel tier.
          </div>
        )}
      </div>
    </div>
  );
}
