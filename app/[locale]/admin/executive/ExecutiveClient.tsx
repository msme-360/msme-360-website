"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  Target,
  History,
  Building2,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export function ExecutivePortalClient() {
  const metrics = [
    { label: "Total MSME Presence", value: "4,281", change: "+12.5%", icon: Building2 },
    { label: "Active Internships", value: "128", change: "+8.2%", icon: Users },
    { label: "AI Capability Index", value: "94.2", change: "+3.1%", icon: Zap },
    { label: "Compliance Score", value: "98%", change: "+0.5%", icon: ShieldCheck },
  ];

  const recentDecisions = [
    { id: 1, action: "Approved Q4 GTM Strategy", responsible: "Managing Partner", date: "2h ago" },
    { id: 2, action: "AI Hub Beta Expansion", responsible: "CTO", date: "5h ago" },
    { id: 3, action: "Internship Budget Reallocation", responsible: "CEO", date: "1d ago" },
  ];

  return (
    <AdminViewWrapper
      title="Executive Intelligence"
      subtitle="Strategic overview for MSME 360 Governance Board."
      badgeLabel="BOARD VIEW ACTIVE"
      authorityLevel="Live Analytics"
    >
      <div className="space-y-10">
        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300 bg-white/[0.01]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                      <m.icon className="w-5 h-5" />
                    </div>
                    <Badge variant="ghost" className="text-green-500 font-bold bg-green-500/10 border-none flex items-center gap-0.5">
                      {m.change}
                      <ArrowUpRight className="w-3 h-3" />
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold tracking-tighter">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategic Roadmap */}
          <Card className="lg:col-span-2 glass-card border-white/10 overflow-hidden bg-white/[0.01]">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Q4 Strategic Roadmap</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {[
                  { title: "MicroAI Hub Public Release", progress: 85, status: "On Track", color: "bg-primary" },
                  { title: "Enterprise Mentorship Scale-up", progress: 40, status: "In Progress", color: "bg-accent" },
                  { title: "State-wide Compliance Sync", progress: 15, status: "Planning", color: "bg-muted-foreground" },
                ].map((item) => (
                  <div key={item.title} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-bold tracking-tight">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.status}</p>
                      </div>
                      <span className="text-sm font-black text-primary">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Board Decisions */}
          <Card className="glass-card border-white/10 overflow-hidden bg-white/[0.01]">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                 <History className="w-5 h-5 text-accent" />
                 <CardTitle className="text-lg">Recent Governance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {recentDecisions.map((d) => (
                  <div key={d.id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-default">
                    <p className="text-sm font-bold mb-1">{d.action}</p>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      <span>{d.responsible}</span>
                      <span>{d.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/[0.01]">
                 <Button variant="ghost" className="w-full h-8 text-xs font-bold text-primary hover:bg-primary/5">
                   Audit Archive
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
