"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Activity, 
  Target, 
  Calendar, 
  Clock, 
  UserPlus,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardMetric } from "@/types/dashboard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useParams } from "next/navigation";
import CreateMissionDialog from "@/app/[locale]/internal/team/components/CreateMissionDialog";
import type { Meeting } from "@/types/meeting";

export interface ProjectPulseItem {
  name: string;
  status: string;
  progress: number;
  color: string;
}

export interface TeamMember {
  id: string;
  full_name: string | null;
  role: string;
  designation: string;
  avatar_url?: string | null;
  is_verified: boolean;
  career_level?: string;
}

export default function MentorshipOversight({ 
  metrics = [],
  managedProfiles = [],
  mentorId = "",
  syncs = [],
  projectPulse = []
}: { 
  metrics?: DashboardMetric[];
  managedProfiles?: TeamMember[];
  mentorId?: string;
  syncs?: Meeting[];
  projectPulse?: ProjectPulseItem[];
}) {
  const params = useParams();
  const locale = params.locale as string;

  // Real data for project pulse
  const projects = projectPulse.length > 0 ? projectPulse : [
    { name: "Team Missions", status: "No Data", progress: 0, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Global Metrics Pulse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.length > 0 ? (
          metrics.slice(0, 4).map((m) => (
            <Card key={m.label} className="glass-card border-white/5 hover:border-primary/20 transition-all overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl rounded-full -mr-8 -mt-8" />
              <CardContent className="p-6">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold tracking-tighter">{m.value}</h3>
                  <span className="text-[10px] font-bold text-emerald-400">{m.change}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          [1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />)
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Team Oversight (Center Column) */}
        <Card className="lg:col-span-2 glass-card border-primary/10 bg-primary/[0.01]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Team Oversight</CardTitle>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Managed Units & Mentorship</p>
              </div>
            </div>
            <Link href={`/${locale}/internal/team/team_lead/directory`}>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                Manage All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y divide-white/5">
                {managedProfiles.length > 0 ? (
                  managedProfiles.map((member) => (
                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-white/5 group-hover:border-primary/20 transition-all">
                          <AvatarImage src={member.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {member.full_name?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{member.full_name}</h4>
                            {member.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{member.designation} • {member.career_level || 'L1'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="hidden md:block w-32">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Competency</span>
                            <span className="font-bold text-primary">75%</span>
                          </div>
                          <Progress value={75} className="h-1 bg-white/5" />
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-widest text-[9px]">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">No assigned mentees yet.</p>
                    <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest mt-1">Assign members via Personnel Registry</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 3. Strategic Pulse & Activity */}
        <div className="space-y-8">
          <Card className="glass-card border-white/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-emerald-400" />
                <CardTitle className="text-lg">Project Pulse</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">{project.name}</p>
                    <Badge variant="outline" className="text-[9px] font-black tracking-widest">{project.status}</Badge>
                  </div>
                  <Progress value={project.progress} className={`h-1.5 bg-white/5 ${project.color}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 bg-emerald-500/[0.01]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Mentorship Queue</CardTitle>
              </div>
              <CreateMissionDialog 
                mentorId={mentorId} 
                teamMembers={managedProfiles.map(p => ({ id: p.id, full_name: p.full_name }))}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-6">
                {syncs && syncs.length > 0 ? (
                  syncs.map((sync, i) => {
                    const isPast = new Date(sync.scheduled_at) < new Date();
                    return (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isPast ? 'bg-white/5' : 'bg-emerald-500/10'}`}>
                            <Clock className={`w-4 h-4 ${isPast ? 'text-muted-foreground' : 'text-emerald-400'}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${isPast ? 'text-muted-foreground' : ''}`}>{sync.title}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black">
                              {new Date(sync.scheduled_at).toLocaleDateString()} {new Date(sync.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        {isPast ? (
                          <Badge className="bg-white/10 text-white font-bold">Completed</Badge>
                        ) : (
                          <Badge className="bg-primary text-primary-foreground font-bold">Upcoming</Badge>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest py-8">No scheduled sessions</p>
                )}
                
                <Link href={`/${locale}/internal/team/team_lead/reviews`} className="block group/item">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg text-muted-foreground group-hover/item:text-primary transition-colors">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Pending Task Reviews</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">Action Required</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
