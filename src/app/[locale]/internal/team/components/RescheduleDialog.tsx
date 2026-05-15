"use client";

import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { rescheduleMeeting } from "../../actions";
import { format, startOfDay } from "date-fns";
import { Label } from "@/components/ui/label";

interface RescheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  meetingType: string;
  initialDate: string;
  initialTime: string;
  title: string;
}

export function RescheduleDialog({
  isOpen,
  onOpenChange,
  meetingId,
  meetingType,
  initialDate,
  initialTime,
  title
}: RescheduleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(initialDate));
  const [time, setTime] = useState(initialTime);

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }).filter(t => {
    const h = parseInt(t.split(':')[0]);
    return h >= 9 && h <= 21 && t <= "21:00";
  });

  const handleSubmit = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await rescheduleMeeting(meetingId, meetingType, format(date, "yyyy-MM-dd"), time);
      if (res.success) {
        toast.success("Meeting rescheduled protocol activated.");
        onOpenChange(false);
      } else {
        toast.error("Reschedule failure: " + res.error);
      }
    } catch {
      toast.error("Protocol error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Reschedule Protocol</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">
            Adjusting temporal constraints for: {title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              New Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal rounded-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {date ? format(date, "PPP") : <span className="text-white/40">Select Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 glass-card border-white/10" align="start">
                <ShadcnCalendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < startOfDay(new Date())}
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              New Time (IST)
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="glass-card bg-white/[0.03] border-white/10 h-11 w-full rounded-xl px-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 max-h-48">
                {timeSlots.map(slot => (
                  <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="border-t border-white/5 pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (date && format(date, "yyyy-MM-dd") === initialDate && time === initialTime)}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Authorize Reschedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
