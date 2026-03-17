"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ChevronRight} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function OperationsTools() {
  const t = useTranslations("OperationsHub");
  const [team, setTeam] = useState([
    { name: "Rahul Sharma", role: "proprietor", status: "active" },
    { name: "Ananya Iyer", role: "accountsManager", status: "active" }
  ]);
  const [compliance, setCompliance] = useState([
    { id: "gst", name: "GSTR-1 (Monthly)", dueDate: "11-Oct", status: "pending" },
    { id: "tds", name: "TDS Quarterly", dueDate: "31-Oct", status: "pending" },
    { id: "pf", name: "EPF/ESI Filing", dueDate: "15-Oct", status: "filed" }
  ]);

  const markFiled = (id: string) => {
    setCompliance(prev => prev.map(item => 
      item.id === id ? { ...item, status: "filed" } : item
    ));
  };

  const addTeamMember = () => {
    const names = ["Sameer Khan", "Priya Das", "Vikram Singh"];
    const roles = ["salesExecutive", "supportStar", "leadDeveloper"];
    const random = Math.floor(Math.random() * 3);
    setTeam(prev => [...prev, { name: names[random], role: roles[random], status: "onboarding" }]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {/* Compliance Tracker */}
      <Card className="lg:col-span-2 glass-card border-primary/10 overflow-hidden">
        <CardHeader className="bg-secondary/20 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{t("compliance.title")}</CardTitle>
              <CardDescription>{t("compliance.subtitle")}</CardDescription>
            </div>
            <Badge className="bg-primary/20 text-primary border-none">{t("compliance.month")}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {compliance.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.status === 'filed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                    {item.status === 'filed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{t("compliance.due", { date: item.dueDate })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {item.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => markFiled(item.id)}
                      className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
                    >
                      {t("compliance.markAsFiled")}
                    </Button>
                  ) : (
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3">{t("compliance.filedOn", { date: "02-Oct" })}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Ledger */}
      <Card className="glass-card border-accent/10 flex flex-col">
        <CardHeader className="bg-accent/5 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" /> {t("team.title")}
            </CardTitle>
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={addTeamMember}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            <div className="space-y-4">
              {team.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/20 border border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-none">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{t(`team.roles.${member.role}`)}</p>
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
    </div>
  );
}
