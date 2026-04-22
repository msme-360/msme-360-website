"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getTaskComments, addTaskComment, updateTaskStatus } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { DashboardProfile } from "@/types/dashboard";
import { Task, AttendanceLog, TaskComment } from "./components/ManagerTypes";
import ManagerHeader from "./components/ManagerHeader";
import MissionBoard from "./components/MissionBoard";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { getRoleById, getCareerLevelMetadata } from "@/lib/constants/roles";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Activity, Users, Zap, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface SupervisoryClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  team: DashboardProfile[];
}

export function SupervisoryClient({ profile, initialTasks, team }: SupervisoryClientProps) {
  const t = useTranslations("Common.Supervisory");
  const tManager = useTranslations("Common.Manager");
  const router = useRouter();
  const [tasks] = useState(initialTasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = useCallback(async (taskId: string) => {
    setIsCommentsLoading(true);
    const data = await getTaskComments(taskId);
    setComments(data as TaskComment[]);
    setIsCommentsLoading(false);
  }, []);

  const handleSelectTask = useCallback(async (task: Task | null) => {
    setSelectedTask(task);
    if (task) {
      await fetchComments(task.id);
    } else {
      setComments([]);
    }
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    setIsSubmittingComment(true);
    const res = await addTaskComment(selectedTask.id, profile.id, newComment);
    if (res.success) {
      setNewComment("");
      await fetchComments(selectedTask.id);
    } else {
      toast.error(tManager("toasts.commentError"));
    }
    setIsSubmittingComment(false);
  };

  const roleMetadata = getRoleById(profile.role);
  const careerMetadata = getCareerLevelMetadata(profile.role);

  // Supervisory-specific metrics
  const activeTasks = tasks.filter(t => t.status === 'in_progress').length;
  const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
  const activeTeamCount = team.length;

  return (
    <AdminViewWrapper
      title={t("command", { role: roleMetadata.label })}
      subtitle={t("subtitle")}
      badgeLabel={t("lead")}
      authorityLevel={`${careerMetadata?.level || 'L3.5'} Supervisor`}
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <ManagerHeader
          department={profile.department || ''}
          profileId={profile.id}
          team={team}
          role={profile.role}
        />

        {/* Tactical Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card border-white/5 bg-white/5 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("metrics.activeOps")}</p>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-display font-bold">{activeTasks}</p>
              <p className="text-[10px] text-emerald-400 mt-1 font-bold">{t("metrics.liveMissions")}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 bg-white/5 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("metrics.teamSize")}</p>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-3xl font-display font-bold">{activeTeamCount}</p>
              <p className="text-[10px] text-indigo-400 mt-1 font-bold">{t("metrics.directPersonnel")}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 bg-white/5 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("metrics.blockers")}</p>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-display font-bold">{blockedTasks}</p>
              <p className="text-[10px] text-amber-400 mt-1 font-bold">{t("metrics.attentionRequired")}</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 bg-white/5 overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("metrics.efficiency")}</p>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-3xl font-display font-bold">92%</p>
              <p className="text-[10px] text-sky-400 mt-1 font-bold">{t("metrics.shiftThroughput")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <MissionBoard
              tasks={tasks}
              profile={profile}
              selectedTask={selectedTask}
              onTaskSelect={handleSelectTask}
              comments={comments}
              isCommentsLoading={isCommentsLoading}
              newComment={newComment}
              setNewComment={setNewComment}
              isSubmittingComment={isSubmittingComment}
              onAddComment={handleAddComment}
              onTaskStatus={async (taskId: string, status: Task['status']) => {
                const res = await updateTaskStatus(taskId, status);
                if (res.success) {
                  router.refresh();
                  toast.success(tManager("toasts.taskUpdated"));
                }
              }}
            />
          </div>

          <div className="space-y-6">
            <Card className="glass-card border-white/5 bg-white/5 p-6 rounded-2xl shadow-inner">
              <CardTitle className="text-sm font-bold flex items-center gap-2 mb-4 font-display uppercase tracking-widest text-indigo-400">
                <Activity className="w-4 h-4" />
                {t("feed.title")}
              </CardTitle>
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task, i) => (
                  <div key={i} className="flex gap-3 text-[11px] p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className={`w-1 h-full rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                    <div className="space-y-1">
                      <p className="font-bold text-indigo-100/80">{task.title}</p>
                      <p className="text-muted-foreground opacity-60">{t("feed.statusUpdate", { status: task.status.replace('_', ' ') })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
