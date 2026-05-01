"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Star, Clock, CheckCircle2, Loader2, MapPin, Calendar, Building2 } from "lucide-react";
import { format } from "date-fns";
import { AttendanceLog } from "./AssociateTypes";
import { logAttendance } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { DashboardProfile } from "@/types/dashboard";

interface OperationalHeroProps {
  profile: DashboardProfile;
  currentTime: Date;
  attendance: AttendanceLog[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceLog[]>>;
  promotion?: {
    current_level: string;
    target_level: string;
    status: string;
  } | null;
  roleName: string;
}

export default function OperationalHero({
  profile,
  currentTime,
  attendance,
  setAttendance,
  promotion,
  roleName,
}: OperationalHeroProps) {
  const t = useTranslations("Associate");
  const tHero = useTranslations("Associate.hero");

  const [loading, setLoading] = useState(false);

  const todayLog = attendance.find(log => {
    const logDate = new Date(log.check_in).toDateString();
    const todayDate = new Date().toDateString();
    return logDate === todayDate;
  });

  const isCheckedIn = !!(todayLog && !todayLog.check_out);
  const hasFinishedDay = !!(todayLog && todayLog.check_out);

  const handleAttendance = async (type: 'in' | 'out') => {
    setLoading(true);
    const res = await logAttendance(profile.id, type);
    if (res.success && res.data) {
      toast.success(type === 'in' ? tHero("checkedIn") : tHero("checkedOut"));

      if (type === 'in') {
        setAttendance(prev => [res.data, ...prev]);
      } else {
        setAttendance(prev => prev.map(log => log.id === res.data.id ? res.data : log));
      }
    } else {
      toast.error(res.error || tHero("failure"));
    }
    setLoading(false);
  };

  const name = profile.full_name || "User";
  const location = profile.location || "Remote";
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "Oct 2024";
  const welcomeMessage = t('welcomeTitle', { name: name.split(' ')[0] });

  return (
    <section className="relative p-8 md:p-10 rounded-[2.5rem] bg-indigo-950/40 border border-indigo-500/20 overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        {/* Visual Identity */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-glow border-2 border-indigo-400 group hover:rotate-6 transition-transform duration-500">
            <Rocket className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Star className="w-4 h-4 md:w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-center md:text-left flex-1">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full">
                {roleName}
              </Badge>
              {promotion && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full animate-pulse">
                  {tHero("promotion", { status: promotion.status })}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-indigo-300 font-mono text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                <Clock className="w-3.5 h-3.5" />
                {format(currentTime, "HH:mm:ss")}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
              {welcomeMessage}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-indigo-200/60 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> 
                {location}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> 
                Join Date: {joinDate}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
            <div className="flex items-center gap-3">
              {hasFinishedDay ? (
                <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5" />
                  {tHero("protocolCompleted")}
                </div>
              ) : isCheckedIn ? (
                <Button
                  onClick={() => handleAttendance('out')}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tHero("initiateCheckout")}
                </Button>
              ) : (
                <Button
                  onClick={() => handleAttendance('in')}
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-glow transition-all hover:scale-105 active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tHero("deployToSite")}
                </Button>
              )}
            </div>

            <div className="h-12 w-px bg-white/10 hidden md:block" />

            <div className="text-left space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">{tHero("shiftOverview")}</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{tHero("checkIn")}</p>
                  <p className="text-sm font-bold text-white">{todayLog?.check_in ? format(new Date(todayLog.check_in), "HH:mm") : '--:--'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{tHero("checkOut")}</p>
                  <p className="text-sm font-bold text-white">{todayLog?.check_out ? format(new Date(todayLog.check_out), "HH:mm") : '--:--'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
