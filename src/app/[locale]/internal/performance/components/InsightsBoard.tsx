"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
   CheckCircle2,
   AlertCircle
} from "lucide-react";

export default function InsightsBoard() {
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
                     <span>Technical Execution</span>
                     <span className="text-emerald-400">0%</span>
                  </div>
                  <Progress value={0} className="h-1 bg-emerald-500/10" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                     <span>Departmental Sync</span>
                     <span className="text-emerald-400">0%</span>
                  </div>
                  <Progress value={0} className="h-1 bg-emerald-500/10" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                     <span>Industrial Ethics</span>
                     <span className="text-emerald-400">100%</span>
                  </div>
                  <Progress value={100} className="h-1 bg-emerald-500/10" />
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
               <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Badge className="bg-amber-500/20 text-amber-400 border-none shrink-0">L3 Skill</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                     Improve **Proactive Troubleshooting** logs in Manager Hub to accelerate L2 status transition.
                  </p>
               </div>
               <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-none shrink-0">Comms</Badge>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                     Increase **Tactical Briefing Engagement** via mission comments to 100%.
                  </p>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
