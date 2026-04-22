"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { getTaskComments, addTaskComment, updateTaskStatus } from "@/app/[locale]/internal/actions";
import { DashboardProfile } from "@/types/dashboard";
import { toast } from "sonner";
import { Task, AttendanceLog, OnboardingItem, TaskComment } from "./components/AssociateTypes";
import OperationalHero from "./components/OperationalHero";
import GrowthRoadmap from "./components/GrowthRoadmap";
import TacticalHub from "./components/TacticalHub";
import MentorInsights from "./components/MentorInsights";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

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
}

export function AssociateClient({ profile, initialTasks, initialAttendance, initialChecklist, mentor }: AssociateClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [attendance] = useState(initialAttendance);
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
            label: "View Feed",
            onClick: () => window.location.href = `/${profile.locale || 'en'}/internal/notifications`
          }
        });
      }
    };
    return () => eventSource.close();
  }, [profile.locale, profile.id]);

  const handleTaskStatus = async (taskId: string, status: Task['status']) => {
    const res = await updateTaskStatus(taskId, status);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success(`Task marked as ${status.replace('_', ' ')}`);
    } else {
      toast.error("Failed to update mission status.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    setIsSubmittingComment(true);
    const res = await addTaskComment(selectedTask.id, profile.id, newComment);
    if (res.success) {
      setNewComment("");
      await fetchComments(selectedTask.id);
    } else {
      toast.error("Failed to add comment.");
    }
    setIsSubmittingComment(false);
  };

  return (
    <AdminViewWrapper
      title={profile.role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " Lab"}
      subtitle="Industrial onboarding and tactical execution hub."
      badgeLabel="L1 PERSONNEL"
      authorityLevel="Training Tier"
    >
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <OperationalHero 
          fullName={profile.full_name || ''}
          profileId={profile.id}
          currentTime={currentTime}
          attendance={attendance}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <GrowthRoadmap 
            initialChecklist={initialChecklist}
          />

          <div className="space-y-8">
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
            />

            <MentorInsights mentor={mentor} />
          </div>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
