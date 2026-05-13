"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Zap, Star, Heart, TrendingUp, ShieldCheck } from "lucide-react";
import { Commendation } from "./AssociateTypes";
import { format } from "date-fns";

interface TacticalMeritsProps {
  commendations: Commendation[];
  tier?: string;
}

export default function TacticalMerits({ commendations, tier }: TacticalMeritsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tactical': return <Zap className="w-4 h-4 text-primary" />;
      case 'Innovation': return <Star className="w-4 h-4 text-amber-400" />;
      case 'Culture': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'Reliability': return <Award className="w-4 h-4 text-emerald-400" />;
      default: return <Award className="w-4 h-4 text-primary" />;
    }
  };

  const totalPoints = commendations.reduce((acc, c) => acc + (c.points || 0), 0);

  return (
    <Card className="glass-card border-white/5 bg-white/[0.02] overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-6 opacity-5 -mr-4 -mt-4 group-hover:rotate-12 transition-transform duration-500">
         <Award className="w-24 h-24 text-primary" />
      </div>
      
      <CardHeader className="p-6 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest px-2">Merit Badge Hub</Badge>
          </div>
          <CardTitle className="text-xl font-display font-bold tracking-tight">Tactical Merits</CardTitle>
        </div>
        <div className="text-right">
           <div className="text-2xl font-black text-primary font-display">{totalPoints}</div>
           <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Merit Points</div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {tier && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                   <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency Tier</p>
                   <p className="text-lg font-black text-white font-display">{tier}</p>
                </div>
             </div>
             <ShieldCheck className="w-6 h-6 text-primary/40" />
          </div>
        )}

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {commendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <Award className="w-10 h-10 mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">No Merits Awarded Yet</p>
            </div>
          ) : (
            commendations.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/item">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(c.category)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{c.category} Excellence</span>
                  </div>
                  <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                    +{c.points} XP
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 italic">
                  &quot;{c.reason}&quot;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                       <Award className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold italic">via {c.mentor?.full_name || "Mentor"}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter">
                    {format(new Date(c.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
