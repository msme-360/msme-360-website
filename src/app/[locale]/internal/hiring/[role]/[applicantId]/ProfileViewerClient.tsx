"use client";

import { useState } from "react";
import { updateApplicationStatus, onboardIntern } from "@/app/[locale]/admin/actions";
import { Applicant, Metric } from "../../../../admin/hiring/components/HiringTypes";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, GraduationCap, Briefcase, 
  Linkedin, ExternalLink, Check, 
  FileText, RefreshCcw, Video,
  CalendarIcon,
  Clock,
  Star} from "lucide-react";
import { EvaluationCard } from "./EvaluationCard";
import OnboardingRegistry from "../../../../admin/hiring/components/OnboardingRegistry";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const ScheduleMeetDialog = dynamic(() => 
  import("../../../../admin/hiring/components/ScheduleMeetDialog").then(mod => mod.ScheduleMeetDialog),
  { ssr: false }
);

interface ProfileViewerClientProps {
  applicant: Applicant;
  initialMetrics: Metric[];
  user: User;
  userRole: string;
}

export default function ProfileViewerClient({ applicant: initialApplicant, initialMetrics, user, userRole }: ProfileViewerClientProps) {

  const [applicant, setApplicant] = useState<Applicant>(initialApplicant);
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const router = useRouter();
  const linkedinLink = applicant.links?.find(l => l.label.toLowerCase().includes('linkedin'))?.url;

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

  const handleHire = async () => {
    const previousStatus = applicant.status;
    setApplicant(prev => ({ ...prev, status: 'hired' }));
    
    setIsUpdating(true);
    try {
      const res = await onboardIntern(applicant.id);
      if (res.success) {
        toast.success("Candidate Approved & Onboarded!");
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
      title={applicant.full_name}
      subtitle={`Reviewing candidate for ${applicant.role}`}
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
                    <CardTitle className="text-2xl font-bold tracking-tight">{applicant.full_name}</CardTitle>
                    {applicant.is_archived ? (
                      <Badge variant="outline" className="border-amber-500/50 text-amber-500">ARCHIVED</Badge>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Badge variant="secondary" className="bg-white/5 gap-1.5"><Briefcase className="w-3 h-3" /> {applicant.role}</Badge>
                    <Badge variant="outline" className="border-white/10 gap-1.5"><GraduationCap className="w-3 h-3" /> {applicant.university || "N/A"}</Badge>
                    <Badge className={`
                      ${applicant.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                        applicant.status === 'shortlisted' ? 'bg-amber-500/20 text-amber-400' :
                          applicant.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' :
                            applicant.status === 'under_review' ? 'bg-purple-500/20 text-purple-400' :
                              applicant.status === 'onboarded' ? 'bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/20' :
                                'bg-blue-500/20 text-blue-400'} border-0`}>
                      {applicant.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {applicant.reviewer_name && applicant.reviewer_name !== "System" && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                        <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-[7px] font-bold text-indigo-400">
                          {applicant.reviewer_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">Reviewed by {applicant.reviewer_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10" asChild>
                  <Link href={`mailto:${applicant.email}`}><Mail className="w-4 h-4 mr-2" /> Email</Link>
                </Button>
                {linkedinLink && (
                  <Button className="rounded-xl bg-[#0077b5] hover:bg-[#0077b5]/90 shadow-lg shadow-[#0077b5]/20" asChild>
                    <Link href={linkedinLink} target="_blank"><Linkedin className="w-4 h-4 mr-2" /> LinkedIn</Link>
                  </Button>
                )}
                {/* Personnel Management Logic (Silo Guarded) */}
                {!applicant.is_archived && 
                 applicant.status !== 'pending' && 
                 (userRole === 'hr_manager' || userRole === 'super_admin') && 
                 applicant.status !== 'onboarded' && (
                  <Button
                    variant="outline"
                    className="rounded-xl border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500"
                    onClick={() => {
                      if (applicant.status === 'rejected') {
                        handleStatusUpdate('shortlisted');
                      } else {
                        handleStatusUpdate('pending');
                      }
                    }}
                    disabled={isUpdating || userRole === 'hr_manager'}
                  >
                    <RefreshCcw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                    {applicant.status === 'rejected' ? 'Rollback' : 'Reset Registry'}
                  </Button>
                )}
                
                {/* Schedule Meet Button */}
                {!applicant.is_archived && 
                 applicant.status !== 'hired' && 
                 applicant.status !== 'onboarded' && (
                  <Button 
                    className="rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 shadow-lg shadow-primary/5 gap-2"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <Video className="w-4 h-4" />
                    {(applicant.metadata as Record<string, unknown>)?.interview_date ? "Reschedule Meet" : "Schedule Meet"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">About Candidate</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground/80 bg-white/[0.01] p-4 rounded-2xl border border-white/5 italic">
                    &ldquo;Experienced applicant from {applicant.university} with a strong focus on {applicant.role}. Looking to contribute to MSME 360&apos;s mission.&rdquo;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Education</p>
                    <p className="text-sm font-medium">{applicant.university}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Reviewed By</p>
                    <p className="text-sm font-medium text-primary">{applicant.reviewer_name || "Unreviewed"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Application Date</p>
                    <p className="text-sm font-medium">{new Date(applicant.applied_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Professional Links</h4>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {applicant.links && applicant.links.length > 0 ? (
                    applicant.links.map((link, idx) => (
                      link.url && (
                        <Link
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all group/link"
                        >
                          <div className={`p-2 rounded-lg ${(link.label || '').toLowerCase().includes('linkedin') ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'}`}>
                            {(link.label || '').toLowerCase().includes('linkedin') ? <Linkedin className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium block">{link.label}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-muted-foreground" />
                        </Link>
                      )
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center">
                      <p className="text-xs text-muted-foreground">No professional links provided</p>
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

            {userRole === 'hr_manager' && applicant.status !== 'hired' && (
              <>
                <Button
                  onClick={handleHire}
                  disabled={isUpdating}
                  className="h-16 px-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold shadow-2xl shadow-emerald-500/20 group"
                >
                  <Check className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Approve for Onboarding
                </Button>
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
