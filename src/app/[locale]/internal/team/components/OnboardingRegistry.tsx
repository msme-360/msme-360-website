"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserCheck, Clock, FileText, 
  ChevronRight, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function OnboardingRegistry() {
  const onboardingItems = [
    { name: "Rahul Sharma", role: "Frontend Intern", progress: 65, status: "Active", mentor: "Team Lead Alpha" },
    { name: "Priya Patel", role: "Backend Intern", progress: 30, status: "Pending Docs", mentor: "Engineering Lead" },
    { name: "Amit Kumar", role: "UI/UX Intern", progress: 95, status: "Finalizing", mentor: "Design Director" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Onboarding Registry</h2>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Protocol Activation & Personnel Integration</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search applicants..." className="pl-10 h-10 w-64 glass-card bg-white/5 border-white/10" />
          </div>
          <Button className="bg-primary hover:bg-primary/90 font-bold h-10 rounded-xl px-6 shadow-glow">Initialize Unit</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-emerald-500/10 bg-emerald-500/[0.01]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0">ACTIVE</Badge>
            </div>
            <h3 className="text-3xl font-bold">12</h3>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">Personnel Onboarding</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-amber-500/10 bg-amber-500/[0.01]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 border-0">PENDING</Badge>
            </div>
            <h3 className="text-3xl font-bold">04</h3>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">Credential Sync</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/10 bg-primary/[0.01]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <Badge className="bg-primary/20 text-primary border-0">TOTAL</Badge>
            </div>
            <h3 className="text-3xl font-bold">128</h3>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-1">Archived Protocols</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personnel</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Unit Role</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lead Sync</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Progress</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {onboardingItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">ID: 00{idx + 1}-TACTICAL</div>
                  </td>
                  <td className="p-6">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[9px] font-bold uppercase">{item.role}</Badge>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">TS</div>
                      <span className="text-xs font-medium text-muted-foreground">{item.mentor}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="w-full max-w-[120px] space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase">
                        <span>Sync</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                          style={{ width: `${item.progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className="text-xs font-medium">{item.status}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
