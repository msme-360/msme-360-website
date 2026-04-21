"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Shield, 
  MapPin, 
  Building2, 
  Hash,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { DashboardProfile } from "@/types/dashboard";

interface ProfileTabContentProps {
  profile: DashboardProfile;
}

export function ProfileTabContent({ profile }: ProfileTabContentProps) {
  const { locale } = useParams();

  const infoItems = [
    { label: "Personnel ID", value: profile.id, icon: Hash, mono: true },
    { label: "Official Email", value: profile.email || "N/A", icon: Mail },
    { label: "Department", value: profile.department || "General Operations", icon: Building2 },
    { label: "Location", value: profile.location || "MSME 360 Remote", icon: MapPin },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-80 glass-card border-white/10 shrink-0 overflow-hidden">
          <div className="h-24 bg-linear-to-br from-primary/20 via-primary/5 to-accent/20 border-b border-white/5" />
          <CardContent className="p-6 -mt-12 text-center">
            <div className="w-24 h-24 rounded-3xl bg-secondary mx-auto mb-4 p-1 shadow-2xl border border-white/10 relative">
               <div className="w-full h-full rounded-[1.4rem] bg-white/5 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary/50" />
               </div>
               {profile.is_verified && (
                 <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                 </div>
               )}
            </div>
            <h3 className="text-xl font-bold font-display">{profile.full_name || "New Personnel"}</h3>
            <p className="text-xs font-black uppercase text-primary tracking-widest mt-1 mb-4">{profile.role.replace('_', ' ')}</p>
            
            <div className="pt-4 border-t border-white/5">
              <Link href={`/${locale}/dashboard/profile`}>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter bg-white/5 border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all gap-2 cursor-pointer py-1.5 px-4">
                  Manage Business Identity <ExternalLink className="w-3 h-3" />
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <Card key={item.label} className="glass-card border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground/60" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest leading-none">
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold truncate ${item.mono ? 'font-mono text-[11px] opacity-80' : ''}`}>
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Security Status */}
          <Card className="sm:col-span-2 glass-card border-white/5 bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <h4 className="font-bold text-sm">Security Verification Status</h4>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                      Your identity is {profile.is_verified ? 'fully verified within the MSME 360 workforce ledger' : 'currently pending departmental verification'}.
                   </p>
                </div>
              </div>
              <Badge className={profile.is_verified ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"}>
                {profile.is_verified ? "VERIFIED PROTOCOL" : "PENDING AUDIT"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Quick-Look (Conditional for Associates) */}
      {profile.role === 'intern' && (
        <Card className="glass-card border-indigo-500/20 bg-indigo-500/5 mt-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Zap className="w-12 h-12 text-indigo-400" />
          </div>
          <CardContent className="p-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                   <h4 className="text-lg font-bold flex items-center gap-2 text-white">
                      <Zap className="w-5 h-5 text-indigo-400" />
                      Performance Quick-Look
                   </h4>
                   <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">L1 Associate Operational Context</p>
                </div>
                <div className="flex gap-4 items-center">
                   <div className="text-center px-4 border-r border-white/5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Velocity</p>
                      <p className="text-lg font-bold text-white">88%</p>
                   </div>
                   <div className="text-center px-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Sync</p>
                      <p className="text-lg font-bold text-white">92%</p>
                   </div>
                   <Link href={`/${locale}/internal/performance`}>
                      <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl gap-2">
                         View Full Audit
                         <ChevronRight className="w-3 h-3" />
                      </Button>
                   </Link>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-3 font-medium">
                   <div className="flex justify-between text-xs uppercase tracking-tighter">
                      <span className="flex items-center gap-2 text-white/60"><Target className="w-3 h-3 text-indigo-400" /> Onboarding Path</span>
                      <span className="text-indigo-400 font-bold">75% Complete</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[75%]" />
                   </div>
                </div>
                <div className="space-y-3 font-medium">
                   <div className="flex justify-between text-xs uppercase tracking-tighter">
                      <span className="flex items-center gap-2 text-white/60"><TrendingUp className="w-3 h-3 text-emerald-400" /> Mission Reliability</span>
                      <span className="text-emerald-400 font-black">Industrial Grade</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[95%]" />
                   </div>
                </div>
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
