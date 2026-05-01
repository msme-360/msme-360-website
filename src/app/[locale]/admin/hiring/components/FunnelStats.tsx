"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle2, LucideIcon, TrendingUp } from "lucide-react";
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
  color: string;
  gradient: string;
}

export default function FunnelStats({
  applicantsCount,
  shortlistedCount,
  pendingCount,
  hiredCount
}: FunnelStatsProps) {
  const t = useTranslations("Hiring.stats");
  const stats: StatItem[] = [
    { 
      label: t('total'), 
      value: applicantsCount, 
      sub: t('realtime'), 
      icon: FileText,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-transparent"
    },
    { 
      label: t('active'), 
      value: shortlistedCount, 
      sub: t('shortlisted'), 
      icon: Users,
      color: "text-amber-400",
      gradient: "from-amber-500/20 to-transparent"
    },
    { 
      label: t('pending'), 
      value: pendingCount, 
      sub: t('new'), 
      icon: Clock,
      color: "text-purple-400",
      gradient: "from-purple-500/20 to-transparent"
    },
    { 
      label: t('onboarded'), 
      value: hiredCount, 
      sub: t('hires'), 
      icon: CheckCircle2,
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-transparent"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="group"
        >
          <Card className="glass-card border-white/5 relative overflow-hidden group-hover:border-white/10 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">
                     <TrendingUp className="w-3 h-3" />
                     Live
                   </div>
                   <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">{s.label}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-4xl font-display font-black tracking-tight text-white leading-none">
                  {s.value}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 rounded-full bg-primary/20 overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary" 
                      initial={{ width: 0 }}
                      animate={{ width: "60%" }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    />
                  </div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{s.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
