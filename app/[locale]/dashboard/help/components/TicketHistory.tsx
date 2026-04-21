"use client";

import { Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  category: string;
  created_at: string;
}

interface TicketHistoryProps {
  tickets: Ticket[];
  ticketsLoading: boolean;
  onRefresh: () => void;
}

export default function TicketHistory({ 
  tickets, 
  ticketsLoading, 
  onRefresh, 
}: TicketHistoryProps) {
  const t = useTranslations("HelpCenter");

  return (
    <Card className="glass-card border-border/50 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="bg-muted/30 border-b border-border/50 py-6 px-8">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> {t("tickets.history")}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest gap-2"
            onClick={onRefresh}
            disabled={ticketsLoading}
          >
            <RefreshCw className={ticketsLoading ? "w-3 h-3 animate-spin" : "w-3 h-3"} />
            {t("tickets.refresh")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-8 hover:bg-muted/10 transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <h4 className="font-bold group-hover:text-primary transition-colors">{ticket.subject}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ticket.message}</p>
                </div>
                <Badge variant="secondary" className="rounded-lg text-[9px] font-black uppercase tracking-tighter py-0.5 px-2 bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {ticket.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                <span>{ticket.category}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && !ticketsLoading && (
            <div className="py-20 text-center grayscale opacity-50">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <p className="text-sm font-medium italic">{t("tickets.empty")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
