"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  GraduationCap,
  MessageSquare,
  Target,
  ArrowRight,
  Zap,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Send,
  User,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getTaskComments, 
  addTaskComment, 
  updateTaskStatus, 
  logAttendance, 
  updateChecklistItem 
} from "@/app/[locale]/internal/actions";
import { DashboardProfile } from "@/types/dashboard";
import { toast } from "sonner";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  due_date?: string;
  assigned_by_profile?: { full_name: string };
}

interface AttendanceLog {
  id: string;
  check_in: string;
  check_out: string | null;
}

interface OnboardingItem {
  id: string;
  item_text: string;
  is_completed: boolean;
  category: 'general' | 'technical' | 'administrative' | 'compliance';
}

interface TaskComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface AssociateClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  initialChecklist: OnboardingItem[];
}

export function AssociateClient({ profile, initialTasks, initialAttendance, initialChecklist }: AssociateClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Comment state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = React.useCallback(async (taskId: string) => {
    setIsCommentsLoading(true);
    const data = await getTaskComments(taskId);
    setComments(data as TaskComment[]);
    setIsCommentsLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (selectedTask) {
      Promise.resolve().then(() => {
        if (isMounted) fetchComments(selectedTask.id);
      });
    }
    return () => { isMounted = false; };
  }, [selectedTask, fetchComments]);

  // Real-time ticking clock for Career Launchpad
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time Notification Listener (SSE)
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
  }, [profile.locale]);

  const handleTaskStatus = async (taskId: string, status: Task['status']) => {
    setLoading(true);
    const res = await updateTaskStatus(taskId, status);
    if (res.success) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      toast.success(`Task marked as ${status.replace('_', ' ')}`);
    } else {
      toast.error("Failed to update mission status.");
    }
    setLoading(false);
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

  const todayLog = attendance.find(log => {
    const logDate = new Date(log.check_in).toDateString();
    const todayDate = new Date().toDateString();
    return logDate === todayDate;
  });

  const isCheckedIn = !!(todayLog && !todayLog.check_out);
  const hasFinishedDay = !!(todayLog && todayLog.check_out);

  const handleAttendance = async (type: 'in' | 'out') => {
    setLoading(true);
    const res = await logAttendance(profile.id, type);
    if (res.success) {
      toast.success(type === 'in' ? "Checked in successfully!" : "Checked out successfully!");
      // Optimization: we could re-fetch or just update local state if we knew the return data
      // For now, revalidation should handle most cases, but we'll manually update for instant feedback
      const now = new Date().toISOString();
      if (type === 'in') {
        setAttendance([{ id: 'temp', check_in: now, check_out: null }, ...attendance]);
      } else {
        setAttendance(prev => prev.map(log => log.id === todayLog?.id ? { ...log, check_out: now } : log));
      }
    } else {
      toast.error(res.error || "Attendance system failure.");
    }
    setLoading(false);
  };

  const handleToggleChecklist = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: newStatus } : item));
    const res = await updateChecklistItem(itemId, newStatus);
    if (!res.success) {
      toast.error("Failed to update checklist.");
      // Rollback
      setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, is_completed: currentStatus } : item));
    }
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
      {/* Premium Hero Section */}
      <section className="relative p-12 rounded-[2.5rem] bg-indigo-950/40 border border-indigo-500/20 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative flex-shrink-0">
             <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-glow border-2 border-indigo-400 group hover:rotate-6 transition-transform duration-500">
                <Rocket className="w-16 h-16 text-white" />
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Star className="w-5 h-5 fill-current" />
             </div>
          </div>
          
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
                 Career Launchpad Tier (L1)
              </Badge>
              <div className="flex items-center gap-2 text-indigo-300 font-mono text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <Clock className="w-3.5 h-3.5" />
                {format(currentTime, "HH:mm:ss")}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
               Welcome to the Mission, <span className="text-indigo-400">{profile?.full_name?.split(' ')[0]}</span>
            </h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
              <div className="flex items-center gap-3">
                 {hasFinishedDay ? (
                   <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                      Protocol Completed
                   </div>
                 ) : isCheckedIn ? (
                   <Button 
                    onClick={() => handleAttendance('out')}
                    disabled={loading}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Checkout"}
                   </Button>
                 ) : (
                   <Button 
                    onClick={() => handleAttendance('in')}
                    disabled={loading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-glow transition-all hover:scale-105 active:scale-95"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy to Site (Check-in)"}
                   </Button>
                 )}
              </div>
              
              <div className="h-12 w-px bg-white/10 hidden md:block" />
              
              <div className="text-left space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Shift Overview</p>
                 <div className="flex gap-4">
                    <div>
                       <p className="text-xs text-muted-foreground">In:</p>
                       <p className="text-sm font-bold text-white">{todayLog?.check_in ? format(new Date(todayLog.check_in), "HH:mm") : '--:--'}</p>
                    </div>
                    <div>
                       <p className="text-xs text-muted-foreground">Out:</p>
                       <p className="text-sm font-bold text-white">{todayLog?.check_out ? format(new Date(todayLog.check_out), "HH:mm") : '--:--'}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Growth Roadmap */}
        <div className="lg:col-span-2 space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                 <Target className="w-6 h-6 text-indigo-400" />
                 Growth Roadmap
              </h2>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Total Completion: 25%</span>
                 <Progress value={25} className="w-32 h-2 bg-indigo-500/10" />
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

        {/* Tactical Hub */}
        <div className="space-y-8">
           <Card className="glass-card border-white/10 overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 right-0 p-3">
                 <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 text-[8px]">ACTIVE OPS</Badge>
              </div>
              <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/10">
                 <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    Tactical Objectives
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5 scrollbar-hide">
                    <AnimatePresence initial={false}>
                      {tasks.map((task) => (
                        <motion.div 
                          key={task.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 hover:bg-white/[0.02] transition-all group relative cursor-pointer"
                        >
                           <Sheet onOpenChange={(open) => !open && setSelectedTask(null)}>
                              <SheetTrigger asChild>
                                 <div 
                                    className="absolute inset-0 z-0" 
                                    onClick={() => setSelectedTask(task)} 
                                 />
                              </SheetTrigger>
                              <SheetContent className="glass-card border-white/10 text-white w-[400px] sm:w-[540px]">
                                 <SheetHeader>
                                    <SheetTitle className="text-xl font-display font-bold">{task.title}</SheetTitle>
                                    <div className="flex gap-2 pb-4">
                                       <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">{task.status}</Badge>
                                       <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-indigo-400">{task.priority}</Badge>
                                    </div>
                                 </SheetHeader>
                                 
                                 <div className="space-y-6 pt-6 h-full flex flex-col">
                                    <div className="space-y-2">
                                       <Label className="text-[10px] font-black uppercase text-indigo-400">Briefing</Label>
                                       <p className="text-sm text-indigo-100/60 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                          {task.description || "No mission description provided."}
                                       </p>
                                    </div>

                                    <div className="flex-1 flex flex-col min-h-0">
                                       <Label className="text-[10px] font-black uppercase text-indigo-400 mb-4">Comms Relay (Comments)</Label>
                                       <ScrollArea className="flex-1 pr-4">
                                          <div className="space-y-4">
                                             {isCommentsLoading ? (
                                                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                             ) : comments.map((c, i) => (
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
                                             ))}
                                          </div>
                                       </ScrollArea>
                                    </div>

                                    <div className="pt-6 space-y-3">
                                       <Textarea 
                                          placeholder="Relay feedback or ask for guidance..."
                                          className="bg-white/5 border-white/10 min-h-[100px] text-xs focus:ring-indigo-500"
                                          value={newComment}
                                          onChange={e => setNewComment(e.target.value)}
                                       />
                                       <Button 
                                          onClick={handleAddComment}
                                          disabled={isSubmittingComment}
                                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all"
                                       >
                                          {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transmit Relay"}
                                          <Send className="w-3.5 h-3.5 ml-2" />
                                       </Button>
                                    </div>
                                 </div>
                              </SheetContent>
                           </Sheet>

                           <div className="flex justify-between items-start mb-2 relative z-10 pointer-events-none">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">
                                  {task.priority} Priority
                                </span>
                                {task.due_date && (
                                  <span className="text-[8px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {format(new Date(task.due_date), "MMM dd")}
                                  </span>
                                )}
                              </div>
                              <Badge variant="outline" className={`text-[8px] rounded-md transition-colors ${
                                task.status === 'completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 
                                task.status === 'in_progress' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' :
                                'border-white/10 text-muted-foreground'
                              }`}>
                                 {task.status.replace('_', ' ')}
                              </Badge>
                           </div>
                           
                           <div className="flex gap-3">
                             <Button 
                               size="icon" 
                               variant="ghost" 
                               onClick={() => handleTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                               className={`w-5 h-5 mt-0.5 rounded-full border transition-all ${
                                 task.status === 'completed' 
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
                                 Assigned by {task.assigned_by_profile?.full_name || 'Admin'}
                               </p>
                             </div>
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                 </div>
                 {tasks.length === 0 && (
                   <div className="p-12 text-center">
                     <AlertCircle className="w-8 h-8 text-white/10 mx-auto mb-2" />
                     <p className="text-xs text-muted-foreground">No objectives assigned.</p>
                   </div>
                 )}
                 <div className="p-4 bg-indigo-500/5 border-t border-indigo-500/10">
                    <Button variant="ghost" className="w-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/10 h-8 gap-2">
                       <MessageSquare className="w-3.5 h-3.5" />
                       Request New Mission
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 overflow-hidden relative group">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full transition-all group-hover:scale-150 duration-700" />
              <CardHeader>
                 <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    Mentor Insights
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs ring-4 ring-emerald-500/5">
                       SJ
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white">Sarah Jenkins</p>
                       <p className="text-[10px] text-emerald-400/60 uppercase font-black tracking-tighter">People & Culture Lead</p>
                    </div>
                 </div>
                 <p className="text-sm text-indigo-100/60 italic leading-relaxed font-medium">
                    &quot;Consistency is the industrial standard. Your participation logs define your reliability profile in our ecosystem.&quot;
                 </p>
                 <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-[10px] uppercase font-black tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Direct Comms
                    <ArrowRight className="w-3.5 h-3.5" />
                 </Button>
              </CardContent>
           </Card>
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
