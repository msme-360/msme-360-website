"use client";

import { Target, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CommunityGroup {
  name: string;
  platform: string;
  members: string;
  id: string;
  color: string;
}

interface CommunityGroupsSidebarProps {
  groups: CommunityGroup[];
}

export default function CommunityGroupsSidebar({ groups }: CommunityGroupsSidebarProps) {
  const t = useTranslations("Dashboard.Community");
  return (
    <Card className="glass-card border-primary/20 overflow-hidden shadow-xl">
      <CardHeader className="bg-primary/5 border-b border-border/50">
        <CardTitle className="text-base font-black flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" /> {t("circles.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {groups.map((group) => (
          <div 
            key={group.id}
            className="p-4 rounded-2xl border border-border/50 hover:border-primary/20 bg-secondary/20 transition-all hover:translate-x-1 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm group-hover:text-primary transition-colors">{group.name}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("text-[10px] font-black py-0 h-4 uppercase tracking-tighter", group.color)}>
                {group.platform}
              </Badge>
              <span className="text-[10px] text-muted-foreground font-black opacity-60 tracking-tight">{t("circles.membersActive", { count: group.members })}</span>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-4 rounded-xl text-xs font-black gap-2 border-primary/20 text-primary uppercase">
          {t("circles.browse")}
        </Button>
      </CardContent>
    </Card>
  );
}
