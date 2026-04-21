"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { User, LayoutDashboard } from "lucide-react";
import { getTaskComments, addTaskComment, updateTaskStatus } from "@/app/[locale]/internal/actions";
import { DashboardProfile } from "@/types/dashboard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { Task, AttendanceLog, OnboardingItem, TaskComment } from "./components/AssociateTypes";
import OperationalHero from "./components/OperationalHero";
import GrowthRoadmap from "./components/GrowthRoadmap";
import TacticalHub from "./components/TacticalHub";
import MentorInsights from "./components/MentorInsights";

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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Associate Dashboard</h2>
          <p className="text-muted-foreground text-sm font-medium">Industrial onboarding and tactical execution hub.</p>
        </div>
        <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
          Personnel Tier: L1
        </Badge>
      </div>

      <Tabs defaultValue="operations" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="operations" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Operational Hub
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white">
            <User className="w-3.5 h-3.5" />
            Personnel Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-12 outline-none">
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
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <ProfileTabContent profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
