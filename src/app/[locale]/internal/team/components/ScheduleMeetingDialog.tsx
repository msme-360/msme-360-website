"use client";

import { useCallback, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { MessageSquare, Calendar as CalendarIcon, Clock, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { scheduleInternalMeeting } from "../../actions";
import { format, startOfDay } from "date-fns";
import { Label } from "@/components/ui/label";

interface ScheduleMeetingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

export function ScheduleMeetingDialog({
  isOpen,
  onOpenChange,
  userId,
  userName
}: ScheduleMeetingDialogProps) {
  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }).filter(t => {
    const h = parseInt(t.split(':')[0]);
    return h >= 9 && h <= 21 && t <= "21:00"; // 9 AM to 9 PM IST
  });

  const getInitialDateTime = () => {
    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const todaySlots = timeSlots.filter(slot => slot > currentTimeStr);

    if (todaySlots.length > 0) {
      return { date: todayStr, time: todaySlots[0] };
    } else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { date: format(tomorrow, "yyyy-MM-dd"), time: timeSlots[0] };
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(`1-on-1 Strategic Sync: ${userName}`);
  const [description, setDescription] = useState("Operational review and tactical alignment session.");

  const [initial] = useState(getInitialDateTime());
  const [date, setDate] = useState<Date | undefined>(new Date(initial.date));
  const [time, setTime] = useState(initial.time);
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  const getFilteredTimeSlots = useCallback(() => {
    const isToday = date && format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    if (!isToday) return timeSlots;
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    return timeSlots.filter(slot => slot > currentTimeStr);
  }, [date, timeSlots]);

  const filteredSlots = getFilteredTimeSlots();

  // Handle time adjustment when date selection changes
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const slots = getFilteredTimeSlots();
      if (slots.length > 0 && !slots.includes(time)) {
        setTime(slots[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!date || !time) {
      toast.error("Please select a valid date and time");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await scheduleInternalMeeting({
        targetUserIds: [userId],
        title,
        description,
        date: format(date, "yyyy-MM-dd"),
        time,
        repeat
      });

      if (res.success) {
        toast.success(`Meeting scheduled with ${userName}! Check your calendar.`);
        onOpenChange(false);
      } else {
        toast.error("Scheduling failure: " + res.error);
      }
    } catch {
      toast.error("Protocol error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-bold">Initiate 1-on-1 Sync</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">
            Tactical Meeting Request for {userName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Meeting Title</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary text-xs flex items-center gap-2">
                Date
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
                    onSelect={handleDateSelect}
                    disabled={(date) => date < startOfDay(new Date())}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-primary text-xs flex items-center gap-2">
                Time (IST)
              </Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="glass-card bg-white/[0.03] border-white/10 h-11 w-full rounded-xl px-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Select" />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-card border-white/10 max-h-48">
                  {filteredSlots.length > 0 ? (
                    filteredSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-[10px] text-muted-foreground uppercase text-center">No slots available</div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Recurrence Strategy</Label>
            <Select value={repeat} onValueChange={(v: 'none' | 'daily' | 'weekly' | 'monthly') => setRepeat(v)}>
              <SelectTrigger className="glass-card bg-white/[0.03] border-white/10 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10">
                <SelectItem value="none">No Repeat</SelectItem>
                <SelectItem value="daily">Daily Sync</SelectItem>
                <SelectItem value="weekly">Weekly Sync</SelectItem>
                <SelectItem value="monthly">Monthly Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-primary">Agenda Briefing</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="glass-card bg-white/[0.03] border-white/10 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="border-t border-white/5 pt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 h-12 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Video className="w-4 h-4 mr-2" />
            )}
            Authorize Google Meet Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
