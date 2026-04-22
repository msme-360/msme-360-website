"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface AttendanceLog {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  profiles: {
    full_name: string;
    role: string;
    avatar_url?: string;
  };
}

interface AttendanceLogTableProps {
  logs: AttendanceLog[];
}

export default function AttendanceLogTable({ logs }: AttendanceLogTableProps) {
  const t = useTranslations("Attendance");
  return (
    <Card className="glass-card border-white/5 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="outline" className="bg-indigo-500/5 border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest py-1">Tactical Audit Mode</Badge>
      </div>
      <CardHeader className="bg-white/[0.02] border-b border-white/5 py-8 px-8">
        <CardTitle className="text-lg flex items-center gap-3">
          <HistoryIcon className="w-5 h-5 text-indigo-400" />
          {t("table.title") || "Strategic Participation Repository"}
        </CardTitle>
        <CardDescription className="text-xs">{t("table.description") || "Real-time verification of departmental operations and personnel readiness."}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">{t("table.colPersonnel") || "Personnel"}</TableHead>
                <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">{t("table.colDate") || "Reference Date"}</TableHead>
                <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">{t("table.colIn") || "Clock In"}</TableHead>
                <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">{t("table.colOut") || "Clock Out"}</TableHead>
                <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">{t("table.colStatus") || "Operational Status"}</TableHead>
                <TableHead className="text-right py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">{t("table.colTrace") || "Trace"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-indigo-500/[0.02] transition-all group">
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-white/10 shadow-xl group-hover:border-indigo-500/30 transition-all">
                        <AvatarFallback className="bg-indigo-500/10 text-indigo-400 font-black text-xs">
                          {log.profiles?.full_name?.split(' ').map(n => n[0]).join('') || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-all tracking-tight">{log.profiles?.full_name}</span>
                        <Badge variant="secondary" className="bg-white/5 text-[8px] font-black uppercase tracking-widest border-white/5 w-fit">
                          {log.profiles?.role}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-center">
                    <span className="text-[11px] font-mono font-medium text-white/60 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                      {format(new Date(log.check_in), "MMM dd, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[12px] font-mono font-black text-emerald-400">
                        {format(new Date(log.check_in), "HH:mm:ss")}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter text-emerald-500/40">Secured</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-center">
                    {log.check_out ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[12px] font-mono font-black text-white/70">
                          {format(new Date(log.check_out), "HH:mm:ss")}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-white/20">Archived</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-indigo-400/30 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-[11px] font-mono font-bold tracking-tighter uppercase">In Progress...</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-5 px-8 text-center">
                    <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${!log.check_out ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5 ring-1 ring-indigo-500/20' : 'border-white/5 text-muted-foreground bg-white/[0.02]'
                      }`}>
                      {!log.check_out ? "Active Session" : "Mission Complete"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-5 px-8">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-400 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {logs.length === 0 && (
          <div className="py-32 text-center bg-indigo-500/[0.01]">
            <div className="w-16 h-16 rounded-full bg-indigo-500/5 flex items-center justify-center mx-auto mb-6 border border-indigo-500/10">
              <Calendar className="w-8 h-8 text-indigo-500/20" />
            </div>
            <h3 className="text-white font-bold mb-1">{t("table.noTrace") || "No Trace Detected"}</h3>
            <p className="text-muted-foreground text-xs font-medium italic">{t("table.noTraceDesc") || "The participation ledger is current for this query range."}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
