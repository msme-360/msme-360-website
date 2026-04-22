"use client";

import { 
  Search, Mail, Linkedin, Globe,
  Award, Zap, Star, Coffee, Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Database } from "@/types/supabase";

import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface TeamClientProps {
  initialTeam?: TeamMember[];
  subView?: string;
}

export function TeamClient({ initialTeam = [], subView }: TeamClientProps) {
  const t = useTranslations("Admin.team");
  const displayTeam = initialTeam;

  if (subView) {
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
      title="Team Directory"
      subtitle="Discover the mission-driven personnel behind MSME 360."
      badgeLabel="CULTURE & PEOPLE"
      authorityLevel="Personnel View"
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
            const role = member.role_key || "Executive";
            const dept = "Operations";
            const icon = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            const colors = "bg-primary text-primary-foreground";
            
            return (
              <Card key={name} className="glass-card hover:scale-[1.02] transition-all duration-300 group overflow-hidden border-border/50">
                <CardContent className="p-6 relative">
                   {/* Background Glow */}
                   <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20 ${colors.split(' ')[0]}`} />
                   
                   <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold shadow-xl group-hover:rotate-6 transition-transform ${colors}`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{name}</h3>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">{role}</p>
                        <Badge variant="outline" className="mt-2 bg-muted/50 border-border text-[9px] font-bold uppercase tracking-widest px-2 py-0">
                          {dept}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic line-clamp-2">
                        &quot;MSME 360 Core Personnel&quot;
                      </p>
                      
                      <div className="flex items-center justify-center gap-4 pt-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                          <Globe className="w-4 h-4" />
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
    </AdminViewWrapper>
  );
}
