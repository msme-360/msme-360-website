"use client";

import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Award, Zap, Star, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { commendUser } from "../../actions";

interface CommendationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  mentorId: string;
}

export function CommendationDialog({
  isOpen,
  onOpenChange,
  userId,
  userName,
  mentorId
}: CommendationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState<'Tactical' | 'Innovation' | 'Culture' | 'Reliability'>('Tactical');
  const [reason, setReason] = useState("");
  const [points, setPoints] = useState("50");

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the commendation.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await commendUser({
        user_id: userId,
        mentor_id: mentorId,
        category,
        reason,
        points: parseInt(points) || 0
      });

      if (res.success) {
        toast.success(`Commendation awarded to ${userName}!`);
        onOpenChange(false);
        setReason("");
      } else {
        toast.error("Failed to award commendation.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'Tactical': return <Zap className="w-5 h-5 text-primary" />;
      case 'Innovation': return <Star className="w-5 h-5 text-amber-400" />;
      case 'Culture': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'Reliability': return <Award className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 sm:max-w-[425px] overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8">
           <Award className="w-32 h-32 text-primary" />
        </div>
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Award Tactical Merit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Recognize <strong>{userName}</strong> for exceptional contribution and cultural impact.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 relative z-10">
          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Merit Category
            </label>
            <Select 
              value={category} 
              onValueChange={(v: 'Tactical' | 'Innovation' | 'Culture' | 'Reliability') => setCategory(v)}
            >
              <SelectTrigger className="glass-card bg-white/[0.03] border-white/10 h-11 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  {getCategoryIcon()}
                  <SelectValue placeholder="Select category" />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="Tactical" className="focus:bg-white/10">Tactical Excellence</SelectItem>
                <SelectItem value="Innovation" className="focus:bg-white/10">Innovation Mindset</SelectItem>
                <SelectItem value="Culture" className="focus:bg-white/10">Cultural Impact</SelectItem>
                <SelectItem value="Reliability" className="focus:bg-white/10">Reliability Master</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Merit Points
            </label>
            <Input 
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 h-11 focus:ring-primary/20 font-bold"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Justification (The Reason)
            </label>
            <Textarea 
              placeholder="Why does this associate deserve this merit?" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 min-h-[120px] focus:ring-primary/20 resize-none leading-relaxed"
            />
          </div>
        </div>

        <DialogFooter className="relative z-10 sm:justify-between items-center border-t border-white/5 pt-6 mt-2">
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
             <Zap className="w-3 h-3 text-primary animate-pulse" /> Protocol Verified
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="shadow-glow px-8 font-bold h-11 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Award Merit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
