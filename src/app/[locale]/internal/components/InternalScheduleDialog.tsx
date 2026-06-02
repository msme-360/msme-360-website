"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Video, Loader2, CheckCircle2, Repeat } from "lucide-react";
import { scheduleInternalMeeting, getInternProfiles, getMentorProfiles } from "../actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

interface InternalScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isGoogleConnected?: boolean;
  currentUserRole: string;
  teamMembers?: Array<{ id: string; full_name?: string | null; role?: string | null; avatar_url?: string | null }>;
}

export function InternalScheduleDialog({
  isOpen,
  onOpenChange,
  isGoogleConnected = false,
  currentUserRole,
  teamMembers
}: InternalScheduleDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string>("");
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; full_name?: string | null; role?: string | null; avatar_url?: string | null; }>>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const loadUsers = useCallback(async () => {
    if (teamMembers && teamMembers.length > 0) {
      setAvailableUsers(teamMembers);
      return;
    }

    setIsLoadingUsers(true);
    try {
      let users = [];
      if (currentUserRole === 'intern') {
        users = await getMentorProfiles();
      } else {
        users = await getInternProfiles();
      }
      setAvailableUsers(users as unknown as Array<{ id: string; full_name?: string | null; role?: string | null; avatar_url?: string | null; }>);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentUserRole, teamMembers]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => void loadUsers(), 0);
    }
  }, [isOpen, loadUsers]);

  const handleSchedule = async () => {
    if (!date || !targetUserId || !title) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsScheduling(true);
    try {
      const res = await scheduleInternalMeeting({
        targetUserId,
        title,
        description,
        date: format(date, "yyyy-MM-dd"),
        time,
        repeat
      });

      if (res.success) {
        setIsSuccess(true);
        setMeetLink(res.meetLink || "");
        toast.success("Meeting scheduled successfully!");
      } else {
        toast.error(res.error || "Failed to schedule meeting");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsScheduling(false);
    }
  };

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
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
    const todaySlots = timeSlots.filter(slot => slot > currentTimeStr);

    if (todaySlots.length > 0) {
      return { date: now, time: todaySlots[0] };
    } else {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return { date: tomorrow, time: timeSlots[0] };
    }
  }, [timeSlots]);

  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("10:00");

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

  const getFilteredTimeSlots = useCallback(() => {
    if (!date) return timeSlots;
    const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    if (!isToday) return timeSlots;
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    return timeSlots.filter(slot => slot > currentTimeStr);
  }, [date, timeSlots]);

  const filteredSlots = getFilteredTimeSlots();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      const isToday = format(newDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
      if (isToday) {
        const now = new Date();
        const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
        if (time <= currentTimeStr) {
          const slots = timeSlots.filter(slot => slot > currentTimeStr);
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
          setTitle("");
          setDescription("");
          setTargetUserId("");
        }, 300);
      }
    }}>
      <DialogContent className="sm:max-w-125 glass-card border-white/10 p-0 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-indigo-500/10 pointer-events-none" />

        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight">Internal Sync</DialogTitle>
              <DialogDescription className="text-xs text-white/40">
                Schedule a call with your {currentUserRole === 'intern' ? 'Mentor' : 'Intern'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="p-8 pt-0 space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Meeting Confirmed</h3>
                <p className="text-xs text-white/50">
                  {title} scheduled for {date && format(date, "PPP")} at {time}.
                </p>
                {repeat !== 'none' && (
                  <Badge variant="outline" className="mt-2 text-[8px] bg-primary/10 text-primary border-primary/20">
                    Repeats {repeat}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Generated Meet Link</Label>
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
                <h3 className="font-bold text-white mb-1">Calendar Access Required</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  To schedule internal calls and generate meeting links, you must first connect your Google Account.
                </p>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20"
              onClick={async () => {
                const { getGoogleConnectionUrl } = await import("../actions");
                const res = await getGoogleConnectionUrl(window.location.origin + window.location.pathname);
                if (res.url) window.location.href = res.url;
                else toast.error("Configuration missing");
              }}
            >
              Connect Google Account
            </Button>
          </div>
        ) : (
          <div className="p-8 pt-0 space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Title</Label>
                <Input
                  placeholder="e.g. Weekly Sync, Technical Review"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Target Person</Label>
                <Select value={targetUserId} onValueChange={setTargetUserId}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                    <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select person"} />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {availableUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={user.avatar_url ?? undefined} />
                            <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{user.full_name} ({user.role})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-11 bg-white/5 border-white/10 rounded-xl justify-start text-xs font-normal">
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-primary" />
                        {date ? format(date, "PPP") : "Pick date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-card border-white/10" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < startOfDay(new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Time (IST)</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10 max-h-48">
                      {filteredSlots.map(slot => (
                        <SelectItem key={slot} value={slot} className="text-xs">
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Repeat Options</Label>
                <Select value={repeat} onValueChange={(val: 'none' | 'daily' | 'weekly' | 'monthly') => setRepeat(val)}>
                  <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-3.5 h-3.5 text-primary" />
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

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/30 ml-1">Description (Optional)</Label>
                <Textarea
                  placeholder="Sync agenda..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl min-h-20"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                className="w-full h-12 rounded-xl font-bold tracking-tight shadow-lg shadow-primary/20"
                onClick={handleSchedule}
                disabled={!date || !targetUserId || !title || isScheduling}
              >
                {isScheduling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Video className="w-4 h-4 mr-2" />}
                {isScheduling ? "Scheduling..." : "Schedule Sync"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
