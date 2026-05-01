"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LogOut, 
  ShieldAlert, 
  Key, 
  CheckCircle2,
  AlertTriangle,
  History
} from "lucide-react";
import { toast } from "sonner";
import { getOffboardingTargets, executeStrategicExit } from "@/app/[locale]/admin/actions";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExitStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'completed' | 'error';
}

const INITIAL_STEPS: ExitStep[] = [
  { id: "REVOKE-01", label: "Auth Revocation", description: "Termination of Supabase Auth sessions and credentials.", status: 'pending' },
  { id: "ASSETS-02", label: "Asset Recovery", description: "Verification of hardware and digital asset return.", status: 'pending' },
  { id: "NDA-03", label: "NDA Re-Affirmation", description: "Signing of post-employment confidentiality agreement.", status: 'pending' },
  { id: "AUDIT-04", label: "Final Audit Sign-off", description: "Governance board review of departure logs.", status: 'pending' }
];

export default function StrategicExitFlow() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [processing, setProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    getOffboardingTargets().then(setUsers);
  }, []);

  const handleExecute = async () => {
    if (!selectedUser) {
      toast.error("No Target Selected", { description: "You must select a user to offboard." });
      return;
    }

    setProcessing(true);
    let currentIdx = 0;

    const interval = setInterval(async () => {
      if (currentIdx >= steps.length) {
        clearInterval(interval);
        
        const res = await executeStrategicExit(selectedUser);
        if (res.success) {
          setProcessing(false);
          toast.success("Strategic Exit Completed", {
            description: "All access revoked and records archived in the Governance Ledger.",
            className: "glass-card border-rose-500/20 text-white"
          });
        } else {
          setProcessing(false);
          toast.error("Execution Failure", { description: res.error });
        }
        return;
      }

      setSteps(prev => prev.map((step, idx) => 
        idx === currentIdx ? { ...step, status: 'completed' } : step
      ));
      currentIdx++;
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400">
            <LogOut className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Strategic Offboarding</h2>
            <p className="text-sm text-muted-foreground uppercase font-black tracking-widest mt-1">Access Revocation & Asset Recovery</p>
          </div>
        </div>
        <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/5 font-black uppercase tracking-widest py-1.5 px-4">
          Protocol 7-Delta
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-white/10 bg-white/[0.01]">
          <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Offboarding Execution Pipeline</CardTitle>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Target:</span>
                <Select onValueChange={setSelectedUser} value={selectedUser || undefined}>
                  <SelectTrigger className="h-8 bg-white/10 border-none text-white text-xs min-w-[200px]">
                    <SelectValue placeholder="Select Target User" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-white/10 bg-slate-900">
                    {users.map(u => (
                      <SelectItem key={u.id} value={u.id} className="text-xs">
                        {u.full_name} ({u.designation || u.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {steps.map((step) => (
                <div key={step.id} className="p-6 flex items-start gap-6 hover:bg-white/[0.01] transition-colors group">
                  <div className={`p-3 rounded-xl transition-all ${
                    step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-muted-foreground group-hover:text-white'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm font-bold ${step.status === 'completed' ? 'text-emerald-400' : 'text-white'}`}>
                        {step.label}
                      </p>
                      <Badge variant="ghost" className="text-[8px] font-black uppercase tracking-widest opacity-50">
                        {step.id}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-rose-500/[0.02] border-t border-rose-500/10">
              <div className="flex items-start gap-4 mb-8">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <p className="text-xs text-rose-400/80 leading-relaxed italic">
                  Warning: Strategic exit is permanent. Executing this protocol will purge all session tokens and mark the member profile as &apos;Inactive&apos; in the Governance Registry.
                </p>
              </div>
              <Button 
                className="w-full h-14 font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-50"
                onClick={handleExecute}
                disabled={processing}
              >
                {processing ? "Executing Revocation Protocol..." : "Finalize Strategic Exit"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card border-rose-500/20 bg-rose-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-rose-400" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Authority Check</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Authenticated Admin</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold border border-rose-500/20">SA</div>
                  <p className="text-sm font-bold">Board Super Admin</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                  <span>Sign-off Readiness</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-1 bg-white/5" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-rose-400" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Recent Exits</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[
                  { name: "John Doe", role: "Jr. Developer", date: "2 days ago" },
                  { name: "Sarah Smith", role: "Intern", date: "5 days ago" },
                  { name: "Mike Ross", role: "Analyst", date: "1 week ago" },
                ].map((exit, i) => (
                  <div key={i} className="p-4 flex items-center justify-between group cursor-default hover:bg-white/[0.01]">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold group-hover:text-rose-400 transition-colors">{exit.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">{exit.role}</p>
                    </div>
                    <span className="text-[9px] text-muted-foreground italic">{exit.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
