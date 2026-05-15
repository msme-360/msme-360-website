"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Target, ShieldAlert, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { createTask } from "../../actions";
import { format, addDays } from "date-fns";
import { Label } from "@/components/ui/label";

interface ImprovementPlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  mentorId: string;
}

export function ImprovementPlanDialog({
  isOpen,
  onOpenChange,
  userId,
  userName,
  mentorId
}: ImprovementPlanDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(`[IMPROVEMENT PLAN] Performance Protocol Update: ${userName}`);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please define the improvement objectives.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createTask({
        title,
        description,
        assigned_to: userId,
        assigned_by: mentorId,
        priority: "Urgent",
        due_date: dueDate,
        status: 'in_progress'
      });

      if (res.success) {
        toast.success(`Improvement plan deployed for ${userName}.`);
        onOpenChange(false);
      } else {
        toast.error("Deployment failure: " + res.error);
      }
    } catch {
      toast.error("System error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-amber-500">Initiate Improvement Plan</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">
            Corrective Action Protocol for {userName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Plan Designation</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 h-11 text-amber-100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70">Strategic Objectives & Milestones</Label>
            <Textarea
              placeholder="Define specific, measurable objectives for performance recovery..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 min-h-[150px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-amber-500/70 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Target Recovery Date
            </Label>
            <Input
              type="date"
              min={format(new Date(), "yyyy-MM-dd")}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 h-11"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-white/5 pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-900/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            Deploy Improvement Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
