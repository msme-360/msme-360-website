"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
   CheckCircle2,
   AlertCircle
} from "lucide-react";

import { PerformanceData } from "./PerformanceTypes";

interface InsightsBoardProps {
   performanceData: PerformanceData;
}

export default function InsightsBoard({ performanceData }: InsightsBoardProps) {
   const { taskStats, attendanceStats } = performanceData;

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         <Card className="glass-card border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
               <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Core Competencies
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                     <span>Mission Velocity</span>
                     <span className="text-emerald-400">{taskStats.completion_rate}%</span>
                  </div>
                  <Progress value={taskStats.completion_rate} className="h-1 bg-emerald-500/10" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                     <span>Departmental Sync</span>
                     <span className="text-emerald-400">{attendanceStats.consistency}%</span>
                  </div>
                  <Progress value={attendanceStats.consistency} className="h-1 bg-emerald-500/10" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                     <span>Industrial Quality</span>
                     <span className="text-emerald-400">{attendanceStats.sync}%</span>
                  </div>
                  <Progress value={attendanceStats.sync} className="h-1 bg-emerald-500/10" />
               </div>
            </CardContent>
         </Card>

         <Card className="glass-card border-amber-500/20 bg-amber-500/5">
            <CardHeader>
               <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  Growth Opportunities
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               {attendanceStats.sync < 90 && (
                 <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Badge className="bg-amber-500/20 text-amber-400 border-none shrink-0">Punctuality</Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       Improve Industrial Quality by checking in before 10:00 AM consistently.
                    </p>
                 </div>
               )}
               {taskStats.completion_rate < 90 && (
                 <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Badge className="bg-indigo-500/20 text-indigo-400 border-none shrink-0">Velocity</Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       Increase Mission Velocity by completing pending operations in the Manager Hub.
                    </p>
                 </div>
               )}
               {taskStats.completion_rate >= 90 && attendanceStats.consistency >= 90 && (
                 <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none shrink-0">L3 Path</Badge>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                       You are currently performing at an Elite Level. Maintain this velocity for 30 days to qualify for L3 evaluation.
                    </p>
                 </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
