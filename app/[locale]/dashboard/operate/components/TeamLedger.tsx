"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Loader2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember } from "../OperationsTools";
import { useTranslations } from "next-intl";

interface TeamLedgerProps {
  team: TeamMember[];
  isLoading: boolean;
  isAddingMember: boolean;
  onAddMember: () => void;
}

export function TeamLedger({ team, isLoading, isAddingMember, onAddMember }: TeamLedgerProps) {
  const t = useTranslations("OperationsHub");
  return (
    <Card className="glass-card border-accent/10 flex flex-col">
      <CardHeader className="bg-accent/5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> {t("team.title")}
          </CardTitle>
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full h-8 w-8 text-accent hover:bg-accent/10" 
            onClick={onAddMember}
            disabled={isAddingMember}
          >
            {isAddingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/10 border border-border/20">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : team.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">{t("team.empty")}</div>
            ) : team.map((member, idx) => (
              <div key={member.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/50 group hover:border-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                    {member.full_name?.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-none">{member.full_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{t(`team.roles.${member.role_key}`)}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[8px] border-none px-1.5 ${
                  member.status === 'active' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {t(`status.${member.status}`)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full rounded-xl bg-accent text-accent-foreground font-bold text-xs" variant="secondary">
          {t("team.viewAll")} <ChevronRight className="ml-2 w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
}
