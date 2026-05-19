"use client";

import { useState } from "react";
import { updateApplicationStatus, onboardIntern, updateApplicationRole } from "@/app/[locale]/admin/actions";
import { Applicant, Metric } from "../../../../admin/hiring/components/HiringTypes";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, GraduationCap, Briefcase, 
  Linkedin, ExternalLink, Check, 
  FileText, RefreshCcw, Video,
  CalendarIcon, Clock, Star, Phone,
  UserCheck
} from "lucide-react";
import { EvaluationCard } from "./EvaluationCard";
import OnboardingRegistry from "../../../../admin/hiring/components/OnboardingRegistry";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CareerRole } from "@/lib/roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const ScheduleMeetDialog = dynamic(() => 
  import("../../../../admin/hiring/components/ScheduleMeetDialog").then(mod => mod.ScheduleMeetDialog),
  { ssr: false }
);

interface ProfileViewerClientProps {
  applicant: Applicant;
  initialMetrics: Metric[];
  user: User;
  userRole: string;
  availableRoles?: CareerRole[];
}

export default function ProfileViewerClient({ applicant: initialApplicant, initialMetrics, user, userRole, availableRoles = [] }: ProfileViewerClientProps) {

  const [applicant, setApplicant] = useState<Applicant>(initialApplicant);
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (status: string) => {
    const previousStatus = applicant.status;
    
    // Optimistic Update
    setApplicant(prev => ({ 
      ...prev, 
      status: status as Applicant['status']
    }));
    
    setIsUpdating(true);
    try {
      const res = await updateApplicationStatus(applicant.id, status);
      if (res.success) {
        toast.success(status === 'shortlisted' ? "Candidate Shortlisted" : `Status updated to ${status}`);
        router.refresh();
      } else {
        // Rollback
        setApplicant(prev => ({ ...prev, status: previousStatus }));
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      setApplicant(prev => ({ ...prev, status: previousStatus }));
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (newRole === applicant.role) return;
    
    setIsUpdating(true);
    try {
      const res = await updateApplicationRole(applicant.id, newRole);
      if (res.success) {
        setApplicant(prev => ({ ...prev, role: newRole }));
        toast.success(`Role updated to ${newRole}`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update role");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleHire = async () => {
    const previousStatus = applicant.status;
    setApplicant(prev => ({ ...prev, status: 'hired' }));
    
    setIsUpdating(true);
    try {
      const res = await onboardIntern(applicant.id);
      if (res.success) {
        toast.success("Candidate Hired & Onboarding Initialized");
        router.refresh();
      } else {
        setApplicant(prev => ({ ...prev, status: previousStatus }));
        toast.error(res.error || "Failed to onboard candidate");
      }
    } catch {
      setApplicant(prev => ({ ...prev, status: previousStatus }));
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFinalOnboard = async () => {
    setIsUpdating(true);
    try {
      const res = await updateApplicationStatus(applicant.id, 'onboarded');
      if (res.success) {
        toast.success("Personnel Onboarding Finalized");
        setApplicant(prev => ({ ...prev, status: 'onboarded' }));
        router.refresh();
      } else {
        toast.error(res.error || "Finalization failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMetricUpdate = (updatedMetric: Metric) => {
    setMetrics(prev => {
      const filtered = prev.filter(m =>
        !(m.evaluator_role === updatedMetric.evaluator_role && m.metric_name === updatedMetric.metric_name)
      );
      return [...filtered, updatedMetric];
    });
  };

  const handleMetricDelete = (metricName: string, role: string) => {
    setMetrics(prev => prev.filter(m =>
      !(m.evaluator_role === role && m.metric_name === metricName)
    ));
  };

  const recruiterMetrics = metrics.filter(m => m.evaluator_role === 'recruiter');
  const hrMetrics = metrics.filter(m => m.evaluator_role === 'hr_manager');

  const isOnboardingActive = applicant.status === 'hired' || applicant.status === 'onboarded';

  return (
    <AdminViewWrapper
      title="Recruitment Portal"
      subtitle="Comprehensive candidate evaluation and hiring lifecycle management"
      badgeLabel="TALENT PROFILE"
      authorityLevel={userRole === 'hr_manager' ? 'HR Manager' : 'Recruiter'}
    >
      <div className="space-y-10 pb-20">
        {/* 1. Candidate Overview Card */}
        <Card className="glass-card border-white/10 overflow-hidden">
          <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary shadow-lg shadow-primary/10">
                  {applicant.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      {applicant.full_name}
                    </CardTitle>
                    {applicant.is_archived && (
                      <Badge variant="outline" className="border-amber-500/50 text-amber-500 font-black text-[10px]">ARCHIVED</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {userRole === 'recruiter' || userRole === 'hr_manager' || userRole === 'super_admin' ? (
                      <Select
                        defaultValue={applicant.role}
                        onValueChange={handleRoleUpdate}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="h-8 w-fit bg-primary/10 border-primary/20 gap-2 rounded-xl px-4 text-xs font-bold text-primary hover:bg-primary/20 transition-all shadow-lg shadow-primary/5">
                          <Briefcase className="w-3.5 h-3.5" />
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-white/10">
                          {availableRoles.length > 0 ? (
                            availableRoles.map(role => (
                              <SelectItem key={role.slug} value={role.title} className="text-xs">
                                {role.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value={applicant.role}>{applicant.role}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 h-8 px-4 rounded-xl gap-2 text-xs font-bold">
                        <Briefcase className="w-3.5 h-3.5" /> {applicant.role}
                      </Badge>
                    )}
                    <Badge variant="outline" className={`
                      h-8 px-4 rounded-xl text-xs font-bold border-0 shadow-lg
                      ${applicant.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400 shadow-emerald-500/10' :
                        applicant.status === 'shortlisted' ? 'bg-amber-500/20 text-amber-400 shadow-amber-500/10' :
                        applicant.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 shadow-rose-500/10' :
                        applicant.status === 'under_review' ? 'bg-purple-500/20 text-purple-400 shadow-purple-500/10' :
                        applicant.status === 'onboarded' ? 'bg-indigo-500/20 text-indigo-400 shadow-indigo-500/10' :
                        'bg-blue-500/20 text-blue-400 shadow-blue-500/10'}
                    `}>
                      {applicant.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
                <div className="flex flex-wrap items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-bold" asChild>
                          <Link href={`mailto:${applicant.email}`}><Mail className="w-3.5 h-3.5 mr-2" /> Email</Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="glass-card border-white/10 text-xs text-white">
                        {applicant.email}
                      </TooltipContent>
                    </Tooltip>
                    {applicant.phone && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="h-10 rounded-xl border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-bold" asChild>
                            <Link href={`tel:${applicant.phone}`}><Phone className="w-3.5 h-3.5 mr-2" /> Phone</Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="glass-card border-white/10 text-xs text-white">
                          {applicant.phone}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                  <div className="w-px h-6 bg-white/5 mx-2 hidden md:block" />
                  {!applicant.is_archived && 
                   applicant.status !== 'hired' && 
                   applicant.status !== 'onboarded' && (
                    <Button 
                      className="h-10 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 shadow-xl shadow-primary/5 text-xs font-bold"
                      onClick={() => setShowScheduleDialog(true)}
                    >
                      <Video className="w-3.5 h-3.5 mr-2" />
                      {(() => {
                        const metadata = (applicant.metadata as Record<string, unknown>) || {};
                        const isHR = userRole === 'hr_manager';
                        const interviewDate = isHR ? metadata.hr_interview_date as string : metadata.interview_date as string;
                        const hasInterview = !!interviewDate;

                        if (hasInterview) {
                          const isPassed = new Date(interviewDate) < new Date(new Date().setHours(0, 0, 0, 0));
                          if (isPassed) return "Schedule Meet";
                          return "Reschedule Meet";
                        }
                        
                        return "Schedule Meet";
                      })()}
                    </Button>
                  )}
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Academic Profile */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <GraduationCap className="w-3 h-3" /> Academic Profile
                </h4>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 h-full">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">University</p>
                    <p className="text-sm font-bold text-white leading-tight">{applicant.university || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Degree</p>
                      <p className="text-xs font-medium text-white/80">{applicant.degree || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Class Of</p>
                      <p className="text-xs font-medium text-white/80">{applicant.graduation_year || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Application Details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Professional Context
                </h4>
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 h-full">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Exp. Level</p>
                      <p className="text-xs font-bold text-white">{applicant.experience_level || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Availability</p>
                      <p className="text-xs font-bold text-primary">
                        {applicant.availability_date ? new Date(applicant.availability_date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Applied Date</p>
                      <p className="text-xs font-medium text-white/60">{new Date(applicant.applied_at).toLocaleDateString()}</p>
                    </div>
                    {applicant.reviewer_name && applicant.reviewer_name !== "System" && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Reviewer</p>
                        <p className="text-xs font-bold text-indigo-400">{applicant.reviewer_name}</p>
                      </div>
                    )}
                  </div>
                </div>
                {applicant.desired_role && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-[10px] uppercase font-bold text-primary mb-1">Interest</p>
                    <p className="text-xs text-muted-foreground italic">&ldquo;{applicant.desired_role}&rdquo;</p>
                  </div>
                )}
              </div>

              {/* Column 3: Professional Links */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Resources & Links
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {applicant.links && applicant.links.length > 0 ? (
                    applicant.links.map((link, idx) => (
                      link.url && (
                        <Link
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group/link"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${(link.label || '').toLowerCase().includes('linkedin') ? 'bg-blue-500/10 text-blue-400' : (link.label || '').toLowerCase().includes('resume') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
                              {(link.label || '').toLowerCase().includes('linkedin') ? <Linkedin className="w-3.5 h-3.5" /> : (link.label || '').toLowerCase().includes('resume') ? <FileText className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-xs font-bold text-white/80 group-hover/link:text-white transition-colors">{link.label}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 text-white/20 group-hover/link:text-primary transition-colors" />
                        </Link>
                      )
                    ))
                  ) : (
                    <div className="p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-center">
                      <p className="text-xs text-muted-foreground italic">No links available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Onboarding Registry (Only for Hired/Onboarded) */}
        {isOnboardingActive && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <OnboardingRegistry 
              applicant={applicant} 
              userRole={userRole}
              onUpdate={setApplicant}
            />
          </div>
        )}

        {/* 3. Evaluation Section (Hide if onboarded for cleaner look) */}
        {!isOnboardingActive && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <EvaluationCard
              title="Recruitment Evaluation"
              role="recruiter"
              canEdit={userRole === 'recruiter' && ['pending', 'under_review'].includes(applicant.status)}
              metrics={recruiterMetrics}
              applicantId={applicant.id}
              userId={user.id}
              applicantStatus={applicant.status}
              onUpdate={handleMetricUpdate}
              onDelete={(name) => handleMetricDelete(name, 'recruiter')}
            />
            <EvaluationCard
              title="HR Strategy Review"
              role="hr_manager"
              canEdit={userRole === 'hr_manager' && applicant.status === 'shortlisted'}
              metrics={hrMetrics}
              applicantId={applicant.id}
              userId={user.id}
              applicantStatus={applicant.status}
              onUpdate={handleMetricUpdate}
              onDelete={(name) => handleMetricDelete(name, 'hr_manager')}
            />
          </div>
        )}

        {/* 4. Interview Timeline Section */}
        <Card className="glass-card border-white/10 overflow-hidden animate-in fade-in duration-700">
          <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">Interview Journey</CardTitle>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-0.5">Meeting History & Rounds</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const history = ((applicant.metadata as Record<string, unknown>)?.history as Record<string, unknown>[]) || [];
              const journey = ([
                {
                  type: 'APPLIED',
                  timestamp: applicant.applied_at,
                  label: 'Application Submitted',
                  icon: <Mail className="w-4 h-4" />
                },
                ...history.map((h) => {
                  const item = h as Record<string, unknown>;
                  return {
                    ...item,
                    timestamp: (item.timestamp || item.scheduled_at || item.created_at) as string,
                    icon: item.type === 'INTERVIEW' ? <Video className="w-4 h-4" /> : 
                          item.type === 'STATUS_CHANGE' ? <RefreshCcw className="w-4 h-4" /> :
                          item.type === 'EVALUATION' ? <Star className="w-4 h-4" /> :
                          <Clock className="w-4 h-4" />
                  } as JourneyItem;
                })
              ] as JourneyItem[]).sort((a, b) => {
                const dateA = new Date(a.timestamp || 0).getTime();
                const dateB = new Date(b.timestamp || 0).getTime();
                return dateB - dateA;
              });

              return (
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                  {journey.map((item: JourneyItem, idx: number) => (
                    <div key={idx} className="relative pl-12 group">
                      <div className={`absolute left-0 top-1 w-[36px] h-[36px] rounded-full bg-[#0a0a0a] border-2 border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors z-10 shadow-xl ${
                        item.type === 'STATUS_CHANGE' ? 'text-amber-400' :
                        item.type === 'EVALUATION' ? 'text-indigo-400' :
                        item.type === 'INTERVIEW' ? 'text-primary' : 'text-emerald-400'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className="font-bold text-white">
                              {item.type === 'INTERVIEW' ? `Interview Round ${item.round}` : item.label}
                            </h5>
                            {item.is_google_meet && (
                              <Badge variant="outline" className="text-[8px] h-4 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-0 px-1.5 font-black uppercase tracking-tighter">
                                Direct Google Meet
                              </Badge>
                            )}
                            {item.status && (
                              <Badge variant="outline" className={`text-[10px] border-white/10 uppercase ${
                                item.status === 'shortlisted' ? 'text-emerald-400 bg-emerald-500/5' :
                                item.status === 'rejected' ? 'text-rose-400 bg-rose-500/5' :
                                'text-primary bg-primary/5'
                              }`}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/50">
                            <span className="flex items-center gap-2">
                              <CalendarIcon className="w-3 h-3" /> 
                              {new Date(item.timestamp || item.date || 0).toLocaleDateString(undefined, { dateStyle: 'full' })}
                            </span>
                            {(item.time || item.timestamp) && (
                              <span className="flex items-center gap-2">
                                <Clock className="w-3 h-3" /> 
                                {item.time || new Date(item.timestamp || 0).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.type === 'INTERVIEW' && item.meet_link && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-9 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20"
                              asChild
                            >
                              <Link href={item.meet_link} target="_blank">
                                <Video className="w-3.5 h-3.5 mr-2" />
                                Join Meeting
                              </Link>
                            </Button>
                          )}
                          {item.type !== 'APPLIED' && (
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] uppercase font-bold text-white/20">Logged</p>
                              <p className="text-[10px] font-medium text-white/40">
                                {new Date(item.timestamp || 0).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* 4. Decision Control */}
        {!applicant.is_archived && applicant.status !== 'rejected' && applicant.status !== 'onboarded' && (
          <div className="flex justify-center gap-6 pt-10 border-t border-white/5 mt-8">
            {userRole === 'recruiter' && 
             applicant.status !== 'hired' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={isUpdating || applicant.status === 'shortlisted'}
                  className="h-14 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-xl shadow-amber-500/20"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {applicant.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist Candidate'}
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating || applicant.status === 'shortlisted'}
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-rose-500/50 text-rose-500 hover:bg-rose-500/10 font-bold"
                >
                  Reject Candidate
                </Button>
              </>
            )}

            {userRole === 'hr_manager' && (applicant.status === 'shortlisted' || applicant.status === 'hired') && (
              <>
                {applicant.status === 'shortlisted' ? (
                  <Button
                    onClick={handleHire}
                    disabled={isUpdating}
                    className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold shadow-2xl shadow-emerald-500/20 group"
                  >
                    <Check className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Approve & Hire
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={isUpdating}
                        className="h-16 px-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold shadow-2xl shadow-indigo-500/20 group"
                      >
                        <UserCheck className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Finalize Onboarding
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-card border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Finalize Personnel Onboarding?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will officially authorize full platform access and send the professional credentials to <strong>{applicant.full_name}</strong>. This action marks the completion of the recruitment lifecycle.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-white/10">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleFinalOnboard}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl"
                        >
                          Confirm & Authorize
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isUpdating}
                  variant="outline"
                  className="h-16 px-8 rounded-2xl border-rose-500/50 text-rose-500 hover:bg-rose-500/10 text-lg font-bold"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <ScheduleMeetDialog 
        applicant={applicant}
        isOpen={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        isGoogleConnected={!!(user.user_metadata as Record<string, unknown>)?.google_tokens}
      />
    </AdminViewWrapper>
  );
}

interface JourneyItem {
  type: string;
  timestamp?: string;
  label?: string;
  icon: React.ReactNode;
  round?: number;
  is_google_meet?: boolean;
  status?: string;
  date?: string;
  time?: string;
  meet_link?: string;
}
