"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTaskComments, addTaskComment, updateTaskStatus } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { DashboardProfile } from "@/types/dashboard";
import { Task, AttendanceLog, TaskComment } from "./components/ManagerTypes";
import ManagerHeader from "./components/ManagerHeader";
import MissionBoard from "./components/MissionBoard";
import AttendanceMonitor from "./components/AttendanceMonitor";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { getRoleById, getCareerLevelMetadata } from "@/lib/constants/roles";

interface ManagerClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  team: DashboardProfile[];
}

export function ManagerClient({ profile, initialTasks, initialAttendance, team }: ManagerClientProps) {
  const router = useRouter();
  const [tasks] = useState(initialTasks);
  const [attendance] = useState(initialAttendance);

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

  const roleMetadata = getRoleById(profile.role);
  const careerMetadata = getCareerLevelMetadata(profile.role);

  return (
    <AdminViewWrapper
      title={roleMetadata.label + " Hub"}
      subtitle="Departmental coordination and personnel oversight."
      badgeLabel={roleMetadata.department?.toUpperCase() + " LEAD"}
      authorityLevel={`${careerMetadata?.level || 'L4'} ${careerMetadata?.title.split(' / ')[0] || 'Management'}`}
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <ManagerHeader
          department={profile.department || ''}
          profileId={profile.id}
          team={team}
          role={profile.role}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                toast.success("Task updated");
              }
            }}
          />

          <AttendanceMonitor
            attendance={attendance}
            department={profile.department}
          />
        </div>
      </div>
    </AdminViewWrapper>
  );
}
