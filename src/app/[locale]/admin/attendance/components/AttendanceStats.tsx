"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface AttendanceStatsProps {
  totalLogs: number;
}

export default function AttendanceStats({ totalLogs }: AttendanceStatsProps) {
  const t = useTranslations("Attendance");
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="glass-card bg-indigo-500/5 border-white/5 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
        <CardContent className="pt-6 relative z-10">
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">{t("stats.totalLogs") || "Total Logs"}</div>
          <div className="text-4xl font-display font-black text-white">{totalLogs}</div>
        </CardContent>
      </Card>
    </div>
  );
}
