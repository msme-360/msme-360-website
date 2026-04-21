"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Settings, 
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardProfile } from "@/types/dashboard";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

interface OperationsClientProps {
  profile: DashboardProfile;
}

export function OperationsClient({ profile }: OperationsClientProps) {
  const { locale } = useParams();
  
  const stats = [
    { label: "Active Pipelines", value: "4", icon: Users, color: "text-blue-500" },
    { label: "Tech Health", value: "98.2%", icon: Zap, color: "text-amber-500" },
    { label: "Quarterly Target", value: "82%", icon: Target, color: "text-emerald-500" },
  ];

  return (
    <AdminViewWrapper
      title="Operations Hub"
      subtitle={`Strategic infrastructure and departmental oversight for ${profile?.department || 'General Operations'}.`}
      badgeLabel="OPERATIONAL DIRECTOR"
      authorityLevel="L5 Execution"
      actions={
        <Link href={`/${locale}/admin/tech`}>
          <Button className="bg-white text-black hover:bg-slate-200 rounded-xl h-10 px-6 font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-glow">
            <Settings className="w-4 h-4" />
            Infrastructure
          </Button>
        </Link>
      }
    >
      <div className="space-y-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-white/5 hover:border-blue-500/20 transition-all group cursor-default bg-white/[0.01]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                     <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-display font-bold tracking-tighter">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recruitment Pipeline Oversight */}
          <Card className="glass-card border-white/5 overflow-hidden bg-white/[0.01]">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Talent Acquisition
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Strategic oversight of your department&apos;s hiring pipeline.</p>
                </div>
                <Link href={`/${locale}/admin/hiring`}>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-400 hover:text-blue-300">
                    Manage All <ArrowRight className="ml-2 w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                 <div className="flex justify-between items-center">
                   <div className="space-y-1">
                     <h4 className="text-sm font-bold">Principal Engineer (L4)</h4>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-blue-400">Technical • Under Review</p>
                   </div>
                   <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Shortlisted</Badge>
                 </div>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group opacity-60">
                 <div className="flex justify-between items-center">
                   <div className="space-y-1">
                     <h4 className="text-sm font-bold">Operations Associate (L1)</h4>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Logistics • Internal Review</p>
                   </div>
                   <Badge variant="outline">Pending</Badge>
                 </div>
               </div>
            </CardContent>
          </Card>

          {/* Security & Access Review */}
          <Card className="bg-red-500/5 border-red-500/20 overflow-hidden">
            <CardHeader className="p-8 pb-4 text-red-100">
               <CardTitle className="text-xl flex items-center gap-2 text-red-400">
                 <ShieldAlert className="w-5 h-5" />
                 Governance Alert
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
               <p className="text-sm text-red-200/60 leading-relaxed mb-6 italic">
                 &quot;New portal isolation policies are now in effect. As a Level 2 Director, you have strategic oversight of the Operations Hub. Regular users and junior staff are restricted from this workspace.&quot;
               </p>
               <div className="flex items-center gap-2">
                  <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest border-red-500/20 hover:bg-red-500/10 text-red-400">
                    Acknowledge Security Policy
                  </Button>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
