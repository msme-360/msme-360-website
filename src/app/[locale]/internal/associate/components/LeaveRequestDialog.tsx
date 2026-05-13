"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";

interface LeaveRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => Promise<void>;
}

export function LeaveRequestDialog({ isOpen, onClose, onSubmit }: LeaveRequestDialogProps) {
  const [type, setType] = useState("annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({ type, start_date: startDate, end_date: endDate, reason });
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
        className="bg-[#0A0A0B] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="relative p-8 space-y-6">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">Personnel Request</Badge>
             </div>
             <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Plane className="w-6 h-6 text-indigo-400" />
                Mission Leave Authorization
             </h2>
             <p className="text-xs text-indigo-100/40 uppercase font-bold tracking-widest">Protocol: Temporary Tactical Stand-down</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Leave Category</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-2xl">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                  <SelectItem value="annual">Annual Tactical Leave</SelectItem>
                  <SelectItem value="sick">Medical Recovery</SelectItem>
                  <SelectItem value="emergency">Emergency Extraction</SelectItem>
                  <SelectItem value="study">Academic Advancement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Start Cycle</Label>
                <Input 
                  type="date" 
                  className="bg-white/5 border-white/10 h-12 rounded-2xl"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">End Cycle</Label>
                <Input 
                  type="date" 
                  className="bg-white/5 border-white/10 h-12 rounded-2xl"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Tactical Justification</Label>
              <Textarea 
                placeholder="Reason for requested stand-down..."
                className="bg-white/5 border-white/10 min-h-[100px] rounded-2xl resize-none text-sm placeholder:text-white/20"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/5"
            >
              Abort Request
            </Button>
            <Button 
              onClick={handleApply}
              disabled={!startDate || !endDate || !reason || isSubmitting}
              className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
            >
              {isSubmitting ? "Transmitting..." : "Submit Authorization"}
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
