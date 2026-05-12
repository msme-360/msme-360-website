"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Power, 
  ShieldAlert, 
  Cpu, 
  Globe, 
  Database,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import {
  toggleSystemMode,
  executeProtocolZero,
  initiateSystemReIndex,
} from "@/app/[locale]/admin/actions";
import { SystemHealth } from "@/types/governance";

export default function SystemControlPanel({ health }: { health?: SystemHealth[] }) {
  const [maintenance, setMaintenance] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dbHealth = health?.find(h => h.name === 'database');
  const cdnHealth = health?.find(h => h.name === 'cdn') || { load_percentage: 14 };
  const dbConnections = dbHealth?.load_percentage || 84;

  const handleToggle = (mode: 'maintenance' | 'read_only', value: boolean, setter: (v: boolean) => void) => {
    startTransition(async () => {
      setter(value);
      const result = await toggleSystemMode(mode, value);
      if (result.success) {
        const label = mode === 'maintenance' ? 'Maintenance Mode' : 'Global Read-Only Mode';
        toast.success(`${label} ${value ? 'Enabled' : 'Disabled'}`, {
          description: `Protocol update synchronized and logged to Governance Ledger.`,
          className: "glass-card border-indigo-500/20 text-white"
        });
      } else {
        setter(!value); // rollback
        toast.error("Authority Check Failed", {
          description: result.error,
          className: "glass-card border-rose-500/20 text-white"
        });
      }
    });
  };

  const handleProtocolZero = () => {
    startTransition(async () => {
      const result = await executeProtocolZero();
      if (result.success) {
        toast.error("Protocol Zero Executed", {
          description: "Emergency lockdown recorded in the Immutable Governance Ledger. All caches invalidated.",
          className: "glass-card border-rose-500/20 text-white",
          duration: 8000,
        });
      } else {
        toast.error("Execution Blocked", {
          description: result.error,
          className: "glass-card border-rose-500/20 text-white"
        });
      }
    });
  };

  const handleReIndex = () => {
    startTransition(async () => {
      const result = await initiateSystemReIndex();
      if (result.success) {
        toast.success("System Re-Index Initiated", {
          description: "All platform caches invalidated. Routes will re-hydrate on next request.",
          className: "glass-card border-indigo-500/20 text-white"
        });
      } else {
        toast.error("Re-Index Failed", {
          description: result.error,
          className: "glass-card border-rose-500/20 text-white"
        });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-rose-500/20 bg-rose-500/[0.02]">
          <CardHeader className="border-b border-rose-500/10">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-rose-400" />
              <CardTitle>System Lockdown Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Maintenance Mode</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Redirects all non-L0 traffic</p>
              </div>
              <Switch 
                checked={maintenance} 
                onCheckedChange={(val) => handleToggle('maintenance', val, setMaintenance)}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Global Read-Only</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Freezes all database mutations</p>
              </div>
              <Switch 
                checked={readOnly} 
                onCheckedChange={(val) => handleToggle('read_only', val, setReadOnly)}
                disabled={isPending}
              />
            </div>

            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20">
              <div className="flex items-start gap-4 mb-6">
                <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-rose-400 uppercase tracking-tighter">Emergency Kill-Switch</p>
                  <p className="text-xs text-rose-400/60 leading-relaxed">
                    Immediate termination of all active sessions and platform suspension. 
                    Requires manual L0-Board override to resume.
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="w-full h-12 font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-50"
                onClick={handleProtocolZero}
                disabled={isPending}
              >
                {isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Execute Protocol Zero
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-indigo-500/20 bg-indigo-500/[0.02]">
          <CardHeader className="border-b border-indigo-500/10">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <CardTitle>Infrastructure Integrity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-none text-[8px]">Active</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">CDN Latency</p>
                <p className="text-2xl font-bold">{cdnHealth.load_percentage}ms</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <Badge variant="outline" className={`border-none text-[8px] ${dbConnections > 150 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{dbConnections > 150 ? 'Heavy' : 'Stable'}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">DB Connections</p>
                <p className="text-2xl font-bold">{dbConnections}/200</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center px-2">
                 <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">System Entropy</p>
                 <RefreshCw className={`w-3 h-3 text-indigo-400 ${isPending ? 'animate-spin' : 'animate-spin-slow'}`} />
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className={`h-full bg-indigo-500 transition-all duration-1000`} style={{ width: `${Math.min(100, (dbConnections / 200) * 100)}%` }} />
               </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-400 font-bold tracking-tight disabled:opacity-50"
              onClick={handleReIndex}
              disabled={isPending}
            >
              {isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Initiate Full System Re-Index
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
