"use client";

import { useState, useCallback } from "react";
import { 
  getTaskComments, addTaskComment, updateTaskStatus, 
  updateTaskPoW, createTask 
} from "../actions";
import { toast } from "sonner";
import { Task, TaskComment } from "./components/AssociateTypes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function useAssociateTasks(initialTasks: Task[], profileId: string) {
  const t = useTranslations("Associate");
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
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

  const handleCreateTask = async (newTask: {
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    due_date: string;
  }) => {
    const res = await createTask({
      ...newTask,
      assigned_to: profileId,
      assigned_by: profileId,
      status: 'pending'
    });

    if (res.success) {
      toast.success(t("toasts.taskCreated"));
      router.refresh();
    } else {
      toast.error(t("toasts.taskError"));
    }
  };

  const handleTaskStatus = async (taskId: string, status: Task['status']) => {
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

    const res = await updateTaskStatus(taskId, status);
    
    if (res.success) {
      toast.success(t("toasts.taskStatusSuccess", {
        status: t(`status.${status}`)
      }));
      router.refresh();
    } else {
      setTasks(previousTasks);
      toast.error(t("toasts.taskStatusError"));
    }
  };

  const handleUpdatePoW = async (taskId: string, proofOfWork: string) => {
    const res = await updateTaskPoW(taskId, proofOfWork);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { 
        ...t, 
        proof_of_work: proofOfWork,
        status: proofOfWork.trim().length > 0 ? 'pending_verification' : t.status 
      } : t));
      toast.success(t("toasts.powSuccess"));
      router.refresh();
    } else {
      toast.error(t("toasts.powError"));
    }
  };

  const handleUpdateBlocker = async (taskId: string, reason: string) => {
    // Import dynamically to avoid circular or missing dependencies if not in current file
    const { updateTaskBlocker } = await import("../actions");
    const res = await updateTaskBlocker(taskId, reason);
    if (res.success) {
      toast.success("Task marked as blocked. Mentor notified.");
      router.refresh();
    } else {
      toast.error("Failed to update blocker status.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedTask) return;
    setIsSubmittingComment(true);
    const res = await addTaskComment(selectedTask.id, profileId, newComment);
    if (res.success) {
      setNewComment("");
      await fetchComments(selectedTask.id);
      toast.success(t("toasts.commentSuccess"));
    } else {
      toast.error(t("toasts.commentError"));
    }
    setIsSubmittingComment(false);
  };

  const [isReflectionOpen, setIsReflectionOpen] = useState(false);

  const handleReflectionSubmit = async (data: { wins: string; challenges: string; satisfaction: number }) => {
    const { saveWeeklyReflection } = await import("../actions");
    const res = await saveWeeklyReflection({
      user_id: profileId,
      ...data
    });

    if (res.success) {
      toast.success("Reflection transmitted successfully. Mission data synchronized.");
      setIsReflectionOpen(false);
      router.refresh();
    } else {
      toast.error("Telemetry failure. Unable to save reflection.");
    }
  };

  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false);

  const handleLeaveSubmit = async (data: { type: string; start_date: string; end_date: string; reason: string }) => {
    const { requestLeave } = await import("../actions");
    const res = await requestLeave({
      user_id: profileId,
      ...data
    });

    if (res.success) {
      toast.success("Leave authorization request transmitted. Command review pending.");
      setIsLeaveRequestOpen(false);
      router.refresh();
    } else {
      toast.error("Telemetry failure. Unable to transmit leave request.");
    }
  };

  return {
    tasks,
    selectedTask,
    setSelectedTask,
    comments,
    newComment,
    setNewComment,
    isCommentsLoading,
    isSubmittingComment,
    isReflectionOpen,
    setIsReflectionOpen,
    isLeaveRequestOpen,
    setIsLeaveRequestOpen,
    handleSelectTask,
    handleCreateTask,
    handleTaskStatus,
    handleUpdatePoW,
    handleUpdateBlocker,
    handleReflectionSubmit,
    handleLeaveSubmit,
    handleAddComment
  };
}
