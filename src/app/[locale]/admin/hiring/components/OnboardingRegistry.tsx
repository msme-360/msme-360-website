"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Save, CheckCircle2, 
  ShieldCheck, UserCheck, Lock,
  Zap, Info, LayoutTemplate, 
  UserPlus, Target, ListChecks,
  ChevronRight
} from "lucide-react";
import { Applicant } from "./HiringTypes";
import { toast } from "sonner";
import { 
  getMentorProfiles, 
  updateOnboardingProgress, 
  updateOnboardingDetails,
  updateApplicationStatus 
} from "@/app/[locale]/admin/actions";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger 
} from "@/components/ui/tooltip";
import { ONBOARDING_TEMPLATES, getRecommendedTemplate } from "@/lib/constants/onboardingTemplates";
import { Label } from "@/components/ui/label";

interface OnboardingRegistryProps {
  applicant: Applicant;
  userRole: string;
  onUpdate?: (updatedApplicant: Applicant) => void;
}

export default function OnboardingRegistry({ applicant, userRole, onUpdate }: OnboardingRegistryProps) {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Registry State
  const [mentorId, setMentorId] = useState<string>(applicant.metadata?.mentor_id || "");
  const recommendedId = getRecommendedTemplate(applicant.role);
  const [templateId, setTemplateId] = useState<string>(applicant.metadata?.template_id || recommendedId);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(applicant.metadata?.onboarding_checklist || {});

  const isHR = userRole === 'hr_manager' || userRole === 'super_admin';
  const isVerifier = isHR || userRole === 'team_lead' || userRole === 'project_lead' || userRole === 'supervisor' || userRole === 'coordinator';
  
  // Derived state: Get active template tasks
  const selectedTemplate = ONBOARDING_TEMPLATES.find(t => t.id === templateId);
  const activeTasks = selectedTemplate?.tasks || [];
  
  const completedCount = activeTasks.filter(task => checklist[task.name]).length;
  const progress = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

  const isDirty = mentorId !== (applicant.metadata?.mentor_id || "") || 
                  templateId !== (applicant.metadata?.template_id || "");

  useEffect(() => {
    async function loadMentors() {
      const data = await getMentorProfiles();
      setMentors(data);
    }
    loadMentors();
  }, []);

  const handleToggle = async (taskName: string, owner: 'hr' | 'intern') => {
    if (!isVerifier && owner === 'hr') {
      toast.error("Administrative verification restricted to HR Managers & Mentors.");
      return;
    }

    const newChecklist = { ...checklist, [taskName]: !checklist[taskName] };
    setChecklist(newChecklist);
    
    const res = await updateOnboardingProgress(applicant.id, newChecklist);
    if (!res.success) {
      toast.error("Failed to sync progress");
      setChecklist(checklist); 
    }
  };

  const handleSaveStrategy = async () => {
    if (!templateId || !mentorId) {
      toast.error("Template and Lead Mentor must be assigned.");
      return;
    }

    setLoading(true);
    const res = await updateOnboardingDetails(applicant.id, {
      mentor_id: mentorId,
      template_id: templateId
    });

    if (res.success) {
      toast.success("Registry Strategy Synchronized");
      if (onUpdate) {
        onUpdate({
          ...applicant,
          metadata: {
            ...applicant.metadata,
            mentor_id: mentorId,
            template_id: templateId,
            onboarding_checklist: checklist
          }
        });
      }
    } else {
      toast.error(res.error || "Update failed");
    }
    setLoading(false);
  };

  const handleFinalize = async () => {
    if (!isHR) return;
    if (progress < 100) {
      toast.error("All strategic targets must be verified (100%) before authorization.");
      return;
    }

    setLoading(true);
    try {
      const res = await updateApplicationStatus(applicant.id, 'onboarded');
      if (res.success) {
        toast.success("Personnel Onboarding Finalized");
        if (onUpdate) onUpdate({ ...applicant, status: 'onboarded' });
      } else {
        toast.error(res.error || "Finalization failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* 1. Strategy Assignment Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`glass-card border-white/10 overflow-hidden sticky top-24 transition-all duration-500 ${isDirty ? 'ring-2 ring-primary/50' : ''}`}>
            <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className={`w-4 h-4 ${isDirty ? 'text-primary animate-pulse' : 'text-amber-500'}`} />
                Registry Strategy
              </CardTitle>
              {isDirty && <Badge className="text-[8px] h-4 bg-primary text-primary-foreground animate-bounce">PENDING</Badge>}
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Template Selection */}
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/50 flex items-center gap-2">
                  <LayoutTemplate className="w-3 h-3" />
                  Orientation Policy
                </Label>
                <Select value={templateId} onValueChange={setTemplateId} disabled={!isHR}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl relative overflow-hidden group">
                    <SelectValue placeholder="Select Policy..." />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {ONBOARDING_TEMPLATES.map(t => (
                      <SelectItem key={t.id} value={t.id} className="text-white hover:bg-white/5">
                        <div className="flex flex-col py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{t.label}</span>
                            {t.id === recommendedId && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[7px] h-3 px-1 font-black">RECOMMENDED</Badge>
                            )}
                          </div>
                          <span className="text-[8px] opacity-40 leading-tight mt-0.5">{t.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mentor Assignment */}
              <div className="space-y-3">
                <Label className="text-[10px] uppercase font-black tracking-widest text-white/50 flex items-center gap-2">
                  <UserPlus className="w-3 h-3" />
                  Assigned Lead (L3.5)
                  <Tooltip>
                    <TooltipTrigger><Info className="w-3 h-3 opacity-30" /></TooltipTrigger>
                    <TooltipContent className="glass-card border-white/10 text-[9px] max-w-[200px] p-3">
                      Mentors must be Level 3.5 (Team Leads/Supervisors) who will directly manage the intern's daily progression.
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Select value={mentorId} onValueChange={setMentorId} disabled={!isHR}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-12 rounded-xl">
                    <SelectValue placeholder="Select Mentor..." />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10">
                    {mentors.map(m => (
                      <SelectItem key={m.id} value={m.id} className="text-white hover:bg-white/5">
                        <div className="flex flex-col py-1">
                          <span className="font-bold text-xs">{m.full_name}</span>
                          <span className="text-[8px] opacity-40 uppercase tracking-tighter">{m.role} • {m.department}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <Button 
                  className={`w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 ${
                    isDirty 
                      ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/40' 
                      : 'bg-white/5 text-white/20 border border-white/10'
                  }`}
                  onClick={handleSaveStrategy}
                  disabled={loading || !isHR || !isDirty}
                >
                  <Save className={`w-4 h-4 mr-2 ${isDirty ? 'animate-bounce' : ''}`} />
                  {isDirty ? 'Synchronize Now' : 'Strategy Secured'}
                </Button>
                
                <p className="text-[9px] text-center text-white/30 font-medium italic leading-relaxed px-4">
                  HR defines the orientation targets for the Mentor (L3.5) to execute with the Intern (L5).
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Orientation Lifecycle Tracking */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="glass-card border-white/10 overflow-hidden shadow-2xl shadow-black/60 relative">
            <CardHeader className="bg-white/[0.02] border-b border-white/5 py-8 px-10 flex flex-row items-center justify-between relative z-10">
              <div className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-4 font-display font-black tracking-tight">
                  <ListChecks className="w-8 h-8 text-emerald-400" />
                  ORIENTATION LIFECYCLE
                </CardTitle>
                <div className="flex items-center gap-4">
                   <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 px-2 font-bold tracking-tight">
                    {selectedTemplate?.label || "No Strategy Selected"}
                  </Badge>
                  <span className="text-[10px] text-white/30 font-medium">— Execution Audit View</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black font-display text-emerald-400 leading-none tracking-tighter">{progress}%</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-white/30 mt-2">Verified Progress</div>
              </div>
            </CardHeader>

            <CardContent className="p-10 relative z-10">
              {!templateId ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-10 h-10 text-white/20" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Lifecycle Not Initialized</h3>
                    <p className="text-xs text-white/30">Assign a Strategy Template to begin tracking orientation targets.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* HR Verification Track */}
                  <div className="space-y-6">
                    <TrackHeader 
                      title="Administrative Verification" 
                      subtitle="Confirmed by HR/Management" 
                      icon={<ShieldCheck className="w-6 h-6" />}
                      color="amber"
                    />
                    <div className="space-y-3">
                      {activeTasks.filter(t => t.owner === 'hr').map((task, idx) => (
                        <LifecycleTask 
                          key={task.name} 
                          task={task} 
                          isCompleted={checklist[task.name]} 
                          canToggle={isVerifier}
                          onToggle={() => handleToggle(task.name, 'hr')} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Intern Engagement Track */}
                  <div className="space-y-6">
                    <TrackHeader 
                      title="Personnel Engagement" 
                      subtitle="Completed by Associate/Intern" 
                      icon={<UserCheck className="w-6 h-6" />}
                      color="indigo"
                    />
                    <div className="space-y-3">
                      {activeTasks.filter(t => t.owner === 'intern').map((task, idx) => (
                        <LifecycleTask 
                          key={task.name} 
                          task={task} 
                          isCompleted={checklist[task.name]} 
                          canToggle={false} // READ-ONLY AUDIT for HR
                          onToggle={() => handleToggle(task.name, 'intern')} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* L5 Authorization Banner */}
              {templateId && (
                <div className="mt-20 p-8 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                    <CheckCircle2 className="w-64 h-64 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-8 relative z-10">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 ${
                      progress === 100 ? 'bg-emerald-500 shadow-2xl shadow-emerald-500/50' : 'bg-white/5 border border-white/10 opacity-30'
                    }`}>
                      <ShieldCheck className={`w-10 h-10 ${progress === 100 ? 'text-black' : 'text-white'}`} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display font-black text-2xl tracking-tighter uppercase">Final L5 Authorization</h4>
                      <p className="text-xs text-muted-foreground max-w-sm font-medium leading-relaxed">
                        Authorize full platform access once all orientation milestones are verified. This officially concludes the recruitment lifecycle.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    disabled={progress < 100 || loading || applicant.status === 'onboarded' || !isHR}
                    onClick={handleFinalize}
                    className={`h-16 px-14 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all duration-500 relative z-10 ${
                      progress === 100 && isHR
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30' 
                        : 'bg-white/5 text-white/10 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    {applicant.status === 'onboarded' ? "LIFECYCLE SECURED" : "AUTHORIZE ACCESS"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

function TrackHeader({ title, subtitle, icon, color }: { title: string, subtitle: string, icon: React.ReactNode, color: 'amber' | 'indigo' }) {
  const colorClass = color === 'amber' ? 'text-amber-500 bg-amber-500/10' : 'text-indigo-400 bg-indigo-500/10';
  return (
    <div className="flex items-center gap-4 pb-6 border-b border-white/5">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-white/70">{title}</h4>
        <p className="text-[10px] text-white/30 font-medium italic">{subtitle}</p>
      </div>
    </div>
  );
}

function LifecycleTask({ task, isCompleted, canToggle, onToggle }: { task: any, isCompleted: boolean, canToggle: boolean, onToggle: () => void }) {
  return (
    <motion.div
      onClick={() => canToggle && onToggle()}
      className={`flex items-center gap-5 p-5 rounded-3xl border transition-all relative overflow-hidden group ${
        canToggle ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
      } ${
        isCompleted 
          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-xl shadow-emerald-500/5' 
          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
        isCompleted ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/50' : 'border-white/10 group-hover:border-emerald-500/50'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-black stroke-[3px]" />
        ) : (
          !canToggle && <Lock className="w-3 h-3 text-white/10" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-bold truncate transition-colors ${
          isCompleted ? 'text-white/30 line-through' : 'text-white/80'
        }`}>
          {task.name}
        </p>
      </div>

      <ChevronRight className={`w-4 h-4 transition-all ${isCompleted ? 'text-emerald-500/50 rotate-90' : 'text-white/10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />

      {isCompleted && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-60" />
      )}
    </motion.div>
  );
}
