"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { 
  Users, 
  MessageSquare, 
  Share2, 
  ExternalLink, 
  Trophy, 
  Zap,
  Sparkles,
  ArrowRight,
  Target,
  Calendar,
  ShieldCheck,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  Trophy: Trophy,
  Sparkles: Sparkles,
  Zap: Zap
};

import { getAvailableMentorshipSlots } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";

interface CommunityClientProps {
  initialUpdates: any[];
}

export default function CommunityClient({ initialUpdates }: CommunityClientProps) {
  const t = useTranslations("CommunityHub");
  const [updates] = useState<any[]>(initialUpdates);

  const COMMUNITY_GROUPS = useMemo(() => [
    {
      name: t("circles.waFounders"),
      platform: "WhatsApp",
      members: "2.4k+",
      id: "wa-founders",
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      name: t("circles.aiCircle"),
      platform: "Discord",
      members: "800+",
      id: "ds-ai",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    },
    {
      name: t("circles.complianceSupport"),
      platform: "Telegram",
      members: "1.2k+",
      id: "tg-tax",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  ], [t]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Users className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> {t("updates.title")}
              </h2>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                {t("updates.viewAll")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence>
                {updates.map((update, idx) => {
                  const Icon = iconMap[update.type] || MessageSquare;
                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className="glass-card hover:border-primary/30 transition-all group">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <span className="font-bold text-sm">{update.founder}</span>
                                  <span className="text-muted-foreground text-xs mx-2">•</span>
                                  <span className="text-xs text-muted-foreground">{update.company}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-tighter opacity-40">{update.time}</span>
                              </div>
                              <p className="text-sm leading-relaxed mb-3">{update.update}</p>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-[10px] font-bold uppercase py-0 px-2 bg-primary/5 text-primary border-primary/10">
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Founder Spotlight */}
          <section className="relative overflow-hidden rounded-[2.5rem] p-8 border border-primary/20 bg-linear-to-br from-primary/5 via-background to-accent/5">
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/2 space-y-4">
                <Badge className="bg-primary text-white border-0">{t("spotlight.badge")}</Badge>
                <h3 className="text-2xl font-black leading-tight">{t("spotlight.title")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t("spotlight.description")}
                </p>
                <Button className="rounded-full gap-2 shadow-glow">
                  {t("spotlight.cta")} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center">
                 <div className="aspect-square w-full max-w-[240px] rounded-[3rem] bg-secondary border-4 border-background rotate-3 overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <Users className="w-16 h-16 text-primary opacity-20" />
                    </div>
                 </div>
              </div>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full -ml-32 -mb-32" />
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <Card className="glass-card border-primary/20 overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> {t("circles.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {COMMUNITY_GROUPS.map((group) => (
                <div 
                  key={group.id}
                  className="p-4 rounded-2xl border border-border/50 hover:border-primary/20 bg-secondary/20 transition-all hover:translate-x-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{group.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px] font-bold py-0 h-4", group.color)}>
                      {group.platform}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium">{t("circles.membersActive", { count: group.members })}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 rounded-xl text-xs gap-2">
                {t("circles.browse")}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card bg-linear-to-b from-secondary/40 to-background border-dashed">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-bold">{t("networking.title")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("networking.description")}
              </p>
              <Button variant="ghost" className="text-xs text-primary font-bold">
                {t("networking.cta")}
              </Button>
            </CardContent>
          </Card>

          {/* Mentorship Booking */}
          <MentorshipSection />

          {/* G-Share Governance */}
          <GShareGovernance />
        </div>
      </div>
    </div>
  );
}

function MentorshipSection() {
  const t = useTranslations("CommunityHub.mentorship");
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedId, setBookedId] = useState<string | null>(null);

  useState(() => {
    getAvailableMentorshipSlots().then(res => {
      setSlots(res);
      setLoading(false);
    });
  });

  const handleBook = (id: string) => {
    setBookedId(id);
    toast.success(t("success"));
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-border/50">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-12 bg-secondary/50 rounded-xl" />
            <div className="h-12 bg-secondary/50 rounded-xl" />
          </div>
        ) : slots.length > 0 ? (
          <div className="space-y-2">
             {slots.slice(0, 3).map(slot => (
                <div key={slot.id} className="p-3 rounded-xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all group">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <p className="text-xs font-bold leading-none">{slot.mentor}</p>
                         <p className="text-[9px] text-muted-foreground mt-1">{slot.expertise}</p>
                      </div>
                      <Badge variant="outline" className="text-[8px] bg-background border-primary/20 h-4">{slot.time}</Badge>
                   </div>
                   <Button 
                      size="sm" 
                      className="w-full h-7 rounded-lg text-[10px] font-bold"
                      onClick={() => handleBook(slot.id)}
                      disabled={bookedId === slot.id}
                   >
                      {bookedId === slot.id ? <Check className="w-3 h-3 mr-1" /> : null}
                      {bookedId === slot.id ? t("booked") : t("book")}
                   </Button>
                </div>
             ))}
          </div>
        ) : (
          <p className="text-xs text-center text-muted-foreground py-4 italic">{t("noSlots")}</p>
        )}
      </CardContent>
    </Card>
  );
}

function GShareGovernance() {
  const t = useTranslations("CommunityHub.gshare");
  
  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden">
       <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-accent/10 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-accent" />
             </div>
             <div>
                <h4 className="font-bold text-sm leading-tight">{t("title")}</h4>
                <p className="text-[10px] text-muted-foreground">{t("subtitle")}</p>
             </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
             {t("description")}
          </p>
          <Button variant="outline" className="w-full rounded-xl border-accent/20 text-accent hover:bg-accent/10 text-xs font-bold">
             {t("cta")}
          </Button>
       </CardContent>
    </Card>
  );
}
