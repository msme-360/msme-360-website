"use client";

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getMentorProfiles, updateOnboardingDetails } from "@/app/[locale]/admin/actions";
import { toast } from "sonner";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AssignMentorDialogProps {
  applicationId: string;
  currentMentorId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface MentorProfile {
  id: string;
  full_name: string | null;
  role: string | null;
  avatar_url?: string | null;
}

export default function AssignMentorDialog({ 
  applicationId, 
  currentMentorId, 
  isOpen, 
  onOpenChange, 
  onSuccess 
}: AssignMentorDialogProps) {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState(currentMentorId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMentors = useCallback(async () => {
    setIsLoading(true);
    const data = await getMentorProfiles();
    setMentors(data as MentorProfile[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => void loadMentors(), 0);
    }
  }, [isOpen, loadMentors]);

  const handleSave = async () => {
    if (!selectedMentorId) {
      toast.error("Please select a Team Lead/Mentor");
      return;
    }

    setIsSubmitting(true);
    const res = await updateOnboardingDetails(applicationId, {
      mentor_id: selectedMentorId,
      template_id: "standard_intern_v1"
    });

    if (res.success) {
      toast.success("Team Lead assigned to applicant.");
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast.error("Assignment failure: " + res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-indigo-500" />
            </div>
            <DialogTitle className="text-xl font-display font-bold">Assign Supervisory Lead</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Designate Team Lead for Onboarding</p>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Select Lead Personnel</Label>
            <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
              <SelectTrigger className="bg-white/5 border-white/10 h-11">
                <SelectValue placeholder={isLoading ? "Loading leads..." : "Select lead..."} />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                {mentors.map(mentor => (
                  <SelectItem key={mentor.id} value={mentor.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={mentor.avatar_url ?? undefined} />
                        <AvatarFallback className="text-[8px] bg-primary/20 text-primary">{mentor.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-bold">{mentor.full_name}</span>
                      <span className="text-[8px] text-muted-foreground uppercase">({mentor.role})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 font-bold text-xs uppercase tracking-widest"
            onClick={handleSave}
            disabled={isSubmitting || !selectedMentorId}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
