"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { ROLE_DASHBOARD_CONFIGS } from "@/lib/constants/dashboardConfigs";
import { ArrowUpRight } from "lucide-react";
import { DashboardProfile } from "@/types/dashboard";

interface RoleUnifiedDashboardProps {
  profile: DashboardProfile;
}

export function RoleUnifiedDashboard({ profile }: RoleUnifiedDashboardProps) {
  const config = ROLE_DASHBOARD_CONFIGS[profile.role] || ROLE_DASHBOARD_CONFIGS.ceo; // Fallback to CEO for now if config missing

  return (
    <AdminViewWrapper
      title={config.title}
      subtitle={config.subtitle}
      badgeLabel={config.badgeLabel}
      authorityLevel={config.authorityLevel}
    >
      <div className="space-y-10">
        {/* Bespoke Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {config.metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card border-white/5 overflow-hidden group hover:border-primary/20 transition-all duration-300 bg-white/[0.01]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                      <m.icon className="w-5 h-5" />
                    </div>
                    {m.change && (
                      <Badge variant="ghost" className="text-green-500 font-bold bg-green-500/10 border-none flex items-center gap-0.5">
                        {m.change}
                        <ArrowUpRight className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold tracking-tighter">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{m.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feature Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {config.features.map((feature, i) => (
            <Card key={feature.title} className="glass-card border-white/10 overflow-hidden bg-white/[0.01]">
              <CardHeader className="bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground font-medium">{feature.description}</p>
                  {feature.progress !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Status: {feature.status}</span>
                        <span className="text-primary">{feature.progress}%</span>
                      </div>
                      <Progress value={feature.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminViewWrapper>
  );
}
