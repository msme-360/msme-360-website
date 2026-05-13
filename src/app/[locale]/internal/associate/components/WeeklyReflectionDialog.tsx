"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyReflectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    wins: string;
    challenges: string;
    satisfaction: number;
  }) => Promise<void>;
}

export function WeeklyReflectionDialog({ isOpen, onClose, onSubmit }: WeeklyReflectionDialogProps) {
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ wins, challenges, satisfaction });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0A0A0B] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">Tactical Reflection</Badge>
             </div>
             <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Weekly Progress Sync
             </h2>
             <p className="text-xs text-indigo-100/40 uppercase font-bold tracking-widest">Cycle: Standard Operational Review</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Key Victories / Wins
              </Label>
              <Textarea 
                placeholder="What objectives did you neutralize this week?" 
                className="bg-white/5 border-white/10 min-h-[100px] rounded-2xl resize-none text-sm placeholder:text-white/20"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400" /> Primary Frictions / Challenges
              </Label>
              <Textarea 
                placeholder="What obstacles are currently impeding your velocity?" 
                className="bg-white/5 border-white/10 min-h-[100px] rounded-2xl resize-none text-sm placeholder:text-white/20"
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Tactical Satisfaction</Label>
              <div className="flex gap-4 justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSatisfaction(star)}
                    className="group transition-all"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= satisfaction 
                          ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                          : "text-white/10 group-hover:text-white/20"
                      } transition-all duration-300`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/5"
            >
              Abort Review
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!wins || !challenges || isSubmitting}
              className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? "Transmitting..." : "Submit Reflection"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  const variantStyles = variant === 'outline' ? 'border-white/20' : '';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantStyles} ${className}`}>{children}</span>;
}

function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
}
