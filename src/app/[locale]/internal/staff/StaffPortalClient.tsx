"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Info, ExternalLink,
  BookOpen, MessageSquare, Sparkles, Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import { DashboardProfile } from "@/types/dashboard";
import { Database } from "@/types/supabase";
import { formatDistanceToNow } from "date-fns";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { useTranslations } from "next-intl";

type Announcement = Database['public']['Tables']['announcements']['Row'];

interface StaffPortalClientProps {
  profile: DashboardProfile;
  initialAnnouncements: Announcement[];
}

export function StaffPortalClient({ profile, initialAnnouncements }: StaffPortalClientProps) {
  const t = useTranslations("Common.Staff");
  const announcements = initialAnnouncements;

  return (
    <AdminViewWrapper
      title={t("workspace", { role: profile.role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') })}
      subtitle={t("subtitle")}
      badgeLabel={t("tier")}
      authorityLevel={t("level")}
    >
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        {/* Hero Welcome */}
        <WelcomeHeader
          profile={profile}
          t={t}
          roleName={profile.role.replace("_", " ").toUpperCase()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
                <h2 className="text-2xl font-display font-bold">{t("announcements.title")}</h2>
              </div>

              {announcements.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border-white/5 hover:border-primary/20 transition-all hover:translate-x-1 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <Badge variant="secondary" className="bg-white/5 text-[10px] uppercase font-bold tracking-widest">{item.type}</Badge>
                          <h3 className="font-bold text-lg">{item.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Button variant="ghost" className="w-full border-dashed border border-white/10 text-muted-foreground hover:bg-white/5 h-12 rounded-xl">
                {t("announcements.viewAll")}
              </Button>
            </div>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-accent rounded-full shadow-glow" />
                <h2 className="text-xl font-display font-bold">{t("shortcuts.title")}</h2>
              </div>

              <Card className="glass-card border-white/5 rounded-2xl overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  {[
                    { label: t("shortcuts.handbook"), icon: BookOpen, url: '#' },
                    { label: t("shortcuts.sop"), icon: Info, url: '#' },
                    { label: t("shortcuts.comms"), icon: MessageSquare, url: '#' },
                    { label: t("shortcuts.perks"), icon: Sparkles, url: '#' },
                    { label: t("shortcuts.repos"), icon: ExternalLink, url: '#' },
                  ].map((link) => (
                    <Button key={link.label} variant="ghost" className="w-full justify-between items-center text-sm font-medium hover:bg-white/5 px-3 h-10 group rounded-lg">
                      <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        {link.label}
                      </div>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20 overflow-hidden rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 font-display">
                  <Trophy className="w-4 h-4 text-primary" />
                  {t("milestone.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4 italic">
                  &quot;Our MicroAI integration has hit 10k inference calls this week. Amazing work by the engineering squad!&quot;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700/50" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{t("milestone.update")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminViewWrapper>
  );
}
