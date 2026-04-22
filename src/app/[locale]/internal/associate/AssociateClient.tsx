"use client";

import { useState, useEffect, useCallback } from "react";
import { getTaskComments, addTaskComment, updateTaskStatus, updateTaskPoW } from "../actions";
import { DashboardProfile } from "@/types/dashboard";
import { toast } from "sonner";
import { Task, AttendanceLog, OnboardingItem, TaskComment } from "./components/AssociateTypes";
import OperationalHero from "./components/OperationalHero";
import GrowthRoadmap from "./components/GrowthRoadmap";
import TacticalHub from "./components/TacticalHub";
import MentorInsights from "./components/MentorInsights";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { useTranslations } from "next-intl";

interface AssociateClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  initialChecklist: OnboardingItem[];
  mentor: {
    full_name: string;
    avatar_url: string | null;
    designation: string;
    department: string;
  } | null;
  promotion?: {
    current_level: string;
    target_level: string;
    status: string;
  } | null;
  view?: 'roadmap' | 'hub';
}

export function AssociateClient({ profile, initialTasks, initialAttendance, initialChecklist, mentor, promotion, view }: AssociateClientProps) {
  const t = useTranslations("Associate");
  const [tasks, setTasks] = useState(initialTasks);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notifications') {
        const latest = data.data[0];
        toast.info(latest.title, {
          description: latest.content,
          action: {
            label: t("toasts.viewFeed"),
            onClick: () => window.location.href = `/${profile.locale || 'en'}/internal/notifications`
          }
        });
      }
    };
    return () => eventSource.close();
  }, [t, profile.locale, profile.id]);

  const handleTaskStatus = async (taskId: string, status: Task['status']) => {
    const res = await updateTaskStatus(taskId, status);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success(t("toasts.taskStatusSuccess", {
        status: t(`status.${status}`)
      }));
    } else {
      toast.error(t("toasts.taskStatusError"));
    }
  };

  const handleUpdatePoW = async (taskId: string, proofOfWork: string) => {
    const res = await updateTaskPoW(taskId, proofOfWork);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, proof_of_work: proofOfWork } : t));
      toast.success(t("toasts.powSuccess"));
    } else {
      toast.error(t("toasts.powError"));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    setIsSubmittingComment(true);
    const res = await addTaskComment(selectedTask.id, profile.id, newComment);
    if (res.success) {
      setNewComment("");
      await fetchComments(selectedTask.id);
      toast.success(t("toasts.commentSuccess"));
    } else {
      toast.error(t("toasts.commentError"));
    }
    setIsSubmittingComment(false);
  };

  const viewConfigs = {
    roadmap: {
      title: t("views.roadmap"),
      subtitle: t("labSubtitle")
    },
    hub: {
      title: t("views.hub"),
      subtitle: t("labSubtitle")
    },
    default: {
      title: t("labTitle"),
      subtitle: t("labSubtitle")
    }
  };

  const activeConfig = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  return (
    <AdminViewWrapper
      title={activeConfig.title}
      subtitle={activeConfig.subtitle}
      badgeLabel={t("labTitle")}
      authorityLevel={t("hero.tier")}
    >
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        {!view && (
          <OperationalHero
            fullName={profile.full_name || ''}
            profileId={profile.id}
            currentTime={currentTime}
            attendance={attendance}
            setAttendance={setAttendance}
            promotion={promotion}
          />
        )}

        <div className={view ? "max-w-4xl mx-auto w-full animate-in zoom-in-95 duration-500" : "grid grid-cols-1 lg:grid-cols-3 gap-10"}>
          {(!view || view === 'roadmap') && (
            <div className={view === 'roadmap' ? "w-full" : "lg:col-span-2"}>
              <GrowthRoadmap
                initialChecklist={initialChecklist}
                hideTitle={!!view}
              />
            </div>
          )}

          {(!view || view === 'hub') && (
            <div className={view === 'hub' ? "w-full space-y-8" : "space-y-8"}>
              <TacticalHub
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
                onTaskStatus={handleTaskStatus}
                onUpdatePoW={handleUpdatePoW}
                hideTitle={!!view}
              />

              <MentorInsights mentor={mentor} />
            </div>
          )}
        </div>
      </div>
    </AdminViewWrapper>
  );
}
