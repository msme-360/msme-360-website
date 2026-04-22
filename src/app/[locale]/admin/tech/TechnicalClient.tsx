"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Database, Terminal, Activity, HardDrive, Zap, AlertCircle, RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { STARTUP_ROLES } from "@/lib/constants/roles";

export interface SysStat {
   label: string;
   value: string;
   status: string;
   color: string;
}

export interface ServiceStatus {
   name: string;
   status: string;
   load: string;
   uptime: string;
}

interface TechnicalPortalClientProps {
   sysStats: SysStat[];
   services: ServiceStatus[];
   role?: string;
   subView?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
   "Supabase Response": Database,
   "AI Inference Latency": Zap,
   "Platform Uptime": Activity,
   "Error Rate (24h)": AlertCircle,
};

export function TechnicalPortalClient({ sysStats, services, role, subView }: TechnicalPortalClientProps) {
   const roleLabel = role ? STARTUP_ROLES[role]?.label : "Platform";

   if (subView) {
      const subViewTitles: Record<string, string> = {
         ip: "Intellectual Property",
         security: "Cybersecurity Bureau",
         resilience: "System Resilience",
         velocity: "Delivery Velocity",
      };

      const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

      return (
         <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
            <div className="p-5 bg-white/5 rounded-full mb-6 relative">
               <Activity className="w-10 h-10 text-primary animate-pulse" />
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">Syncing {title} Feed</h3>
            <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
               MSME 360 AI is mapping real-time technical telemetry and service logs for <strong>{title}</strong>.
            </p>
         </div>
      );
   }

   return (
      <div className="space-y-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-display font-bold tracking-tight">{roleLabel} Diagnostics</h1>
               <p className="text-muted-foreground text-sm">Deep technical insights for {roleLabel} and Systems Architecture.</p>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="bg-white/5 border-white/10 rounded-lg h-9">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Node
               </Button>
               <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-500 px-3 py-1 animate-pulse">Live Link: Node-04</Badge>
            </div>
         </div>

         {/* System Health Overview */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sysStats.map((s, i) => {
               const Icon = ICON_MAP[s.label] || Activity;
               return (
                  <motion.div
                     key={s.label}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1 }}
                  >
                     <Card className="glass-card border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                           <Icon className="w-12 h-12" />
                        </div>
                        <CardContent className="p-6">
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{s.label}</p>
                           <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-3xl font-display font-bold tabular-nums">{s.value}</span>
                              <span className={`text-[10px] font-bold ${s.color} uppercase`}>{s.status}</span>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full bg-current ${s.color.replace('text-', 'bg-')} opacity-50`} style={{ width: '70%' }} />
                           </div>
                        </CardContent>
                     </Card>
                  </motion.div>
               );
            })}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Grid */}
            <Card className="lg:col-span-2 glass-card border-white/10 overflow-hidden">
               <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Service Constellation</CardTitle>
                     </div>
                     <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-bold uppercase tracking-widest">All Nodes Healthy</Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                     {services.map((service) => (
                        <div key={service.name} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${service.status === 'Operational' || service.status === 'Optimal' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-yellow-500 Shadow-[0_0_8px_rgba(234,179,8,0.4)]'}`} />
                              <div className="space-y-0.5">
                                 <p className="text-sm font-bold">{service.name}</p>
                                 <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{service.status}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <div className="text-right">
                                 <p className="text-xs font-bold">{service.load}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">Load</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs font-bold font-display text-primary">{service.uptime}</p>
                                 <p className="text-[10px] text-muted-foreground uppercase">Uptime</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Infra Stats */}
            <div className="space-y-6">
               <Card className="glass-card border-white/5">
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-blue-400" />
                        Storage Utilization
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span>Blob Storage</span>
                           <span>4.2 GB / 10 GB</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]" style={{ width: '42%' }} />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span>Database</span>
                           <span>840 MB / 5 GB</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-primary shadow-glow" style={{ width: '16.8%' }} />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-yellow-500/5 border-yellow-500/10 p-6">
                  <div className="flex gap-4">
                     <div className="mt-1">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-yellow-500">Scale Warning</p>
                        <p className="text-xs text-yellow-500/70 leading-relaxed">
                           MicroAI inference calls have increased by 240% since yesterday. Cluster auto-scaling is active.
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   );
}


