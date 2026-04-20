"use client";

import { 
  History, 
  Search, 
  Filter, 
  Download,
  ShieldCheck,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const MOCK_LOGS = [
  { id: 1, action: "Role Modified", user: "Super Admin", target: "Recruiter Role", time: "2 mins ago", status: "success" },
  { id: 2, action: "System Config Update", user: "CTO", target: "Tech Infra", time: "15 mins ago", status: "success" },
  { id: 3, action: "Audit Export", user: "Managing Partner", target: "Q1 Reports", time: "1 hour ago", status: "success" },
  { id: 4, action: "Governance Check", user: "BOD", target: "Compliance Segment", time: "3 hours ago", status: "warning" },
  { id: 5, action: "Security Patch Applied", user: "System", target: "Auth Service", time: "5 hours ago", status: "success" },
];

export function AuditClient() {
  const t = useTranslations("Admin.audit");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            {t.rich("title", {
              span: (chunks) => <span className="text-primary italic">{chunks}</span>
            })}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm max-w-xl">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-button">
            <Download className="w-4 h-4 mr-2" />
            {t("export")}
          </Button>
          <Button size="sm" className="shadow-glow">
            <ShieldCheck className="w-4 h-4 mr-2" />
            {t("security")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-primary">{t("health")}</CardDescription>
            <CardTitle className="text-2xl font-display">100%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full shadow-glow" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-accent">{t("alerts")}</CardDescription>
            <CardTitle className="text-2xl font-display">0</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-1 w-full bg-accent/10 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-muted/10 md:col-span-2">
           <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{t("compliance")}</CardDescription>
            <CardTitle className="text-2xl font-display">{t("complianceOptimal")}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {t("complianceNote")}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card overflow-hidden border-border/50">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t("search")} className="pl-10 h-9 bg-background/50 border-border/50" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 px-3">
                <Filter className="w-4 h-4 mr-2" />
                {t("filter")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{t("table.action")}</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{t("table.user")}</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{t("table.target")}</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{t("table.timestamp")}</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground uppercase tracking-widest text-[10px]">{t("table.status")}</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {MOCK_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-foreground">{log.action}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                          {log.user.slice(0, 2).toUpperCase()}
                        </div>
                        {log.user}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground italic">
                        <Clock className="w-3 h-3" />
                        {log.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        log.status === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {log.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
