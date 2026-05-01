"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   ClipboardList, Search, Filter, MoreVertical,
   Calendar, Loader2, Send, Plus, User, 
   Clock, AlertCircle, CheckCircle2,
   Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Task, TaskComment } from "./ManagerTypes";
import { DashboardProfile } from "@/types/dashboard";
import { toast } from "sonner";
import { createTask } from "@/app/[locale]/internal/actions";

interface MissionBoardProps {
   tasks: Task[];
   profile: DashboardProfile;
   team: DashboardProfile[];
   selectedTask: Task | null;
   onTaskSelect: (task: Task | null) => void;
   comments: TaskComment[];
   isCommentsLoading: boolean;
   newComment: string;
   setNewComment: (c: string) => void;
   isSubmittingComment: boolean;
   onAddComment: () => void;
   onTaskStatus: (taskId: string, status: Task['status']) => void;
   onRefresh?: () => void;
}

export default function MissionBoard({
   tasks,
   profile,
   team,
   onTaskSelect,
   comments,
   isCommentsLoading,
   newComment,
   setNewComment,
   isSubmittingComment,
   onAddComment,
   onTaskStatus,
   onRefresh 
}: MissionBoardProps) {
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      assigned_to: "",
      priority: "Medium" as const,
      due_date: ""
   });

   const handleCreateTask = async () => {
      if (!formData.title || !formData.assigned_to) {
         toast.error("Please fill in the objective and assignee.");
         return;
      }

      setIsSubmitting(true);
      const res = await createTask({
         ...formData,
         assigned_by: profile.id,
         status: 'pending'
      });

      if (res.success) {
         toast.success("Mission deployed successfully!");
         setIsCreateModalOpen(false);
         setFormData({ title: "", description: "", assigned_to: "", priority: "Medium", due_date: "" });
         if (onRefresh) onRefresh();
      } else {
         toast.error(res.error || "Failed to deploy mission.");
      }
      setIsSubmitting(false);
   };

   return (
      <div className="lg:col-span-2 space-y-8">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
               <ClipboardList className="w-7 h-7 text-emerald-400" />
               Tactical Objective Board
            </h2>
            <div className="flex items-center gap-3">
               <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                     <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 gap-2">
                        <Plus className="w-4 h-4" />
                        Deploy Mission
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-white/10 text-white max-w-lg">
                     <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                           <Zap className="w-5 h-5 text-emerald-400" />
                           Deploy New Mission
                        </DialogTitle>
                        <DialogDescription className="text-white/40">
                           Assign a new tactical objective to a team member.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="space-y-6 py-4">
                        <div className="space-y-2">
                           <Label className="text-[10px] uppercase font-black tracking-widest text-white/50">Objective Title</Label>
                           <Input 
                              placeholder="e.g., Finalize API Integration" 
                              className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                              value={formData.title}
                              onChange={e => setFormData({...formData, title: e.target.value})}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-black tracking-widest text-white/50">Assignee</Label>
                              <Select value={formData.assigned_to} onValueChange={val => setFormData({...formData, assigned_to: val})}>
                                 <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                    <SelectValue placeholder="Select Intern..." />
                                 </SelectTrigger>
                                 <SelectContent className="glass-card border-white/10">
                                    {team.map(member => (
                                       <SelectItem key={member.id} value={member.id} className="text-white hover:bg-white/5 focus:bg-white/5">
                                          <div className="flex items-center gap-2">
                                             <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[8px] font-bold">
                                                {member.full_name?.charAt(0)}
                                             </div>
                                             <span className="font-bold">{member.full_name}</span>
                                          </div>
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-black tracking-widest text-white/50">Priority</Label>
                              <Select value={formData.priority} onValueChange={(val: any) => setFormData({...formData, priority: val})}>
                                 <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="glass-card border-white/10">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] uppercase font-black tracking-widest text-white/50">Mission Briefing</Label>
                           <Textarea 
                              placeholder="Provide detailed instructions..." 
                              className="bg-white/5 border-white/10 min-h-[100px] rounded-xl text-sm"
                              value={formData.description}
                              onChange={e => setFormData({...formData, description: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-[10px] uppercase font-black tracking-widest text-white/50">Due Date</Label>
                           <Input 
                              type="date"
                              className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                              value={formData.due_date}
                              onChange={e => setFormData({...formData, due_date: e.target.value})}
                           />
                        </div>
                     </div>
                     <DialogFooter>
                        <Button 
                           variant="ghost" 
                           onClick={() => setIsCreateModalOpen(false)}
                           className="rounded-xl h-12 text-[10px] font-black uppercase tracking-widest"
                        >
                           Cancel
                        </Button>
                        <Button 
                           onClick={handleCreateTask}
                           disabled={isSubmitting}
                           className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px]"
                        >
                           {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Deployment"}
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
               <Button variant="outline" size="sm" className="h-10 gap-2 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest">
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
                        <Sheet onOpenChange={(open) => !open && onTaskSelect(null)}>
                           <SheetTrigger asChild>
                              <div
                                 className="absolute inset-0 z-0"
                                 onClick={() => onTaskSelect(task)}
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
                                       className="bg-white/5 border-white/10 min-h-[100px] text-xs focus:ring-emerald-500 text-white rounded-xl"
                                       value={newComment}
                                       onChange={e => setNewComment(e.target.value)}
                                    />
                                    <Button
                                       onClick={onAddComment}
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

                        <div className={`absolute top-0 right-0 w-12 h-12 -mr-6 -mt-6 blur-2xl ${task.status === 'completed' ? 'bg-emerald-500/20' : 'bg-amber-500/10'
                           }`} />
                        <CardContent className="p-6 space-y-4 relative z-10 pointer-events-none">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                 <Badge variant="outline" className={`text-[8px] tracking-tighter ${task.priority === 'Urgent' ? 'border-red-500/40 text-red-400' : 'border-emerald-500/20 text-emerald-400'
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
                  <p className="text-muted-foreground font-medium">No missions deployed in this department.</p>
               </div>
            )}
         </div>
      </div>
   );
}
