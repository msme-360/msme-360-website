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
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getExecutiveAnalytics, ExecutiveAnalytics } from "@/app/[locale]/admin/actions";
import { Skeleton } from "@/components/ui/skeleton";

interface RoadmapItem {
  title: string;
  progress: number;
  status: string;
  color: string;
}

interface DecisionItem {
  id: number;
  action: string;
  responsible: string;
  date: string;
}

export function ExecutivePortalClient() {
  const t = useTranslations("Executive");
  const [data, setData] = useState<ExecutiveAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getExecutiveAnalytics();
      setData(result);
      setLoading(false);
    }
    load();
  }, []);

  const metrics = data ? [
    { label: t('metrics.totalPresence'), value: data.metrics.totalPresence, change: "+12.5%", icon: Building2 },
    { label: t('metrics.activeInternships'), value: data.metrics.activeInternships, change: "+8.2%", icon: Users },
    { label: t('metrics.aiCapability'), value: data.metrics.aiCapability, change: "+3.1%", icon: Zap },
    { label: t('metrics.complianceScore'), value: data.metrics.complianceScore, change: "+0.5%", icon: ShieldCheck },
  ] : [];

  return (
    <AdminViewWrapper
      title={t('title')}
      subtitle={t('subtitle')}
      badgeLabel={t('badge')}
      authorityLevel={t('authority')}
    >
      <div className="space-y-10">
        {/* High-Level Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />)
          ) : metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-white/5 overflow-hidden group hover:border-primary/40 transition-all duration-500 bg-white/[0.01] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 shadow-lg shadow-primary/5">
                      <m.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="ghost" className="text-green-400 font-black bg-green-500/10 border border-green-500/20 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px]">
                      {m.change}
                      <ArrowUpRight className="w-3 h-3" />
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-4xl font-display font-black tracking-tighter bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{m.label}</p>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Operational Pulses */}
        {!loading && data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card border-indigo-500/10 bg-indigo-500/[0.02] p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="w-24 h-24 text-indigo-400" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Personnel Pulse</span>
                  </div>
                  <div>
                    <p className="text-4xl font-display font-black text-white">{data.metrics.personnelCount}</p>
                    <p className="text-xs text-indigo-100/40 uppercase font-bold tracking-widest mt-1">Total Verified Agents</p>
                  </div>
               </div>
            </Card>
            <Card className="glass-card border-amber-500/10 bg-amber-500/[0.02] p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Target className="w-24 h-24 text-amber-400" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Support Throughput</span>
                  </div>
                  <div>
                    <p className="text-4xl font-display font-black text-white">{data.metrics.supportLoad}</p>
                    <p className="text-xs text-amber-100/40 uppercase font-bold tracking-widest mt-1">Pending Operational Tickets</p>
                  </div>
               </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Strategic Roadmap */}
          <Card className="lg:col-span-2 glass-card border-white/10 overflow-hidden bg-white/[0.01]">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{t('roadmap.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                {loading ? (
                  <Skeleton className="h-64 w-full rounded-xl bg-white/5" />
                ) : (data?.roadmap.length ? data.roadmap : [
                  { title: "MicroAI Hub Public Release", progress: 85, status: t('roadmap.onTrack'), color: "bg-primary" },
                  { title: "Enterprise Mentorship Scale-up", progress: 40, status: t('roadmap.inProgress'), color: "bg-accent" },
                  { title: "State-wide Compliance Sync", progress: 15, status: t('roadmap.planning'), color: "bg-muted-foreground" },
                ] as RoadmapItem[]).map((item: RoadmapItem) => (
                  <div key={item.title} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-bold tracking-tight">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.status}</p>
                      </div>
                      <span className="text-sm font-black text-primary">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className={`h-1.5 ${item.color}`} />
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
                <CardTitle className="text-lg">{t('governance.title')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {loading ? (
                   Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full bg-white/5" />)
                ) : (data?.recentDecisions.length ? data.recentDecisions : [
                  { id: 1, action: "Approved Q4 GTM Strategy", responsible: "Managing Partner", date: "2h ago" },
                  { id: 2, action: "AI Hub Beta Expansion", responsible: "CTO", date: "5h ago" },
                  { id: 3, action: "Internship Budget Reallocation", responsible: "CEO", date: "1d ago" },
                ] as DecisionItem[]).map((d: DecisionItem) => (
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
                  {t('governance.archive')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
