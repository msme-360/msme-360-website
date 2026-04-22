"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardProfile } from "@/types/dashboard";
import { createTask } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { getRoleById, getCareerLevelMetadata } from "@/lib/constants/roles";

interface ManagerHeaderProps {
   department: string;
   profileId: string;
   team: DashboardProfile[];
   role: string;
}

export default function ManagerHeader({
   department,
   profileId,
   team,
   role
}: ManagerHeaderProps) {
   const router = useRouter();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [isTaskSubmitting, setIsTaskSubmitting] = useState(false);
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
         assigned_by: profileId
      });
      if (res.success) {
         setIsDialogOpen(false);
         setNewTask({
            title: '',
            description: '',
            assigned_to: '',
            priority: 'Medium',
            due_date: ''
         });
         router.refresh();
         toast.success("Mission deployed successfully!");
      } else {
         toast.error(res.error || "Failed to deploy mission.");
      }
      setIsTaskSubmitting(false);
   };

   return (
      <section className="relative overflow-hidden rounded-[2rem] bg-emerald-950 p-10 border border-emerald-500/20 shadow-2xl">
         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-500/10 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-emerald-50 text-center md:text-left">
            <div className="space-y-4">
               <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full">
                  {getRoleById(role).label} Hub ({getCareerLevelMetadata(role)?.level || 'L4'} Specialist)
               </Badge>
               <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-tight">
                  Department Oversight: <span className="text-emerald-400">{department}</span>
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
                              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                              placeholder="e.g. MicroAI Analysis"
                              className="bg-white/5 border-white/10"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label>Assign To Profile</Label>
                           <Select onValueChange={val => setNewTask({ ...newTask, assigned_to: val })}>
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
                              <Select onValueChange={val => setNewTask({ ...newTask, priority: val as 'Low' | 'Medium' | 'High' | 'Urgent' })}>
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
                                 onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                 className="bg-white/5 border-white/10"
                              />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label>Briefing / Description</Label>
                           <Textarea
                              value={newTask.description}
                              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                              placeholder="Detailed instructions for the candidate..."
                              className="bg-white/5 border-white/10 min-h-[100px]"
                           />
                        </div>
                     </div>
                     <DialogFooter>
                        <Button
                           onClick={handleCreateTask}
                           disabled={isTaskSubmitting}
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
   );
}
