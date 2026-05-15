"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Calendar,
  Clock,
  Video,
  Search,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { getMeetingData } from "@/app/[locale]/admin/actions";
import { toast } from "sonner";

interface Meeting {
  id: string;
  userId: string;
  userName: string;
  role: string;
  reviewerName: string;
  type: string;
  date: string;
  time: string;
  link: string;
  status: string;
}

export default function MeetingManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchMeetings = () => {
    startTransition(async () => {
      const data = await getMeetingData();
      setMeetings(data as Meeting[]);
    });
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter(m =>
    m.userName.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const activeMeetings = filteredMeetings.filter(m => {
    if (m.date !== todayStr) return false;
    const [h, min] = m.time.split(':').map(Number);
    const mTime = new Date();
    mTime.setHours(h, min, 0, 0);
    const diff = Math.abs(now.getTime() - mTime.getTime()) / (1000 * 60);
    return diff <= 45; // Assume 45 min duration
  });

  const upcomingMeetings = filteredMeetings.filter(m => {
    const mDate = new Date(`${m.date}T${m.time}`);
    return mDate > now;
  }).reverse(); // Show soonest first since sorted desc in action

  const pastMeetings = filteredMeetings.filter(m => {
    const mDate = new Date(`${m.date}T${m.time}`);
    return mDate < now && !activeMeetings.includes(m);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates or roles..."
            className="pl-10 glass-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={fetchMeetings}
          disabled={isPending}
          className="glass-card border-white/10 hover:bg-white/5"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
          Refresh Registry
        </Button>
      </div>

      {activeMeetings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-widest text-rose-400">Live Encounters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMeetings.map(m => (
              <MeetingCard key={m.id} meeting={m} isActive />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">Upcoming Missions</h2>
          </div>
          <div className="space-y-3">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map(m => (
                <MeetingListItem key={m.id} meeting={m} />
              ))
            ) : (
              <EmptyState message="No upcoming meetings found in the temporal pipeline." />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Historical Logs</h2>
          </div>
          <div className="space-y-3">
            {pastMeetings.slice(0, 5).map(m => (
              <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-1 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold truncate">{m.userName}</p>
                  <Badge variant="outline" className="text-[8px] py-0 h-4 border-white/5 bg-white/5 text-muted-foreground">
                    By {m.reviewerName}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{m.date}</span>
                  <span>{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingCard({ meeting, isActive }: { meeting: Meeting, isActive?: boolean }) {
  return (
    <Card className={`glass-card ${isActive ? 'border-rose-500/30 bg-rose-500/[0.03]' : 'border-white/10'}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-lg font-bold tracking-tight">{meeting.userName}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{meeting.role}</p>
          </div>
          <Badge className={isActive ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}>
            {isActive ? 'In Progress' : 'Scheduled'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="truncate">Reviewer: {meeting.reviewerName}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Video className="w-3 h-3" />
            <span className="truncate">{meeting.type}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{meeting.time} (IST)</span>
          </div>
        </div>

        <Button
          variant={isActive ? "destructive" : "outline"}
          className="w-full h-10 group"
          asChild
        >
          <a href={meeting.link} target="_blank" rel="noopener noreferrer">
            Join Protocol
            <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function MeetingListItem({ meeting }: { meeting: Meeting }) {
  return (
    <div className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="p-3 bg-white/5 rounded-xl text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="font-bold truncate">{meeting.userName}</p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest truncate">{meeting.role} • {meeting.type}</p>
            <Badge variant="outline" className="text-[8px] py-0 h-4 border-white/5 bg-white/5 text-muted-foreground">
              By {meeting.reviewerName}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold">{meeting.date}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{meeting.time} IST</p>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-indigo-500/20 hover:text-indigo-400" asChild>
          <a href={meeting.link} target="_blank" rel="noopener noreferrer">
            <Video className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] flex flex-col items-center justify-center text-center">
      <AlertCircle className="w-8 h-8 text-muted-foreground mb-4 opacity-20" />
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}
