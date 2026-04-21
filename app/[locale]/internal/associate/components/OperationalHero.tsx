"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Star, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { AttendanceLog } from "./AssociateTypes";
import { logAttendance } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";

interface OperationalHeroProps {
  fullName: string;
  profileId: string;
  currentTime: Date;
  attendance: AttendanceLog[];
}

export default function OperationalHero({
  fullName,
  profileId,
  currentTime,
  attendance,
}: OperationalHeroProps) {
  const router = useRouter();
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
    const res = await logAttendance(profileId, type);
    if (res.success) {
      toast.success(type === 'in' ? "Checked in successfully!" : "Checked out successfully!");
      router.refresh();
    } else {
      toast.error(res.error || "Attendance system failure.");
    }
    setLoading(false);
  };

  return (
    <section className="relative p-12 rounded-[2.5rem] bg-indigo-950/40 border border-indigo-500/20 overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="relative flex-shrink-0">
           <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-glow border-2 border-indigo-400 group hover:rotate-6 transition-transform duration-500">
              <Rocket className="w-16 h-16 text-white" />
           </div>
           <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Star className="w-5 h-5 fill-current" />
           </div>
        </div>
        
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
               Career Launchpad Tier (L1)
            </Badge>
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-sm bg-white/5 px-3 py-1 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5" />
              {format(currentTime, "HH:mm:ss")}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white leading-tight">
             Welcome to the Mission, <span className="text-indigo-400">{fullName?.split(' ')[0]}</span>
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
            <div className="flex items-center gap-3">
               {hasFinishedDay ? (
                 <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                    Protocol Completed
                 </div>
               ) : isCheckedIn ? (
                 <Button 
                  onClick={() => handleAttendance('out')}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Checkout"}
                 </Button>
               ) : (
                 <Button 
                  onClick={() => handleAttendance('in')}
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 h-12 rounded-2xl font-black uppercase tracking-widest shadow-glow transition-all hover:scale-105 active:scale-95"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy to Site (Check-in)"}
                 </Button>
               )}
            </div>
            
            <div className="h-12 w-px bg-white/10 hidden md:block" />
            
            <div className="text-left space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Shift Overview</p>
               <div className="flex gap-4">
                  <div>
                     <p className="text-xs text-muted-foreground">In:</p>
                     <p className="text-sm font-bold text-white">{todayLog?.check_in ? format(new Date(todayLog.check_in), "HH:mm") : '--:--'}</p>
                  </div>
                  <div>
                     <p className="text-xs text-muted-foreground">Out:</p>
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
