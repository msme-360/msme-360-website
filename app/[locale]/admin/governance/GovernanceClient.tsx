"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Lock, 
  FileCheck2,
  TrendingUp,
  Scale,
  History,
  UserCheck,
  User,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { DashboardProfile } from "@/types/dashboard";

interface GovernanceClientProps {
  profile: DashboardProfile;
}

export function GovernanceClient({ profile }: GovernanceClientProps) {
  const governanceMetrics = [
    { label: "Equity Integrity", value: "100%", change: "Verified", icon: Scale, status: "Secure" },
    { label: "Board Resolutions", value: "24", change: "+3 this month", icon: FileCheck2, status: "Active" },
    { label: "System Uptime", value: "99.99%", change: "Stable", icon: TrendingUp, status: "Optimal" },
    { label: "Access Controls", value: "Hardened", change: "Layer 0", icon: Lock, status: "Strict" },
  ];

  const recentBoardActions = [
    { id: 1, action: "Ratified Q4 Strategic Plan", author: "Managing Partner", date: "4h ago", level: "Critical" },
    { id: 2, action: "System Hardening Verification", author: "Internal Auditor", date: "1d ago", level: "Complete" },
    { id: 3, action: "Authorized Series A Preparation", author: "Board of Directors", date: "3d ago", level: "Critical" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Governance Center</h2>
          <p className="text-muted-foreground text-sm font-medium">Level 0 Board Control and system integrity monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 font-bold">BOARD PRIVILEGED</Badge>
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">Immutable Logs</div>
        </div>
      </div>

      <Tabs defaultValue="governance" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="governance" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Control Center
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="w-3.5 h-3.5" />
            Governance Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="governance" className="space-y-10 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {governanceMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <m.icon className="w-5 h-5" />
                      </div>
                      <Badge variant="ghost" className="text-[10px] font-black uppercase tracking-tighter bg-white/5">
                        {m.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-display font-bold tracking-tighter">{m.value}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.label}</p>
                        <span className="text-[10px] text-primary font-bold">{m.change}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glass-card border-white/10 overflow-hidden bg-white/[0.01]">
              <CardHeader className="bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Governance Framework</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold">V1.4 Stable</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {[
                      { title: "Statutory Compliance", progress: 100, status: "Verified" },
                      { title: "Risk Mitigation Flow", progress: 92, status: "Active" },
                      { title: "Board Seat Allocation", progress: 100, status: "Fixed" },
                    ].map((item) => (
                      <div key={item.title} className="space-y-3">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-sm font-bold tracking-tight text-white/90">{item.title}</p>
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest">{item.status}</p>
                          </div>
                          <span className="text-sm font-black text-white">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-1 bg-white/5" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center items-center p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                    <UserCheck className="w-12 h-12 text-primary mb-4 opacity-50" />
                    <h3 className="text-lg font-bold mb-2">Audit Ready</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px]">All system logs are signed and prepared for the upcoming Q4 Compliance Audit.</p>
                    <Button className="mt-6 w-full h-10 font-bold tracking-tight shadow-glow">Initiate Full Audit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                   <History className="w-5 h-5 text-indigo-400" />
                   <CardTitle className="text-lg">Immutable Journal</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {recentBoardActions.map((action) => (
                    <div key={action.id} className="p-5 hover:bg-white/[0.02] transition-all cursor-default group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{action.action}</p>
                        <Badge className="text-[9px] font-black uppercase tracking-tighter h-5 bg-white/10 border-none">
                          {action.level}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        <span>{action.author}</span>
                        <span>{action.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-white/[0.01]">
                   <Button variant="ghost" className="w-full h-9 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                     View Blockchain Archive
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <ProfileTabContent profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
