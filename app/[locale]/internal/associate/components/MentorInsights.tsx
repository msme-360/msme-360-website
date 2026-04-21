
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GraduationCap, MessageSquare, ArrowRight } from "lucide-react";

interface MentorInsightsProps {
  mentor: {
    full_name: string;
    avatar_url: string | null;
    designation: string;
    department: string;
  } | null;
}

export default function MentorInsights({ mentor }: MentorInsightsProps) {
  return (
    <Card className="glass-card bg-emerald-500/5 border-emerald-500/20 overflow-hidden relative group">
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full transition-all group-hover:scale-150 duration-700" />
      <CardHeader>
        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          Mentor Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {mentor ? (
          <>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-emerald-500/20 ring-4 ring-emerald-500/5">
                {mentor.avatar_url && (
                  <AvatarImage src={mentor.avatar_url} alt={mentor.full_name} className="object-cover" />
                )}
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase">
                  {mentor.full_name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold text-white">{mentor.full_name}</p>
                <p className="text-[10px] text-emerald-400/60 uppercase font-black tracking-tighter">
                  {mentor.designation} • {mentor.department}
                </p>
              </div>
            </div>
            <p className="text-sm text-indigo-100/60 italic leading-relaxed font-medium">
              &quot;Consistency is the industrial standard. Your participation logs define your reliability profile in our ecosystem.&quot;
            </p>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-[10px] uppercase font-black tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <MessageSquare className="w-3.5 h-3.5" />
              Direct Comms
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p className="text-xs italic opacity-40">Mentor Not Assigned</p>
            <p className="text-[10px] uppercase tracking-widest mt-2">Awaiting Personnel induction</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
