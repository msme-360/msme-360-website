"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardMetric } from "@/types/dashboard";

export default function StrategicRoadmap({ metrics = [] }: { metrics?: DashboardMetric[] }) {
  return (
    <Card className="glass-card border-primary/20 bg-primary/[0.02] overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">Strategic Roadmap</CardTitle>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mt-0.5">Management Intelligence</p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30 font-bold tracking-widest">L1 EXEC</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {metrics && metrics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.slice(0, 4).map((m: DashboardMetric, idx: number) => (
              <div key={m.label || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
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
      </CardContent>
    </Card>
  );
}
