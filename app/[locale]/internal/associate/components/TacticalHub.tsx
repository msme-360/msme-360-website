
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Zap, Calendar, CheckCircle2, MessageSquare,
  Loader2, Send, Clock
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Task, TaskComment } from "./AssociateTypes";

import { DashboardProfile } from "@/types/dashboard";

interface TacticalHubProps {
  tasks: Task[];
  profile: DashboardProfile;
  selectedTask: Task | null;
  onTaskSelect: (task: Task | null) => void;
  comments: TaskComment[];
  isCommentsLoading: boolean;
  newComment: string;
  setNewComment: (c: string) => void;
  isSubmittingComment: boolean;
  onAddComment: () => void;
  onTaskStatus: (taskId: string, status: Task['status']) => void;
}

export default function TacticalHub({
  tasks,
  profile,
  onTaskSelect,
  comments,
  isCommentsLoading,
  newComment,
  setNewComment,
  isSubmittingComment,
  onAddComment,
  onTaskStatus
}: TacticalHubProps) {
  return (
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
                          onClick={onAddComment}
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
                  <Badge variant="outline" className={`text-[8px] rounded-md transition-colors ${task.status === 'completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
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
                    onClick={() => onTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                    className={`w-5 h-5 mt-0.5 rounded-full border transition-all ${task.status === 'completed'
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
            <Clock className="w-8 h-8 text-white/10 mx-auto mb-2" />
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
  );
}
