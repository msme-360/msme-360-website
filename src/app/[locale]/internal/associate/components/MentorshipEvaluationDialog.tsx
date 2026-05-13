"use client";

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MentorshipEvaluationDialogProps {
  mentorName: string;
  mentorId: string;
}

export default function MentorshipEvaluationDialog({ mentorName, mentorId }: MentorshipEvaluationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call using mentorId
    console.log(`Submitting evaluation for mentor: ${mentorId}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(`Mentorship evaluation for ${mentorName} submitted successfully.`);
    setIsOpen(false);
    setIsSubmitting(false);
    setRating(0);
    setFeedback("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white rounded-xl h-10 text-[10px] uppercase font-black tracking-widest mt-2">
          Evaluate Mentorship
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">Evaluate {mentorName}</DialogTitle>
          <p className="text-xs text-white/50">Providing feedback helps us maintain tactical excellence.</p>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-white/50">Tactical Support Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  {rating >= star ? (
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  ) : (
                    <Star className="w-8 h-8 text-white/10" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-white/50">Detailed Feedback</Label>
            <Textarea 
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="How has your mentor supported your growth?"
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full bg-indigo-500 hover:bg-indigo-600 h-11 text-sm font-bold uppercase tracking-widest shadow-xl shadow-indigo-500/20"
          >
            {isSubmitting ? "Transmitting..." : "Submit Evaluation"}
            <Send className="w-3.5 h-3.5 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
