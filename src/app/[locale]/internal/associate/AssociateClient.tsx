



























"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { 
  getTaskComments, addTaskComment, updateTaskStatus, 
  updateTaskPoW, createTask 
} from "../actions";
import { DashboardProfile, DashboardMetric } from "@/types/dashboard";
import { toast } from "sonner";
import { Task, AttendanceLog, OnboardingItem, TaskComment } from "./components/AssociateTypes";
import OperationalHero from "./components/OperationalHero";
import GrowthRoadmap from "./components/GrowthRoadmap";
import TacticalHub from "./components/TacticalHub";
import MentorInsights from "./components/MentorInsights";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import PlannerBoard from "./components/PlannerBoard";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle 
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, LayoutDashboard, Zap, 
  Clock, CheckCircle2, 
  MessageSquare, Send, Loader2} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamic imports for role-specific feature panels
const InternOnboardingFlow = dynamic(() => import("@/components/roles/level-5-associates/intern/OnboardingFlow"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});
const JrDevLearningPath = dynamic(() => import("@/components/roles/level-5-associates/jr_developer/LearningPath"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});
const AssociateLaunchpad = dynamic(() => import("@/components/roles/level-5-associates/associate/AssociateLaunchpad"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});
const TraineeLaunchpad = dynamic(() => import("@/components/roles/level-5-associates/trainee/TraineeLaunchpad"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface AssociateClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  initialChecklist: OnboardingItem[];
  mentor: {
    id: string;
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
  view?: 'roadmap' | 'hub' | 'attendance' | 'planner';
  metrics: DashboardMetric[];
  performanceData: any;
  trendData: any;
}

export function AssociateClient({ 
  profile, 
  initialTasks, 
  initialAttendance, 
  initialChecklist, 
  mentor, 
  promotion, 
  view, 
  metrics: initialMetrics,
  performanceData,
  trendData
}: AssociateClientProps) {
  const t = useTranslations("Associate");
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Sync state with server-side props (crucial for revalidatePath)
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium" as const,
    due_date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    
    const res = await createTask({
      ...newTask,
      assigned_to: profile.id,
      assigned_by: profile.id, // Self-assigned for associates
      status: 'pending'
    });

    if (res.success) {
      toast.success(t("toasts.taskCreated"));
      setIsAddingTask(false);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        due_date: format(new Date(), "yyyy-MM-dd"),
      });
      router.refresh();
    } else {
      toast.error(t("toasts.taskError"));
    }
  };

  useEffect(() => {
    setAttendance(initialAttendance);
  }, [initialAttendance]);

  // --- Real Implementation: Dynamic Metrics Calculation ---
  const completedChecklist = initialChecklist.filter(item => item.is_completed).length;
  const totalChecklist = initialChecklist.length || 1;
  const onboardingProgress = Math.round((completedChecklist / totalChecklist) * 100);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length || 1;
  const learningVelocity = Math.round((completedTasks / totalTasks) * 100);

  const dynamicMetrics: DashboardMetric[] = [
    { label: "Onboarding Progress", value: `${onboardingProgress}%`, change: `+${onboardingProgress}%`, status: 'Optimal' },
    { label: "Learning Velocity", value: learningVelocity > 70 ? "High" : learningVelocity > 40 ? "Moderate" : "Stable", change: learningVelocity > 50 ? "Stable" : "Increasing", status: 'Optimal' },
    { label: "Tactical Output", value: completedTasks.toString(), change: "Active", status: 'Optimal' },
    { label: "Attendance Sync", value: `${Math.min(100, Math.round((attendance.length / 5) * 100))}%`, change: "Reliable", status: 'Optimal' }
  ];

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

  const handleTaskStatus = async (taskId: string, status: Task['status']) => {
    // Optimistic Update
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));

    const res = await updateTaskStatus(taskId, status);
    
    if (res.success) {
      toast.success(t("toasts.taskStatusSuccess", {
        status: t(`status.${status}`)
      }));
      router.refresh();
    } else {
      // Rollback on failure
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
        status: proofOfWork.trim().length > 0 ? 'completed' : t.status 
      } : t));
      toast.success(t("toasts.powSuccess"));
      router.refresh();
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

  const handleRequestMission = async () => {
    if (!mentor?.id) {
       toast.error("No mentor assigned to receive request.");
       return;
    }
    
    // Simulate notification creation/mission request logic
    toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
       loading: 'Transmitting tactical objective request to mentor...',
       success: 'Objective request queued. Mentor notified.',
       error: 'Transmission failure. Please retry.'
    });
  };

  const viewConfigs = {
    roadmap: { title: t("views.roadmap"), subtitle: t("labSubtitle") },
    hub: { title: t("views.hub"), subtitle: t("labSubtitle") },
    planner: { title: "Mission Planner", subtitle: "Full-scale tactical coordination board." },
    attendance: { title: "Attendance & Performance", subtitle: "Monitoring mission reliability and tactical velocity." },
    default: { title: profile.role.replace('_', ' ').toUpperCase() + " Launchpad", subtitle: t("labSubtitle") }
  };

  const currentView = viewConfigs[view as keyof typeof viewConfigs] || viewConfigs.default;

  return (
    <AdminViewWrapper
      title={currentView.title}
      subtitle={currentView.subtitle}
      badgeLabel={profile.role === 'intern' ? "Associate Lab" : "Staff Hub"}
      authorityLevel={profile.role === 'intern' ? "Career Launchpad Tier (L1)" : "Standard Execution (L2)"}
      actions={
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/10 h-9 gap-2 bg-indigo-500/5 border border-indigo-500/10 px-4"
            onClick={() => router.push(`${window.location.pathname}?view=${view === 'planner' ? 'hub' : 'planner'}`)}
          >
            <LayoutDashboard className="w-4 h-4" />
            {view === 'planner' ? 'List View' : 'Board View'}
          </Button>

          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl gap-2 h-9 px-4 shadow-lg shadow-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                <Plus className="w-4 h-4" />
                New Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-display font-bold">Initiate New Mission</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-white/50">Mission Title</Label>
                  <Input 
                    value={newTask.title}
                    onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Complete UI Hardening"
                    className="bg-white/5 border-white/10 h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-white/50">Briefing (Notes)</Label>
                  <Textarea 
                    value={newTask.description}
                    onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Operational details..."
                    className="bg-white/5 border-white/10 min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-white/50">Priority</Label>
                    <Select 
                      value={newTask.priority} 
                      onValueChange={(val: any) => setNewTask(prev => ({ ...prev, priority: val }))}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-white/50">Due Date</Label>
                    <Input 
                      type="date"
                      value={newTask.due_date}
                      onChange={e => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim()}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 h-11 text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                >
                  Launch Mission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        {!view && (
          <>
            <OperationalHero
              profile={profile}
              currentTime={currentTime}
              attendance={attendance}
              setAttendance={setAttendance}
              promotion={promotion}
              roleName={profile.role.replace("_", " ").toUpperCase()}
            />

            <Suspense fallback={<Skeleton className="h-64 w-full rounded-3xl" />}>
              {profile.role === 'intern' && <InternOnboardingFlow metrics={dynamicMetrics} />}
              {profile.role === 'jr_developer' && <JrDevLearningPath metrics={dynamicMetrics} />}
              {profile.role === 'associate' && <AssociateLaunchpad metrics={dynamicMetrics} />}
              {profile.role === 'trainee' && <TraineeLaunchpad metrics={dynamicMetrics} />}
            </Suspense>
          </>
        )}

        {view === 'attendance' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-3xl border-white/5">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    Attendance History
                  </h3>
                  <div className="space-y-4">
                    {attendance.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{format(new Date(log.check_in), "EEEE, MMM do")}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Tactical Shift</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono text-indigo-300">
                            {format(new Date(log.check_in), "HH:mm")} - {log.check_out ? format(new Date(log.check_out), "HH:mm") : "Active"}
                          </p>
                        </div>
                      </div>
                    ))}
                    {attendance.length === 0 && (
                      <p className="text-center py-10 text-muted-foreground text-sm">No attendance logs found.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="glass-card p-6 rounded-3xl border-white/5 bg-emerald-500/5">
                        <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Consistency</p>
                        <p className="text-3xl font-bold">{performanceData?.attendanceStats?.consistency || 0}%</p>
                     </div>
                     <div className="glass-card p-6 rounded-3xl border-white/5 bg-indigo-500/5">
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">Reliability</p>
                        <p className="text-3xl font-bold">Tier A</p>
                     </div>
                  </div>
                  
                  <div className="glass-card p-8 rounded-3xl border-white/5">
                    <h4 className="text-sm font-bold mb-4 uppercase tracking-widest text-muted-foreground">Velocity Insights</h4>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Task Completion</span>
                          <span className="text-sm font-bold">{performanceData?.taskStats?.completion_rate || 0}%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${performanceData?.taskStats?.completion_rate || 0}%` }} />
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {view === 'planner' && (
          <div className="w-full animate-in zoom-in-95 duration-500">
            <PlannerBoard 
              tasks={tasks}
              profile={profile}
              onTaskStatus={handleTaskStatus}
              onTaskSelect={handleSelectTask}
            />
          </div>
        )}

        <div className={(view && view !== 'planner') ? "max-w-4xl mx-auto w-full animate-in zoom-in-95 duration-500" : (view === 'planner' ? "hidden" : "grid grid-cols-1 lg:grid-cols-3 gap-10")}>
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
                onRequestMission={handleRequestMission}
                hideTitle={!!view}
              />

              <MentorInsights mentor={mentor} />
            </div>
          )}
        </div>
      </div>
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="glass-card border-white/10 text-white w-[400px] sm:w-[550px] px-6">
          <SheetHeader className="border-b border-white/5">
            <SheetTitle className="text-xl font-display font-bold">{selectedTask?.title}</SheetTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{selectedTask ? t(`status.${selectedTask.status?.toLowerCase()}`) : ""}</Badge>
              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-indigo-400">{selectedTask ? t(`priority.${selectedTask.priority?.toLowerCase()}`) : ""}</Badge>
            </div>
          </SheetHeader>

          <div className="space-y-10 pb-12 pt-8">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" />
                {t("hub.briefing")}
              </Label>
              <p className="text-sm text-indigo-100/70 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
                {selectedTask?.description || t("hub.noBriefing")}
              </p>
            </div>

            <div className="space-y-5">
              <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3 h-3" />
                {t("hub.commsRelay")}
              </Label>
              <ScrollArea className="max-h-[120px] pr-4 overflow-y-auto ">
                <div className="space-y-4">
                  {isCommentsLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                  ) : comments.length > 0 ? comments.map((c, i) => (
                    <div key={i} className={`flex gap-3 ${c.user_id === profile.id ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8 border border-white/10">
                        <AvatarFallback className="bg-indigo-500/20 text-[10px] font-bold">
                          {c.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${c.user_id === profile.id ? 'bg-indigo-600' : 'bg-white/5'}`}>
                        <p className="font-medium mb-1">{c.comment}</p>
                        <p className="text-[8px] opacity-40">{format(new Date(c.created_at), "HH:mm")}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-[10px] text-center py-6 text-white/20 italic">{t("hub.noRelayHistory")}</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-8 pt-8 border-t border-white/10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  {t("hub.pow")}
                </Label>
                <div className="flex gap-2">
                  <input
                    placeholder={t("hub.placeholders.pow")}
                    defaultValue={selectedTask?.proof_of_work || ""}
                    className="flex-1 h-10 bg-white/5 border-white/10 rounded-xl px-4 text-xs focus:ring-emerald-500 text-white"
                    id={`pow-${selectedTask?.id}`}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!selectedTask) return;
                      const input = document.getElementById(`pow-${selectedTask.id}`) as HTMLInputElement;
                      handleUpdatePoW(selectedTask.id, input.value);
                    }}
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 h-10 px-4"
                  >
                    {t("hub.submit")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{t("hub.relayLabel")}</Label>
                <Textarea
                  placeholder={t("hub.relayPlaceholder")}
                  className="bg-white/5 border-white/10 min-h-[80px] text-xs focus:ring-indigo-500 rounded-xl"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={isSubmittingComment}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : t("hub.transmitRelay")}
                  <Send className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AdminViewWrapper>
  );
}
