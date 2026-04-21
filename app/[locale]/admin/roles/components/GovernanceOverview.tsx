"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Filter, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export default function GovernanceOverview() {
  const t = useTranslations("Internal.Roles");
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glass-card border-white/10 group hover:border-primary/30 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="font-black uppercase text-[10px] tracking-widest text-primary/80">
              {t("governance.board.title")}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {t("governance.board.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10 group hover:border-accent/30 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center transition-transform group-hover:scale-110">
              <Filter className="w-5 h-5 text-accent" />
            </div>
            <div className="font-black uppercase text-[10px] tracking-widest text-accent/80">
              {t("governance.manager.title")}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {t("governance.manager.description")}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10 group hover:border-white/20 transition-all">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="font-black uppercase text-[10px] tracking-widest text-white/40">
              {t("governance.associate.title")}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {t("governance.associate.description")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
