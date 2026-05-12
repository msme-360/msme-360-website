"use client";

import { Building2, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardProfile } from "@/types/dashboard";

interface WelcomeHeaderProps {
  profile: DashboardProfile;
  t: (key: string, values?: Record<string, unknown>) => string;
  roleName: string;
}

export function WelcomeHeader({ 
  profile,
  t,
  roleName
}: WelcomeHeaderProps) {
  const name = profile.full_name || "User";
  const location = profile.location || "Remote";
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Oct 2024";
  const welcomeMessage = t('welcomeTitle', { name: name.split(' ')[0] });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-8 md:p-10 border border-white/10 shadow-inner">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-glow shrink-0">
          <Building2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
            {welcomeMessage}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase font-bold tracking-widest text-[10px]">
                {roleName}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary/60" /> 
              {location}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary/60" /> 
              Join Date: {joinDate}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
