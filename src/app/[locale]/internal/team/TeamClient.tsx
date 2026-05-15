"use client";

import {
  Search, Mail, Linkedin, Award, Zap, Star, Coffee, Heart, Calendar as CalendarIcon,
  Target
} from "lucide-react";
import { InternalScheduleDialog } from "../components/InternalScheduleDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Database } from "@/types/supabase";
import { useState } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { AttendanceLogClient, AttendanceLog } from "@/app/[locale]/admin/attendance/AttendanceLogClient";
import { PerformanceClient } from "./PerformanceClient";
import { MissionReviewClient } from "./MissionReviewClient";
import { TeamReflectionClient } from "./TeamReflectionClient";
import { TeamLeaveClient } from "./TeamLeaveClient";
import CreateMissionDialog from "./components/CreateMissionDialog";
import AssignPersonnelDialog from "./components/AssignPersonnelDialog";
import { OnboardingRegistry } from "./components/OnboardingRegistry";
import { PolicyHub } from "./components/PolicyHub";
import { Reflection } from "./TeamReflectionClient";
import { LeaveRequest } from "./TeamLeaveClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Meeting } from "@/types/meeting";

export type TeamMember = Database['public']['Tables']['profiles']['Row'];

export interface TeamPerformance {
  id: string;
  name: string;
  role: string;
  reliability: number;
  completion_rate: number;
  culture_fit: 'Exceptional' | 'Standard' | 'Developing';
  last_review: string;
  avatar_url?: string;
}

export interface ReviewTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  proof_of_work: string;
  assigned_to: string;
  updated_at: string;
  created_at: string;
  assigned_to_profile?: {
    full_name: string;
    role: string;
  };
}

interface TeamClientProps {
  initialTeam?: TeamMember[];
  initialAttendance?: AttendanceLog[];
  initialPerformance?: TeamPerformance[];
  initialPendingTasks?: ReviewTask[];
  initialReflections?: Reflection[];
  initialLeaveRequests?: LeaveRequest[];
  initialSyncs?: Meeting[];
  subView?: string;
  mentorId?: string;
  userRole?: string;
  isGoogleConnected?: boolean;
}

export function TeamClient({ 
  initialTeam = [], 
  initialAttendance = [], 
  initialPerformance = [], 
  initialPendingTasks = [], 
  initialReflections = [],
  initialLeaveRequests = [],
  initialSyncs = [],
  subView, 
  mentorId, 
  userRole = "team_lead", 
  isGoogleConnected = false 
}: TeamClientProps) {

  const t = useTranslations("Admin.team");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const displayTeam = initialTeam;

  if (subView === 'attendance') {
    return <AttendanceLogClient initialAttendance={initialAttendance as AttendanceLog[]} />;
  }

  if (subView === 'performance' || subView === 'syncs') {
    return <PerformanceClient 
      initialData={initialPerformance} 
      initialSyncs={initialSyncs}
      mentorId={mentorId || ""} 
    />;
  }

  if (subView === 'reviews') {
    return <MissionReviewClient initialTasks={initialPendingTasks} mentorId={mentorId || ""} />;
  }

  if (subView === 'reflections') {
    return <TeamReflectionClient reflections={initialReflections} />;
  }

  if (subView === 'leaves') {
    return <TeamLeaveClient initialRequests={initialLeaveRequests} />;
  }

  if (subView === 'onboarding') {
    return <OnboardingRegistry />;
  }

  if (subView === 'policies') {
    return <PolicyHub />;
  }

  if (subView && subView !== 'directory') {
    const subViewTitles: Record<string, string> = {
      directory: "Personnel Registry",
      hierarchy: "Organizational Chart",
      departments: "Departmental Silos",
      performance: "Team Reliability",
      culture: "Cultural Hub",
    };
    
    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Module`}
        subtitle="Operational team management and cultural orchestration."
        badgeLabel="CULTURE DEPTH"
        authorityLevel="L2 Manager"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Synchronizing {title} View</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is mapping organizational relationships and synchronizing <strong>{title.toLowerCase()}</strong> for the team.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }

  return (
    <AdminViewWrapper
      title={userRole === 'hr_manager' ? "Personnel Command" : "Team Directory"}
      subtitle={userRole === 'hr_manager' ? "Universal personnel registry and workforce orchestration." : "Discover the mission-driven personnel behind MSME 360."}
      badgeLabel={userRole === 'hr_manager' ? "HR COMMAND" : "CULTURE & PEOPLE"}
      authorityLevel={userRole === 'hr_manager' ? "L4 Human Resources" : "Personnel View"}
      actions={
        <div className="flex items-center gap-3">
          <AssignPersonnelDialog managerId={mentorId || ""} userRole={userRole} />
          <CreateMissionDialog 
            mentorId={mentorId || ""} 
            teamMembers={displayTeam.map(m => ({ id: m.id, full_name: m.full_name }))}
          />
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary font-bold rounded-xl h-9 px-4 gap-2"
            onClick={() => setIsScheduleOpen(true)}
          >
            <CalendarIcon className="w-4 h-4" />
            Schedule Sync
          </Button>
        </div>
      }
    >

      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex items-center justify-center gap-4 max-w-xl mx-auto mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder={t("search")} 
              className="pl-10 h-11 glass-card bg-background/50 border-white/10 rounded-xl focus:ring-primary/20 transition-all" 
            />
          </div>
          <Button className="h-11 px-8 shadow-glow font-bold rounded-xl">{t("discover")}</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTeam.map((member) => {
            const name = member.full_name || "Team Member";
            const role = member.role || "Executive";
            const dept = "Operations";
            
            const isActive = initialAttendance.some(a => a.user_id === member.id && !a.check_out);
            
            return (
              <Card key={member.id} className={`glass-card hover:scale-[1.02] transition-all duration-300 group overflow-hidden border-border/50 ${isActive ? 'ring-1 ring-emerald-500/50' : ''}`}>
                <CardContent className="p-6 relative">
                   {/* Background Glow */}
                   <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20 ${isActive ? 'bg-emerald-500' : 'bg-primary'}`} />
                   
                   <div className="flex flex-col items-center text-center space-y-4">
                      <div className="relative">
                        <Avatar className="w-20 h-20 border-2 border-white/10 shadow-xl group-hover:rotate-6 transition-transform">
                          <AvatarImage src={member.avatar_url ?? undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                            {name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isActive && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg shadow-emerald-500/20 border border-white/20 animate-bounce">
                            <Zap className="w-3 h-3 fill-current" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-2">
                          <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{name}</h3>
                          {isActive && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[8px] font-black uppercase px-1.5 h-4">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">{role}</p>
                        <Badge variant="outline" className="mt-2 bg-muted/50 border-border text-[9px] font-bold uppercase tracking-widest px-2 py-0">
                          {dept}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic line-clamp-2">
                        &quot;MSME 360 Core Personnel&quot;
                      </p>
                      
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <CreateMissionDialog 
                          mentorId={mentorId || ""} 
                          targetUserId={member.id} 
                          targetUserName={name}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                              <Target className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </div>
                   </div>
                </CardContent>
                <div className="px-6 py-3 bg-muted/30 border-t border-border/50 flex items-center justify-around">
                   <div className="flex items-center flex-col gap-0.5">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Leader</span>
                   </div>
                   <div className="flex items-center flex-col gap-0.5">
                      <Zap className="w-4 h-4 text-accent" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Rapid</span>
                   </div>
                   <div className={`flex items-center flex-col gap-0.5`}>
                      <Star className="w-4 h-4 text-orange-500" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Expert</span>
                   </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="glass-card p-10 border-primary/20 relative overflow-hidden mt-10">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Heart className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
               <h2 className="text-3xl font-display font-bold">{t("cta")}</h2>
               <p className="text-muted-foreground">{t("ctaSub")}</p>
            </div>
            <Button size="lg" className="shadow-lg hover:shadow-primary/50 transition-all font-bold group">
              {t("ctaButton")}
              <Zap className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default mt-10">
           <div className="flex items-center gap-2"><Coffee className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Coffee Fuelled</span></div>
           <div className="flex items-center gap-2"><Heart className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Culture First</span></div>
           <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Async Workflow</span></div>
        </div>
      </div>

      <InternalScheduleDialog 
        isOpen={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        isGoogleConnected={isGoogleConnected}
        currentUserRole={userRole}
      />
    </AdminViewWrapper>
  );
}
