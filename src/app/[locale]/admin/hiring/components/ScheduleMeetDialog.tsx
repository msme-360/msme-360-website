"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video, Loader2, CheckCircle2, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { scheduleInterview } from "../../actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "./HiringTypes";
import { Label } from "@/components/ui/label";

interface ScheduleMeetDialogProps {
  applicant: Applicant;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isGoogleConnected?: boolean;
  onSuccess?: (reviewerName: string) => void;
}

export function ScheduleMeetDialog({
  applicant,
  isOpen,
  onOpenChange,
  isGoogleConnected = false,
  onSuccess
}: ScheduleMeetDialogProps) {
  const handleSchedule = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setIsScheduling(true);
    try {
      const res = await scheduleInterview(
        applicant.id,
        format(date, "yyyy-MM-dd"),
        time,
        repeat
      );

      if (res.success) {
        setIsSuccess(true);
        setMeetLink(res.meetLink || "");
        setIsRealMeet(!!res.isRealGoogleMeet);
        onSuccess?.(res.reviewer_name || "System");
        toast.success("Interview scheduled successfully!");
      } else {
        toast.error(res.error || "Failed to schedule interview");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsScheduling(false);
    }
  };

const TIME_SLOTS = Array.from({ length: 24 * 2 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}).filter(t => {
  const h = parseInt(t.split(':')[0]);
  return h >= 9 && h <= 21 && t <= "21:00"; // 9 AM to 9 PM IST
});

const getInitialDateTime = useCallback(() => {
  const now = new Date();
  const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  const todaySlots = TIME_SLOTS.filter(slot => slot > currentTimeStr);

  if (todaySlots.length > 0) {
    return { date: now, time: todaySlots[0] };
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { date: tomorrow, time: TIME_SLOTS[0] };
  }
}, [TIME_SLOTS]);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("10:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string>("");
  const [isRealMeet, setIsRealMeet] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');

  useEffect(() => {
    if (isOpen && !date) {
      const initial = getInitialDateTime();
      const timer = setTimeout(() => {
        setDate(initial.date);
        setTime(initial.time);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, date, getInitialDateTime]); 

  const getFilteredTimeSlots = () => {
    if (!date) return TIME_SLOTS;
    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    if (!isToday) return TIME_SLOTS;
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    return TIME_SLOTS.filter(slot => slot > currentTimeStr);
  };

  const filteredSlots = getFilteredTimeSlots();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const isToday = format(newDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      if (isToday) {
        const now = new Date();
        const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        if (time <= currentTimeStr) {
          const slots = TIME_SLOTS.filter(slot => slot > currentTimeStr);
          if (slots.length > 0) setTime(slots[0]);
        }
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        setTimeout(() => {
          setIsSuccess(false);
          setMeetLink("");
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-[450px] glass-card border-white/10 p-0 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-indigo-500/10 pointer-events-none" />

        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">Schedule Meet</DialogTitle>
              <DialogDescription className="text-xs text-white/40">
                Coordinating with {applicant.full_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="p-8 pt-0 space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* ... success view ... */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Meeting Confirmed</h3>
                <p className="text-xs text-white/50">
                  Interview scheduled for {date && format(date, "PPP")} at {time}.
                </p>
                {repeat !== 'none' && (
                  <Badge variant="outline" className="mt-2 text-[8px] bg-primary/10 text-primary border-primary/20">
                    Repeats {repeat}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1 flex justify-between items-center">
                <span>Generated Meet Link</span>
                {isRealMeet && (
                  <Badge variant="outline" className="text-[9px] h-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-0 px-1.5 font-black uppercase tracking-tighter">
                    Direct Google Meet Conference
                  </Badge>
                )}
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-primary truncate">
                  {meetLink}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-white/10"
                  onClick={() => {
                    navigator.clipboard.writeText(meetLink);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl font-bold tracking-tight" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : !isGoogleConnected ? (
          <div className="p-8 pt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Google Calendar Required</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  To schedule interviews and generate meeting links, you must first connect your Google Account.
                </p>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20"
              onClick={async () => {
                const { getGoogleConnectionUrl } = await import("../../actions");
                // Use a stable redirect URI (base portal path) to avoid redirect_uri_mismatch
                const parts = window.location.pathname.split('/');
                const hiringIndex = parts.indexOf('hiring');
                const stablePath = parts.slice(0, hiringIndex + 2).join('/');
                const redirectUri = window.location.origin + stablePath;

                const res = await getGoogleConnectionUrl(redirectUri);
                if (res.url) window.location.href = res.url;
                else toast.error("Configuration missing");
              }}
            >
              Connect Gmail Account
            </Button>

            <p className="text-[10px] text-center text-white/20">
              One-time setup required for secure calendar access.
            </p>
          </div>
        ) : (
          <div className="p-8 pt-0 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Interview Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-11 justify-start text-left font-medium bg-white/5 border-white/10 rounded-xl hover:bg-white/10 transition-all",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-card border-white/10" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      autoFocus
                      disabled={(date) => date < startOfDay(new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Interview Time (IST)</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <SelectValue placeholder="Select time" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 max-h-60">
                    {filteredSlots.map(slot => (
                      <SelectItem key={slot} value={slot} className="text-xs">
                        {slot} {parseInt(slot.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Repeat Options</Label>
                <Select value={repeat} onValueChange={(val: 'none' | 'daily' | 'weekly' | 'monthly') => setRepeat(val)}>
                  <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-primary" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    <SelectItem value="none">Does not repeat</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6">
                <p className="text-[10px] leading-relaxed text-primary/70">
                  <span className="font-bold text-primary">Note:</span> This will automatically generate a Google Meet link and notify the candidate. The application status will be updated to <span className="font-bold text-purple-400">Under Review</span>.
                </p>
              </div>

              <DialogFooter>
                <Button
                  className="w-full h-12 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20"
                  onClick={handleSchedule}
                  disabled={!date || isScheduling}
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule & Generate Link"
                  )}
                </Button>
              </DialogFooter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

