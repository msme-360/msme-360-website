"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle2, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface FunnelStatsProps {
  applicantsCount: number;
  shortlistedCount: number;
  pendingCount: number;
  hiredCount: number;
}

interface StatItem {
  label: string;
  value: number;
  sub: string;
  icon: LucideIcon;
}

export default function FunnelStats({ 
  applicantsCount, 
  shortlistedCount, 
  pendingCount, 
  hiredCount 
}: FunnelStatsProps) {
  const t = useTranslations("Hiring.stats");
  const stats: StatItem[] = [
    { label: t('total'), value: applicantsCount, sub: t('realtime'), icon: FileText },
    { label: t('active'), value: shortlistedCount, sub: t('shortlisted'), icon: Users },
    { label: t('pending'), value: pendingCount, sub: t('new'), icon: Clock },
    { label: t('onboarded'), value: hiredCount, sub: t('hires'), icon: CheckCircle2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div 
          key={s.label} 
          initial={{ opacity: 0, x: -10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: i * 0.1 }}
        >
          <Card className="glass-card border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-primary" />
                 </div>
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
              </div>
              <div className="space-y-0.5">
                 <p className="text-2xl font-display font-bold">{s.value}</p>
                 <p className="text-[10px] text-primary/60 font-medium">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
