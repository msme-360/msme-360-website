"use client";

import { useState } from "react";
import { 
  History, Search, Filter, Download, 
  ShieldCheck, 
  ShieldAlert, Activity, Cpu, Globe,
  Lock, Unlock, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSystemMode, overrideSystemAction, runPolicyAudit } from "../actions";

export interface AuditLog {
  id: string;
  action: string;
  target: string | null;
  status: 'success' | 'warning' | 'error';
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface AuditClientProps {
  initialLogs: AuditLog[];
}

export function AuditClient({ initialLogs }: AuditClientProps) {
  const [activeTab, setActiveTab] = useState("ledger");
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const alertCount = initialLogs.filter(log => log.status === 'error').length;
  const warningCount = initialLogs.filter(log => log.status === 'warning').length;

  const handleShieldToggle = async () => {
    setIsProcessing(true);
    const newStatus = !isShieldActive;
    const res = await toggleSystemMode('maintenance', newStatus);
    if (res.success) {
      setIsShieldActive(newStatus);
      toast.success(`System Shield ${newStatus ? 'Activated' : 'Deactivated'}`);
    } else {
      toast.error("Shield synchronization failure.");
    }
    setIsProcessing(false);
  };

  const handleRunAudit = async () => {
    toast.promise(runPolicyAudit(), {
      loading: 'The Guardian is scanning platform missions...',
      success: (res) => `Audit complete. ${res.anomaliesDetected} anomalies logged to the ledger.`,
      error: 'Guardian scan failed.'
    });
  };

  const handleOverride = async (log: AuditLog) => {
    if (!log.target) return;
    const res = await overrideSystemAction(log.id, log.action, log.target);
    if (res.success) {
      toast.success("Protocol overridden successfully.");
    } else {
      toast.error("Override rejected by security daemon.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header & Global Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3">
            L6 Super Admin Access
          </Badge>
          <h1 className="text-4xl font-display font-bold tracking-tighter text-white flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
            Governance <span className="text-indigo-400 italic">Control Center</span>
          </h1>
          <p className="text-indigo-100/40 mt-1 text-sm font-medium uppercase tracking-widest">
            High-fidelity oversight and protocol management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleShieldToggle}
            disabled={isProcessing}
            className={`h-12 px-6 rounded-2xl border-white/5 text-[10px] font-black uppercase tracking-widest transition-all ${isShieldActive ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'}`}
          >
            {isShieldActive ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
            {isShieldActive ? 'Shield Active' : 'System Open'}
          </Button>
          <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-4 h-4 mr-2" />
            Protocol Flush
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-14">
          <TabsTrigger value="ledger" className="rounded-xl px-8 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest h-full">
            <History className="w-4 h-4 mr-2" /> Activity Ledger
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 data-[state=active]:bg-red-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest h-full">
            <ShieldAlert className="w-4 h-4 mr-2" /> Security Ops
          </TabsTrigger>
          <TabsTrigger value="health" className="rounded-xl px-8 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest h-full">
            <Activity className="w-4 h-4 mr-2" /> System Health
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card border-indigo-500/10 rounded-3xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest font-black text-indigo-400">Ledger Integrity</CardDescription>
                <CardTitle className="text-3xl font-display font-bold text-white">100%</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 shadow-glow" style={{ width: '100%' }} />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-red-500/10 rounded-3xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest font-black text-red-400">Critical Anomalies</CardDescription>
                <CardTitle className="text-3xl font-display font-bold text-white">{alertCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-red-500 shadow-glow ${alertCount > 0 ? 'w-full' : 'w-0'}`} />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/5 rounded-3xl md:col-span-2">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest font-black text-indigo-100/40">Compliance Status</CardDescription>
                <CardTitle className="text-3xl font-display font-bold text-white">{warningCount > 0 ? "Drift Detected" : "Optimal"}</CardTitle>
              </CardHeader>
              <CardContent className="text-[10px] text-indigo-100/30 uppercase font-bold tracking-widest">
                Governance protocols are currently enforcing L6-L1 standard alignment.
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card overflow-hidden border-white/5 rounded-3xl">
            <CardHeader className="bg-white/5 border-b border-white/5 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-100/40" />
                  <Input placeholder="Search governance ledger..." className="pl-12 h-12 bg-black/40 border-white/10 rounded-2xl text-sm" />
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest">
                    <Filter className="w-4 h-4 mr-2 text-indigo-400" /> Filter
                  </Button>
                  <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest">
                    <Download className="w-4 h-4 mr-2 text-indigo-400" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-8 py-5 font-black text-indigo-100/40 uppercase tracking-widest text-[10px]">Action Protocol</th>
                      <th className="px-8 py-5 font-black text-indigo-100/40 uppercase tracking-widest text-[10px]">Originator</th>
                      <th className="px-8 py-5 font-black text-indigo-100/40 uppercase tracking-widest text-[10px]">Target Entity</th>
                      <th className="px-8 py-5 font-black text-indigo-100/40 uppercase tracking-widest text-[10px]">Temporal Index</th>
                      <th className="px-8 py-5 font-black text-indigo-100/40 uppercase tracking-widest text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-5 font-bold text-indigo-50">{log.action}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-[10px] text-indigo-400 font-black border border-indigo-500/20">
                              {(log.profiles?.full_name || "Sys").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-indigo-100/80">{log.profiles?.full_name || "SYSTEM_DAEMON"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-indigo-100/40 font-mono text-xs">{log.target || "GLOBAL"}</td>
                        <td className="px-8 py-5 text-[10px] font-black text-indigo-100/40 uppercase tracking-tighter italic">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-8 py-5">
                          <Badge className={`text-[9px] font-black uppercase tracking-widest border-0 ${
                            log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                            log.status === 'warning' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {log.status !== 'success' && log.target && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOverride(log)}
                              className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300"
                            >
                              Override
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-8">
           <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
             <ShieldAlert className="w-12 h-12 text-primary/20 mb-4" />
             <h3 className="text-xl font-bold mb-2 tracking-tight">Governance Intelligence</h3>
             <p className="text-muted-foreground text-sm max-w-sm text-center leading-relaxed mb-6">
               Initiate a deep scan of all platform missions, applications, and system indices to detect policy anomalies.
             </p>
             <Button 
               onClick={handleRunAudit}
               className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 h-11 px-8 rounded-xl font-bold transition-all"
             >
               <Search className="w-4 h-4 mr-2" />
               Run Policy Audit (The Guardian)
             </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card border-red-500/10 rounded-3xl p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <ShieldAlert className="w-8 h-8 text-red-400" />
                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px] font-black">LIVE THREATS</Badge>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white">Brute Force Mitigation</h3>
                    <p className="text-xs text-indigo-100/40 leading-relaxed uppercase tracking-widest">3 blocked attempts in last hour from 182.xx.xx.xx</p>
                 </div>
                 <Button className="w-full h-11 rounded-2xl bg-red-600 hover:bg-red-500 text-[10px] font-black uppercase tracking-widest">Blacklist IP Block</Button>
              </Card>

              <Card className="glass-card border-indigo-500/10 rounded-3xl p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <Lock className="w-8 h-8 text-indigo-400" />
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[9px] font-black">PROTOCOL</Badge>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white">MFA Enforcement</h3>
                    <p className="text-xs text-indigo-100/40 leading-relaxed uppercase tracking-widest">Active for 100% of L4-L6 personnel.</p>
                 </div>
                 <Button variant="outline" className="w-full h-11 rounded-2xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest">Audit Credentials</Button>
              </Card>

              <Card className="glass-card border-amber-500/10 rounded-3xl p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <Globe className="w-8 h-8 text-amber-400" />
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] font-black">GEOGRAPHIC</Badge>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-white">Origin Shielding</h3>
                    <p className="text-xs text-indigo-100/40 leading-relaxed uppercase tracking-widest">Restricting management access to validated nodes.</p>
                 </div>
                 <Button variant="outline" className="w-full h-11 rounded-2xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest">Update Allowlist</Button>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "API Latency", value: "24ms", icon: Activity, color: "text-emerald-400" },
                { label: "DB Connections", value: "12 / 100", icon: Zap, color: "text-indigo-400" },
                { label: "CPU Utilization", value: "4.2%", icon: Cpu, color: "text-amber-400" },
                { label: "Cache Hit Rate", value: "98.4%", icon: ShieldCheck, color: "text-emerald-400" }
              ].map((stat, i) => (
                <Card key={i} className="glass-card border-white/5 rounded-3xl p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100/40">{stat.label}</p>
                    <p className="text-xl font-display font-bold text-white">{stat.value}</p>
                  </div>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
