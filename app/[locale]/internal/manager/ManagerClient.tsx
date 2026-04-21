"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { User, LayoutDashboard } from "lucide-react";
import { getTaskComments, addTaskComment, updateTaskStatus } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { DashboardProfile } from "@/types/dashboard";
import { Task, AttendanceLog, TaskComment } from "./components/ManagerTypes";
import ManagerHeader from "./components/ManagerHeader";
import MissionBoard from "./components/MissionBoard";
import AttendanceMonitor from "./components/AttendanceMonitor";

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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Manager Hub</h2>
          <p className="text-muted-foreground text-sm font-medium">Departmental coordination and personnel oversight.</p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
          Authority Level: L4
        </Badge>
      </div>

      <Tabs defaultValue="management" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="management" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Department Oversight
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <User className="w-3.5 h-3.5" />
            Operational Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-10 outline-none">
          <ManagerHeader
            department={profile.department || ''}
            profileId={profile.id}
            team={team}
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
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <ProfileTabContent profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
