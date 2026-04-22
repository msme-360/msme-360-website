"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";
import { PerformanceData } from "./PerformanceTypes";

interface MetricCardsProps {
  performanceData: PerformanceData;
}

export default function MetricCards({ performanceData }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-card border-white/5 bg-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Velocity</p>
              <p className="text-2xl font-bold">{performanceData.taskStats.completion_rate}%</p>
            </div>
          </div>
          <Progress value={performanceData.taskStats.completion_rate} className="h-1.5 mt-4 bg-indigo-500/10" />
        </CardContent>
      </Card>

      <Card className="glass-card border-white/5 bg-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendance Sync</p>
              <p className="text-2xl font-bold">{performanceData.attendanceStats.consistency}%</p>
            </div>
          </div>
          <Progress value={performanceData.attendanceStats.consistency} className="h-1.5 mt-4 bg-emerald-500/10" />
        </CardContent>
      </Card>

      <Card className="glass-card border-white/5 bg-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Output</p>
              <p className="text-2xl font-bold">{performanceData.taskStats.completed} <span className="text-xs text-muted-foreground">Operations</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/5 bg-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reliability Score</p>
              <p className="text-2xl font-bold">Tier A</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
