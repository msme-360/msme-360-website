
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Zap, Calendar, CheckCircle2, MessageSquare,
  Clock} from "lucide-react";
import { format } from "date-fns";
import { Task, TaskComment } from "./AssociateTypes";
import { useTranslations } from "next-intl";
import { DashboardProfile } from "@/types/dashboard";

interface TacticalHubProps {
  tasks: Task[];
  profile: DashboardProfile;
  selectedTask: Task | null;
  onTaskSelect: (task: Task | null) => void;
  comments: TaskComment[];
  isCommentsLoading: boolean;
  newComment: string;
  setNewComment: (c: string) => void;
  isSubmittingComment: boolean;
  onAddComment: () => void;
  onTaskStatus: (taskId: string, status: Task['status']) => void;
  onUpdatePoW: (taskId: string, proofOfWork: string) => void;
  onRequestMission?: () => void;
  hideTitle?: boolean;
}

export default function TacticalHub({
  tasks,
  onTaskSelect,
  onTaskStatus,
  onRequestMission,
  hideTitle
}: TacticalHubProps) {
  const t = useTranslations("Associate");

  return (
    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl relative">
      {!hideTitle && (
        <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/10 flex flex-row items-center justify-between py-4">
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            {t("hub.title")}
          </CardTitle>
          <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-[8px]">{t("hub.activeOps")}</Badge>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5 scrollbar-hide">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => onTaskSelect(task)}
                className="p-5 hover:bg-white/[0.02] transition-all group relative cursor-pointer"
              >

                <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                      {t("priority.label", { value: t(`priority.${task.priority?.toLowerCase()}`) })}
                    </span>
                    {task.due_date && (
                      <span className="text-[8px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {format(new Date(task.due_date), "MMM dd")}
                      </span>
                    )}
                  </div>
                  <Badge variant="outline" className={`text-[8px] rounded-md transition-colors ${task.status === 'completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                    task.status === 'in_progress' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                      'border-white/10 text-muted-foreground'
                    }`}>
                    {t(`status.${task.status?.toLowerCase()}`)}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                    className={`w-5 h-5 mt-0.5 rounded-full border transition-all ${task.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-white/20 hover:border-emerald-500/50'
                      }`}
                  >
                    {task.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold transition-all duration-300 truncate ${task.status === 'completed' ? 'text-white/40 line-through' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate opacity-60">
                      {t("hub.assignedBy", { name: task.assigned_by_profile?.full_name || 'Admin' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {tasks.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-white/10 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{t("hub.noObjectives")}</p>
          </div>
        )}
        <div className="p-4 bg-indigo-500/5 border-t border-indigo-500/10">
          <Button
            variant="ghost"
            onClick={onRequestMission}
            className="w-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/10 h-8 gap-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {t("hub.requestMission")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
