"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight,
  Loader2} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { 
  getTeamMembers, 
  getComplianceTasks, 
  addTeamMember as addMemberAction, 
  updateComplianceTaskStatus 
} from "@/app/[locale]/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ComplianceItem {
  id: string;
  task_name: string;
  due_date: string;
  status: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  role_key: string;
  status: string;
}

export function OperationsTools() {
  const t = useTranslations("OperationsHub");
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const [teamData, complianceData] = await Promise.all([
          getTeamMembers(user.id),
          getComplianceTasks(user.id)
        ]);
        setTeam(teamData);
        setCompliance(complianceData);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const markFiled = async (id: string) => {
    if (!userId) return;
    try {
      const result = await updateComplianceTaskStatus(userId, id, 'filed');
      if (result.success) {
        setCompliance(prev => prev.map(item => 
          item.id === id ? { ...item, status: "filed" } : item
        ));
        toast.success("Task marked as filed");
      }
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleAddTeamMember = async () => {
    if (!userId) {
      toast.error("You must be logged in");
      return;
    }
    setIsAddingMember(true);
    const names = ["Sameer Khan", "Priya Das", "Vikram Singh"];
    const roles = ["salesExecutive", "supportStar", "leadDeveloper"];
    const random = Math.floor(Math.random() * 3);
    const newMember = { full_name: names[random], role_key: roles[random] };
    
    try {
      const result = await addMemberAction(userId, newMember);
      if (result.success) {
        // Refresh team list
        const updatedTeam = await getTeamMembers(userId);
        setTeam(updatedTeam);
        toast.success(`Welcome ${newMember.full_name} to the team!`);
      }
    } catch {
      toast.error("Failed to add team member");
    } finally {
      setIsAddingMember(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {/* Compliance Tracker */}
      <Card className="lg:col-span-2 glass-card border-primary/10 overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{t("compliance.title")}</CardTitle>
              <CardDescription>{t("compliance.subtitle")}</CardDescription>
            </div>
            <Badge className="bg-primary/20 text-primary border-none">{t("compliance.month")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2">
                         <Skeleton className="h-4 w-32" />
                         <Skeleton className="h-3 w-20" />
                      </div>
                   </div>
                   <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              ))
            ) : compliance.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground">{t("compliance.noTasks")}</div>
            ) : compliance.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.status === 'filed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                    {item.status === 'filed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight">{item.task_name}</h4>
                    <p className="text-xs text-muted-foreground">{t("compliance.due", { date: item.due_date })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => markFiled(item.id)}
                      className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
                    >
                      {t("compliance.markAsFiled")}
                    </Button>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3">{t("compliance.filedOn", { date: "Today" })}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Ledger */}
      <Card className="glass-card border-accent/10 flex flex-col">
        <CardHeader className="bg-accent/5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" /> {t("team.title")}
            </CardTitle>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-8 w-8 text-accent hover:bg-accent/10" 
              onClick={handleAddTeamMember}
              disabled={isAddingMember}
            >
              {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/20">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                  </div>
                ))
              ) : team.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">{t("team.empty")}</div>
              ) : team.map((member, idx) => (
                <div key={member.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/50 group hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                      {member.full_name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">{member.full_name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{t(`team.roles.${member.role_key}`)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[8px] border-none px-1.5 ${
                    member.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {t(`status.${member.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full rounded-xl bg-accent text-accent-foreground font-bold text-xs" variant="secondary">
            {t("team.viewAll")} <ChevronRight className="ml-2 w-3 h-3" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
