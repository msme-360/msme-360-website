"use client";

import { MessageSquare, Share2, Trophy, Zap, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FounderUpdate } from "../CommunityClient";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy: Trophy,
  Sparkles: Sparkles,
  Zap: Zap
};

interface CommunityUpdateCardProps {
  update: FounderUpdate;
}

export default function CommunityUpdateCard({ update }: CommunityUpdateCardProps) {
  const Icon = iconMap[update.type] || MessageSquare;

  return (
    <Card className="glass-card hover:border-primary/30 transition-all group shadow-sm">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-black text-sm">{update.founder}</span>
                <span className="text-muted-foreground text-xs mx-2 opacity-30">•</span>
                <span className="text-xs text-muted-foreground font-medium">{update.company}</span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-tighter opacity-40">{update.time}</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-foreground/80">{update.update}</p>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest py-0.5 px-2 bg-primary/5 text-primary border-primary/10">
                {update.category}
              </Badge>
              <div className="flex gap-2 ml-auto">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-40 hover:opacity-100 hover:text-primary">
                  <Share2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
