"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { handlePoWReview } from "../actions";
import { CheckCircle2, XCircle, Clock, User, ExternalLink, Award } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { CommendationDialog } from "./components/CommendationDialog";

interface ReviewTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  proof_of_work: string;
  assigned_to: string;
  updated_at: string;
  created_at: string;
  assigned_to_profile?: {
    full_name: string;
    role: string;
  };
}

export function MissionReviewClient({ initialTasks = [], mentorId }: { initialTasks: ReviewTask[], mentorId: string }) {
  const [tasks, setTasks] = useState<ReviewTask[]>(initialTasks);
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [commendationTarget, setCommendationTarget] = useState<{ id: string, name: string } | null>(null);

  const handleVerify = async (taskId: string, decision: 'completed' | 'in_progress') => {
    setIsSubmitting(taskId);
    // Map internal UI decisions to backend action types
    const backendDecision = decision === 'completed' ? 'verified' : 'rejected';
    const res = await handlePoWReview(taskId, backendDecision, reviewNote[taskId] || "", mentorId);
    
    if (res.success) {
      toast.success(decision === 'completed' ? "Mission finalized." : "Task returned for correction.");
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } else {
      toast.error("Protocol failure. Unable to verify mission.");
    }
    setIsSubmitting(null);
  };

  return (
    <AdminViewWrapper
      title="Mission Verification"
      subtitle="Review tactical output and proof of work from your mentees."
      badgeLabel="GOVERNANCE"
      authorityLevel="Mentor/Lead Review"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">Queue Clear</h3>
            <p className="text-muted-foreground text-sm">No pending mission verifications detected.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-2">Pending Review</Badge>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Mission Index: {task.id.slice(0, 8)}</span>
                      </div>
                      <CardTitle className="text-2xl font-display font-bold tracking-tight mt-2">{task.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                       <div className="text-right">
                          <p className="text-sm font-bold text-white">{task.assigned_to_profile?.full_name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{task.assigned_to_profile?.role || "Associate"}</p>
                       </div>
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <User className="w-5 h-5 text-primary" />
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission Brief</h4>
                      <p className="text-sm text-indigo-100/60 leading-relaxed">{task.description || "No description provided."}</p>
                      
                      <div className="pt-4 flex items-center gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Submitted</p>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {formatDistanceToNow(new Date(task.updated_at || task.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black">Priority</p>
                          <Badge variant="outline" className="border-white/10 text-[10px] font-bold">{task.priority}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Proof of Work (PoW)</h4>
                           <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-400/40 hover:text-emerald-400">
                             <ExternalLink className="w-3 h-3" />
                           </Button>
                        </div>
                        <div className="text-sm text-emerald-50/80 font-mono bg-black/40 p-4 rounded-xl border border-emerald-500/10 min-h-[100px]">
                          {task.proof_of_work || "No proof of work artifacts submitted."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Mentor Resolution Note</h4>
                    <Textarea 
                      placeholder="Provide feedback or instructions for mission finalization..."
                      className="bg-black/40 border-white/10 rounded-2xl min-h-[100px] text-sm focus:ring-primary/20"
                      value={reviewNote[task.id] || ""}
                      onChange={(e) => setReviewNote(prev => ({ ...prev, [task.id]: e.target.value }))}
                    />
                    
                    <div className="flex items-center justify-end gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        disabled={isSubmitting === task.id}
                        onClick={() => handleVerify(task.id, 'in_progress')}
                        className="h-12 px-8 rounded-2xl border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Return for Correction
                      </Button>
                      <Button 
                        variant="outline"
                        disabled={isSubmitting === task.id}
                        onClick={() => setCommendationTarget({ id: task.assigned_to, name: task.assigned_to_profile?.full_name || "Associate" })}
                        className="h-12 px-8 rounded-2xl border-primary/20 text-primary hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Commend Associate
                      </Button>
                      <Button 
                        disabled={isSubmitting === task.id}
                        onClick={() => handleVerify(task.id, 'completed')}
                        className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Finalize & Close Mission
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CommendationDialog 
        isOpen={!!commendationTarget}
        onOpenChange={(open) => !open && setCommendationTarget(null)}
        userId={commendationTarget?.id || ""}
        userName={commendationTarget?.name || ""}
        mentorId={mentorId}
      />
    </AdminViewWrapper>
  );
}