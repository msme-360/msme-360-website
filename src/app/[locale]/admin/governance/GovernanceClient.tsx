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
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { formatDistanceToNow } from "date-fns";
import { Database } from "@/types/supabase";
import { STARTUP_ROLES } from "@/lib/constants/roles";

export interface BoardResolution {
  id: string;
  title: string;
  level: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

export interface GovernanceMetric {
  label: string;
  value: string;
  change: string;
  status: string;
}

export type NICCode = Database['public']['Tables']['nic_codes']['Row'];

export interface GovernanceClientProps {
  initialResolutions: BoardResolution[];
  initialMetrics: GovernanceMetric[];
  nicCodes: NICCode[];
  role?: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  "Equity Integrity": Scale,
  "Board Resolutions": FileCheck2,
  "System Uptime": TrendingUp,
  "Access Controls": Lock,
};

export function GovernanceClient({ initialResolutions, initialMetrics, nicCodes, role }: GovernanceClientProps) {
  const roleLabel = role ? STARTUP_ROLES[role]?.label : "Governance";

  return (
    <AdminViewWrapper
      title={`${roleLabel} Center`}
      subtitle={`Level 0 ${roleLabel} Control and system integrity monitoring.`}
      badgeLabel="BOARD PRIVILEGED"
      authorityLevel="Immutable Logs"
    >
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {initialMetrics.map((m, i) => {
            const Icon = ICON_MAP[m.label] || ShieldCheck;
            return (
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
                        <Icon className="w-5 h-5" />
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
            );
          })}
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
                  <Button className="mt-6 w-full h-10 font-bold tracking-tight shadow-glow" variant="outline">Initiate Full Audit</Button>
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
                {initialResolutions.map((res) => (
                  <div key={res.id} className="p-5 hover:bg-white/[0.02] transition-all cursor-default group">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{res.title}</p>
                      <Badge className={`text-[9px] font-black uppercase tracking-tighter h-5 border-none ${res.level === 'Critical' ? 'bg-red-500/20 text-red-500' :
                        res.level === 'Complete' ? 'bg-green-500/20 text-green-500' : 'bg-white/10'
                        }`}>
                        {res.level}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                      <span>{res.profiles?.full_name || "Board Executive"}</span>
                      <span>{formatDistanceToNow(new Date(res.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))}
                {initialResolutions.length === 0 && (
                  <div className="p-10 text-center text-xs text-muted-foreground italic">
                    No board resolutions found in current session.
                  </div>
                )}
              </div>
              <div className="p-4 bg-white/[0.01]">
                <Button variant="ghost" className="w-full h-9 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
                  View Registry Archive
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card border-white/10 overflow-hidden bg-white/[0.01]">
          <CardHeader className="bg-white/[0.02] border-b border-white/5">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Business Classification Registry (NIC)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest font-bold">
                  <tr>
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {nicCodes.map((nic) => (
                    <tr key={nic.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4 font-mono font-bold text-primary">{nic.code}</td>
                      <td className="px-6 py-4 font-medium">{nic.category}</td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">{nic.description}</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-500/10 text-green-500 border-none text-[9px] uppercase font-black">Verified</Badge>
                      </td>
                    </tr>
                  ))}
                  {nicCodes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground italic text-xs">
                        No NIC codes registered in system.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminViewWrapper>
  );
}
