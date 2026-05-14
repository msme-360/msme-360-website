"use client";

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Plus, Target, User, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { createTask } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";

interface CreateMissionDialogProps {
  mentorId: string;
  targetUserId?: string;
  targetUserName?: string;
  teamMembers?: { id: string, full_name: string | null }[];
  trigger?: React.ReactNode;
}

export default function CreateMissionDialog({ 
  mentorId, 
  targetUserId, 
  targetUserName,
  teamMembers = [],
  trigger
}: CreateMissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    assigned_to: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    due_date: string;
  }>({
    title: "",
    description: "",
    assigned_to: targetUserId || (teamMembers[0]?.id || ""),
    priority: "Medium",
    due_date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleLaunch = async () => {
    if (!newTask.assigned_to) {
      toast.error("Please select a recipient for this mission.");
      return;
    }

    setIsSubmitting(true);
    const res = await createTask({
      ...newTask,
      assigned_by: mentorId,
      status: 'in_progress'
    });

    if (res.success) {
      toast.success("Mission deployed successfully.");
      setIsOpen(false);
      setNewTask({
        title: "",
        description: "",
        assigned_to: targetUserId || (teamMembers[0]?.id || ""),
        priority: "Medium",
        due_date: format(new Date(), "yyyy-MM-dd"),
      });
    } else {
      toast.error("Deployment failure: " + res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2 h-9 px-4 shadow-lg shadow-primary/20 text-xs font-bold uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            New Mission
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-display font-bold">Deploy Tactical Mission</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Strategic Objective Assignment</p>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Mission Title</Label>
            <Input 
              value={newTask.title}
              onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., UI Hardening: Sidebar Localization"
              className="bg-white/5 border-white/10 h-11 focus:ring-primary/20"
            />
          </div>

          {!targetUserId && teamMembers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Assign To</Label>
              <Select 
                onValueChange={(val) => setNewTask(prev => ({ ...prev, assigned_to: val }))}
                defaultValue={newTask.assigned_to}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Select team member" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetUserId && (
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Assigned Recipient</Label>
              <div className="h-11 px-4 bg-white/5 border border-white/10 rounded-md flex items-center gap-2 text-sm font-bold text-indigo-100/60">
                <User className="w-4 h-4 text-primary" />
                {targetUserName || "Designated Personnel"}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Briefing (Operational Details)</Label>
            <Textarea 
              value={newTask.description}
              onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide specific instructions, technical requirements, or context for this mission..."
              className="bg-white/5 border-white/10 min-h-[120px] focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Priority Level</Label>
              <Select 
                onValueChange={(val: "Low" | "Medium" | "High" | "Urgent") => setNewTask(prev => ({ ...prev, priority: val }))}
                defaultValue={newTask.priority}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                  <SelectItem value="Low">Low Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Urgent">Urgent Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Deployment Deadline</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="date"
                  value={newTask.due_date}
                  onChange={e => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  className="bg-white/5 border-white/10 h-11 pl-10 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button 
            onClick={handleLaunch}
            disabled={isSubmitting || !newTask.title.trim()}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            {isSubmitting ? "Transmitting..." : "Authorize & Deploy Mission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
