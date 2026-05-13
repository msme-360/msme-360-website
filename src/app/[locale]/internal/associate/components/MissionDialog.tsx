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
import { Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface MissionDialogProps {
  onCreateTask: (task: {
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    due_date: string;
  }) => void;
}

export default function MissionDialog({ onCreateTask }: MissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
    due_date: string;
  }>({
    title: "",
    description: "",
    priority: "Medium",
    due_date: format(new Date(), "yyyy-MM-dd"),
  });

  const handleLaunch = () => {
    onCreateTask(newTask);
    setIsOpen(false);
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      due_date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onValueChange={(val: "Low" | "Medium" | "High" | "Urgent") => setNewTask(prev => ({ ...prev, priority: val }))}
                defaultValue={newTask.priority}
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
            onClick={handleLaunch}
            disabled={!newTask.title.trim()}
            className="w-full bg-indigo-500 hover:bg-indigo-600 h-11 text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20"
          >
            Launch Mission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
