"use client";

import {
  LifeBuoy, Search, Filter, MessageSquare,
  AlertCircle, CheckCircle2, Clock, ChevronRight, MoreVertical
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

import { Database } from "@/types/supabase";

type SupportTicket = Database['public']['Tables']['support_tickets']['Row'] & {
  profiles?: { full_name: string | null } | null;
};

interface SupportClientProps {
  initialTickets?: SupportTicket[];
  subView?: string;
}

export function SupportClient({ initialTickets = [], subView }: SupportClientProps) {
  const t = useTranslations("Admin.support");

  if (subView) {
    const subViewTitles: Record<string, string> = {
      tickets: "Support Feed",
      knowledge: "Resource Library",
      logs: "Incident History",
      performance: "Response Metrics",
      feedback: "User Satisfaction",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Module`}
        subtitle="Operational support and diagnostic tools."
        badgeLabel="TECHNICAL DEPTH"
        authorityLevel="L3 Tech"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Accessing {title} Hub</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is retrieving diagnostic logs and synchronizing <strong>{title.toLowerCase()}</strong> for technical support.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }

  return (
    <AdminViewWrapper
      title="Technical Support"
      subtitle="Comprehensive overview of organizational support requests and health."
      badgeLabel="SUPPORT HUB"
      authorityLevel="L3 Technical"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
              <LifeBuoy className="w-8 h-8 text-accent" />
              {t.rich("title", {
                span: (chunks) => <span className="text-accent italic">{chunks}</span>
              })}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm max-w-xl">
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="glass-button">
              <Filter className="w-4 h-4 mr-2" />
              {t("filters")}
            </Button>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
              <MessageSquare className="w-4 h-4 mr-2" />
              {t("activeTickets")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-accent/10 bg-accent/5 backdrop-blur-sm">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 uppercase tracking-widest text-[8px]">{t("newOrders")}</Badge>
                <AlertCircle className="w-4 h-4 text-accent" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">12</CardTitle>
              <CardDescription className="text-xs">{t("ticketsAwaiting")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card border-primary/10">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[8px]">{t("resolved")}</Badge>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">84</CardTitle>
              <CardDescription className="text-xs">{t("closedWeek")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card border-border/10">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-border uppercase tracking-widest text-[8px]">{t("mttr")}</Badge>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">1.2h</CardTitle>
              <CardDescription className="text-xs">{t("avgTime")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex flex-col md:flex-row md:items-center gap-4 bg-muted/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t("search")} className="pl-10 bg-background/50 border-border/50" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mr-2">{t("sortBy")}</div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer border-primary/20">Priority</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Newest</Badge>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            {initialTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-muted/30 transition-all group flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${ticket.category === 'Technical' ? 'bg-red-500/10 text-red-500' :
                      ticket.category === 'Billing' ? 'bg-accent/10 text-accent' :
                        'bg-primary/10 text-primary'
                    }`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{ticket.id.substring(0, 8)}</span>
                      <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{ticket.subject}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{ticket.profiles?.full_name || "User"}</span>
                      <span className="flex items-center gap-1 opacity-70"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                      <span className={`flex items-center gap-1 ${ticket.status === 'open' ? 'text-accent' :
                          ticket.status === 'closed' ? 'text-primary' : 'text-orange-500'
                        }`}>
                        • {ticket.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 border-border/50 hover:bg-primary hover:text-primary-foreground group/btn shadow-sm">
                    {t("view")}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-center">
            <Button variant="ghost" size="sm" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              {t("showFull")}
            </Button>
          </div>
        </Card>
      </div>
    </AdminViewWrapper>
  );
}
