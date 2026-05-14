"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MessageSquare, Star, TrendingUp, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export interface Reflection {
  id: string;
  user_id: string;
  wins: string;
  challenges: string;
  satisfaction: number;
  week_ending: string;
  profiles?: {
    full_name: string;
    role: string;
  };
}

export function TeamReflectionClient({ reflections = [] }: { reflections: Reflection[] }) {
  return (
    <AdminViewWrapper
      title="Team Reflections"
      subtitle="Monitor weekly sentiment, wins, and challenges across your managed unit."
      badgeLabel="SENTIMENT ANALYSIS"
      authorityLevel="Lead/Manager Oversight"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {reflections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <MessageSquare className="w-12 h-12 text-primary/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Reflections Found</h3>
            <p className="text-muted-foreground text-sm">Your team hasn&apos;t submitted any weekly reflections yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reflections.map((reflection) => (
              <Card key={reflection.id} className="glass-card border-white/5 bg-white/[0.02] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{reflection.profiles?.full_name}</CardTitle>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{reflection.profiles?.role || "Associate"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Week Ending</p>
                      <Badge variant="outline" className="border-white/10 font-mono text-[10px]">
                        {format(new Date(reflection.week_ending), 'MMM dd, yyyy')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Star className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Wins & Achievements</h4>
                      </div>
                      <p className="text-sm text-indigo-100/60 leading-relaxed bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                        {reflection.wins}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Challenges Faced</h4>
                      </div>
                      <p className="text-sm text-indigo-100/60 leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                        {reflection.challenges}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <TrendingUp className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Satisfaction Index</h4>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center h-[calc(100%-1.5rem)]">
                        <span className="text-4xl font-display font-black text-primary">{reflection.satisfaction}/5</span>
                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000" 
                            style={{ width: `${(reflection.satisfaction / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminViewWrapper>
  );
}
