"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardMetric } from "@/types/dashboard";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingItem } from "@/app/[locale]/internal/associate/components/AssociateTypes";

export default function OnboardingFlow({ 
  metrics = [], 
  checklist = [],
  onUpdate
}: { 
  metrics?: DashboardMetric[],
  checklist?: OnboardingItem[],
  onUpdate?: (id: string, completed: boolean) => void
}) {
  return (
    <Card className="glass-card border-slate-500/20 bg-slate-500/[0.02] overflow-hidden">
      <CardHeader className="bg-slate-500/5 border-b border-slate-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">Onboarding Flow</CardTitle>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-0.5">Operations Intelligence</p>
            </div>
          </div>
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 font-bold tracking-widest">L5 Associate</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {metrics && metrics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.slice(0, 4).map((m: DashboardMetric, idx: number) => (
              <div key={m.label || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-slate-500/20 transition-all group">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold tracking-tighter">{m.value}</p>
                  {m.change && (
                    <span className={`text-[10px] font-bold ${m.status === 'Optimal' || m.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {m.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <Activity className="w-6 h-6 text-muted-foreground/20" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Awaiting Real-time Telemetry</p>
            <p className="text-[10px] text-muted-foreground/30 uppercase tracking-widest mt-2">Silo is active but no live metrics detected</p>
          </div>
        )}

        {/* CHECKLIST */}
        {checklist && checklist.length > 0 ? (
          <div className="space-y-4 mt-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Required Missions</h3>
            <div className="grid gap-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                   <Checkbox 
                      id={item.id} 
                      checked={item.is_completed} 
                      onCheckedChange={(checked) => onUpdate?.(item.id, !!checked)} 
                      className="border-slate-500/50 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                   />
                   <label htmlFor={item.id} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 ${item.is_completed ? 'line-through text-muted-foreground' : 'text-slate-200'}`}>
                     {item.item_text}
                   </label>
                   <Badge variant="outline" className="text-[9px] uppercase border-white/10">{item.category}</Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
             <p className="text-sm text-amber-400 font-medium">No onboarding missions detected.</p>
             <p className="text-xs text-amber-400/60 mt-1">If you bypassed the recruitment pipeline, your profile was not automatically provisioned with standard checklist tasks.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
