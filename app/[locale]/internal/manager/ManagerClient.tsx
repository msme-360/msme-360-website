"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
 import { 
  MessageSquare,
  ClipboardList,
  Plus,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  AlertCircle,
  Loader2,
  Send,
  User,
  LayoutDashboard,
  Download,
  FileSpreadsheet} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createTask, getTaskComments, addTaskComment } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { DashboardProfile } from "@/types/dashboard";

interface ManagerClientProps {
  profile: DashboardProfile;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_to_profile?: { full_name: string; avatar_url?: string };
}

interface AttendanceLog {
  user_id: string;
  check_in: string;
  check_out?: string;
  profiles?: { full_name: string; role: string };
}

interface TaskComment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: { full_name: string };
}

interface ManagerClientProps {
  profile: DashboardProfile;
  initialTasks: Task[];
  initialAttendance: AttendanceLog[];
  team: DashboardProfile[];
}

export function ManagerClient({ profile, initialTasks, initialAttendance, team }: ManagerClientProps) {
  const [tasks] = useState(initialTasks);
  const [attendance] = useState(initialAttendance);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading] = useState(false);
  
  // Comment state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTaskSubmitting, setIsTaskSubmitting] = useState(false);

  const fetchComments = React.useCallback(async (taskId: string) => {
    setIsCommentsLoading(true);
    const data = await getTaskComments(taskId);
    setComments(data as TaskComment[]);
    setIsCommentsLoading(false);
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    if (selectedTask) {
      Promise.resolve().then(() => {
        if (isMounted) fetchComments(selectedTask.id);
      });
    }
    return () => { isMounted = false; };
  }, [selectedTask, fetchComments]);

  // Real-time Notification Listener (SSE)
  React.useEffect(() => {
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

  // Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent',
    due_date: ''
  });

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assigned_to) {
      toast.error("Please fill in title and assignee.");
      return;
    }

    setIsTaskSubmitting(true);
    const res = await createTask({
      ...newTask,
      assigned_by: profile.id
    });

    if (res.success) {
      toast.success("Mission deployed successfully!");
      setIsDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'Medium',
        due_date: ''
      });
      // In a real app we'd re-fetch, but for this flow we assume the server state updates
      // and the page revalidation (or local state update if we had the new task object) takes over.
      window.location.reload(); // Simple way to refresh the task board
    } else {
      toast.error(res.error || "Failed to deploy mission.");
    }
    setIsTaskSubmitting(false);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Role", "Check In", "Check Out", "Duration"];
    const rows = attendance.map(log => [
      log.profiles?.full_name || "Unknown",
      log.profiles?.role || "N/A",
      format(new Date(log.check_in), "yyyy-MM-dd HH:mm:ss"),
      log.check_out ? format(new Date(log.check_out), "yyyy-MM-dd HH:mm:ss") : "Active",
      log.check_out ? `${Math.round((new Date(log.check_out).getTime() - new Date(log.check_in).getTime()) / 3600000)}h` : "N/A"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export initialized.");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Personnel Attendance Audit - ${format(new Date(), "MMMM dd, yyyy")}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Department: ${profile.department}`, 14, 22);

    const tableData = attendance.map(log => [
      log.profiles?.full_name || "Unknown",
      log.profiles?.role || "N/A",
      format(new Date(log.check_in), "yyyy-MM-dd HH:mm"),
      log.check_out ? format(new Date(log.check_out), "yyyy-MM-dd HH:mm") : "Active",
    ]);

    autoTable(doc, {
      head: [["Personnel", "Role", "Check In", "Check Out"]],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(`attendance_audit_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF Audit generated.");
  };

  const activeAttendance = attendance.filter(log => {
      const isToday = new Date(log.check_in).toDateString() === new Date().toDateString();
      return isToday && !log.check_out;
  });

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
      {/* Manager Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-emerald-950 p-10 border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-emerald-50 text-center md:text-left">
          <div className="space-y-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">
              Management Hub (L4 Specialist)
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Department Oversight: <span className="text-emerald-400">{profile?.department}</span>
            </h1>
            <p className="text-emerald-100/60 max-w-xl text-lg font-medium leading-relaxed">
              Coordinate team missions, track performance logs, and enforce industrial grade reliability standards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                   <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest flex items-center gap-3 shadow-glow transition-all hover:scale-105">
                      <Plus className="w-5 h-5" />
                      Assign Mission
                   </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 text-white max-w-md">
                   <DialogHeader>
                      <DialogTitle className="text-2xl font-display font-bold">New Tactical Mission</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-4 py-4">
                      <div className="space-y-2">
                         <Label>Objective Title</Label>
                         <Input 
                            value={newTask.title} 
                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                            placeholder="e.g. MicroAI Analysis" 
                            className="bg-white/5 border-white/10" 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label>Assign To Profile</Label>
                         <Select onValueChange={val => setNewTask({...newTask, assigned_to: val})}>
                            <SelectTrigger className="bg-white/5 border-white/10">
                               <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                               {team.filter(p => p.role === 'intern' || p.role === 'associate').map(p => (
                                 <SelectItem key={p.id} value={p.id}>{p.full_name} ({p.role})</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Priority</Label>
                           <Select onValueChange={val => setNewTask({...newTask, priority: val as 'Low' | 'Medium' | 'High' | 'Urgent'})}>
                              <SelectTrigger className="bg-white/5 border-white/10">
                                 <SelectValue placeholder="Medium" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-white">
                                 <SelectItem value="Low">Low</SelectItem>
                                 <SelectItem value="Medium">Medium</SelectItem>
                                 <SelectItem value="High">High</SelectItem>
                                 <SelectItem value="Urgent">Urgent</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label>Due Date</Label>
                           <Input 
                              type="date"
                              onChange={e => setNewTask({...newTask, due_date: e.target.value})}
                              className="bg-white/5 border-white/10" 
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                         <Label>Briefing / Description</Label>
                         <Textarea 
                            value={newTask.description}
                            onChange={e => setNewTask({...newTask, description: e.target.value})}
                            placeholder="Detailed instructions for the candidate..."
                            className="bg-white/5 border-white/10 min-h-[100px]"
                         />
                      </div>
                   </div>
                   <DialogFooter>
                      <Button 
                        onClick={handleCreateTask}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 font-bold uppercase tracking-widest"
                      >
                         {isTaskSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Deploy Mission"}
                      </Button>
                   </DialogFooter>
                </DialogContent>
             </Dialog>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mission Board */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-display font-bold flex items-center gap-3">
               <ClipboardList className="w-7 h-7 text-emerald-400" />
               Tactical Objective Board
             </h2>
             <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input placeholder="Filter missions..." className="pl-9 h-9 w-48 bg-white/5 border-white/10 rounded-lg text-xs" />
                </div>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 bg-white/5 hover:bg-white/10">
                   <Filter className="w-3.5 h-3.5" />
                   Filter
                </Button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="glass-card border-white/5 transition-all hover:border-emerald-500/20 group hover:shadow-xl hover:shadow-emerald-500/5 relative overflow-hidden cursor-pointer">
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
                                <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-emerald-400">{task.priority}</Badge>
                             </div>
                          </SheetHeader>
                          
                          <div className="space-y-6 pt-6 h-full flex flex-col">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-emerald-400">Briefing</Label>
                                <p className="text-sm text-indigo-100/60 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                   {task.description || "No mission description provided."}
                                </p>
                             </div>

                             <div className="flex-1 flex flex-col min-h-0">
                                <Label className="text-[10px] font-black uppercase text-emerald-400 mb-4">Feedback Relay (Comments)</Label>
                                <ScrollArea className="flex-1 pr-4">
                                   <div className="space-y-4">
                                      {isCommentsLoading ? (
                                         <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                                      ) : comments.map((c, i) => (
                                         <div key={i} className={`flex gap-3 ${c.user_id === profile.id ? 'flex-row-reverse' : ''}`}>
                                            <Avatar className="w-8 h-8 border border-white/10">
                                               <AvatarFallback className="bg-emerald-500/20 text-[10px] font-bold">
                                                  {c.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                                               </AvatarFallback>
                                            </Avatar>
                                            <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${c.user_id === profile.id ? 'bg-emerald-600' : 'bg-white/5'}`}>
                                               <p className="font-medium mb-1">{c.comment}</p>
                                               <div className="flex justify-between items-center gap-4">
                                                  <span className="text-[9px] opacity-40 font-bold">{c.profiles?.full_name}</span>
                                                  <span className="text-[8px] opacity-40">{format(new Date(c.created_at), "HH:mm")}</span>
                                               </div>
                                            </div>
                                         </div>
                                      ))}
                                   </div>
                                </ScrollArea>
                             </div>

                             <div className="pt-6 space-y-3">
                                <Textarea 
                                   placeholder="Transmit feedback or guidance..."
                                   className="bg-white/5 border-white/10 min-h-[100px] text-xs focus:ring-emerald-500 text-white"
                                   value={newComment}
                                   onChange={e => setNewComment(e.target.value)}
                                />
                                <Button 
                                   onClick={handleAddComment}
                                   disabled={isSubmittingComment}
                                   className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                   {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : "Transmit Feedback"}
                                   <Send className="w-3.5 h-3.5 ml-2" />
                                </Button>
                             </div>
                          </div>
                       </SheetContent>
                    </Sheet>
                    
                    <div className={`absolute top-0 right-0 w-12 h-12 -mr-6 -mt-6 blur-2xl ${
                      task.status === 'completed' ? 'bg-emerald-500/20' : 'bg-amber-500/10'
                    }`} />
                    <CardContent className="p-6 space-y-4 relative z-10 pointer-events-none">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-2">
                           <Badge variant="outline" className={`text-[8px] tracking-tighter ${
                             task.priority === 'Urgent' ? 'border-red-500/40 text-red-400' : 'border-emerald-500/20 text-emerald-400'
                           }`}>
                             {task.priority}
                           </Badge>
                           <Badge className="bg-white/5 text-[8px] uppercase tracking-widest">{task.status.replace('_', ' ')}</Badge>
                         </div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
                           <MoreVertical className="w-4 h-4" />
                         </Button>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{task.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed opacity-70">
                          {task.description || "No mission description provided."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 uppercase">
                               {task.assigned_to_profile?.full_name?.split(' ').map(n => n[0]).join('') || '??'}
                            </div>
                            <span className="text-[10px] font-bold text-white/60">{task.assigned_to_profile?.full_name}</span>
                         </div>
                         {task.due_date && (
                           <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(task.due_date), "MMM dd")}
                           </div>
                         )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <div className="col-span-full py-20 text-center glass-card border-white/5 rounded-[1.5rem]">
                 <AlertCircle className="w-12 h-12 text-white/5 mx-auto mb-4" />
                 <p className="text-muted-foreground font-medium">No missions deployed in this department.</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Monitor */}
        <div className="space-y-8">
           <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportCSV}
                      className="h-9 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400"
                    >
                       <FileSpreadsheet className="w-3.5 h-3.5" />
                       CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleExportPDF}
                      className="h-9 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400"
                    >
                       <Download className="w-3.5 h-3.5" />
                       PDF Audit
                    </Button>
                 </div>
                 <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none">
                   {activeAttendance.length} On-Site
                 </Badge>
              </div>
             
             <Card className="glass-card border-white/5 overflow-hidden">
                <div className="p-4 bg-emerald-500/5 border-b border-white/5">
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Participation Logs</p>
                </div>
                <div className="p-2 space-y-1">
                   {attendance.slice(0, 8).map((log, i) => (
                     <div key={i} className="flex justify-between items-center text-xs p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5">
                       <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${!log.check_out ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                         <div>
                           <p className="font-bold text-white/90">{log.profiles?.full_name}</p>
                           <p className="text-[10px] text-muted-foreground font-medium">{log.profiles?.role}</p>
                         </div>
                       </div>
                       <div className="text-right">
                         <div className="flex items-center gap-1.5 text-white/70 font-mono">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {format(new Date(log.check_in), "HH:mm")}
                         </div>
                         <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                            {log.check_out ? `Out: ${format(new Date(log.check_out), "HH:mm")}` : 'Active Session'}
                         </p>
                       </div>
                     </div>
                   ))}
                   {attendance.length === 0 && (
                     <p className="p-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest">No logs recorded today.</p>
                   )}
                </div>
                <div className="p-4 border-t border-white/5 bg-slate-900/40">
                   <Button variant="ghost" className="w-full text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest h-8 transition-all hover:bg-emerald-500/10">
                      View Audit Archives
                   </Button>
                </div>
             </Card>
           </section>

           <Card className="bg-emerald-500/5 border-emerald-500/20 overflow-hidden relative group">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                   <MessageSquare className="w-4 h-4 text-emerald-400" />
                   Team Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                 <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium">
                   Department synchronization is at **98%**. All Level 1 associates have completed their morning protocols. Ensure mission briefings are documented for audit compliance.
                 </p>
                 <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                    Start Weekly Sync
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
