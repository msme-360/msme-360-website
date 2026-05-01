"use client";

import { HelpCircle, MessageSquare, LifeBuoy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface HelpHeaderProps {
  activeTab: "faqs" | "tickets";
  setActiveTab: (tab: "faqs" | "tickets") => void;
  ticketsCount: number;
}

export default function HelpHeader({
  activeTab,
  setActiveTab,
  ticketsCount
}: HelpHeaderProps) {
  const t = useTranslations("HelpCenter");

  return (
    <div className="text-center space-y-10 mb-16">
      <div className="relative inline-flex flex-col items-center">
        <div className="absolute -top-12 opacity-10 animate-pulse">
          <LifeBuoy className="w-24 h-24 text-primary" />
        </div>
        <div className="p-3 bg-primary/10 rounded-2xl mb-4 relative z-10">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl font-black tracking-tight relative z-10">{t("title")}</h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto text-lg leading-relaxed relative z-10">{t("description")}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 p-1.5 bg-muted/30 border border-border/50 rounded-2xl w-fit mx-auto shadow-sm">
        <button
          onClick={() => setActiveTab("faqs")}
          className={cn(
            "flex items-center gap-2.5 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300",
            activeTab === "faqs"
              ? "bg-background text-primary shadow-glow border border-primary/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {t("tabs.faqs")}
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={cn(
            "flex items-center gap-2.5 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 relative",
            activeTab === "tickets"
              ? "bg-background text-primary shadow-glow border border-primary/20"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {t("tabs.myTickets")}
          {ticketsCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-background font-black">
              {ticketsCount}
            </Badge>
          )}
        </button>
      </div>
    </div>
  );
}
