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
import { Button } from "@/components/ui/button";
import { FileText, MoreVertical, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface AttendanceLog {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  profiles: { full_name: string; role: string; email: string };
}

interface AccessAuditProps {
  attendance: AttendanceLog[];
}

export default function AccessAudit({ attendance }: AccessAuditProps) {
  const t = useTranslations("Attendance");
  return (
    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t("table.title") || "Participation Archives"}</CardTitle>
            <CardDescription>{t("table.description") || "Organization-wide attendance logs and participation audit trails."}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase bg-white/5 border-white/10 gap-2">
            <FileText className="w-3 h-3" />
            {t("exportCta") || "Export CSV"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Personnel</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Date</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Clock In</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Clock Out</TableHead>
                <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Status</TableHead>
                <TableHead className="text-right py-4 px-6 text-[10px] font-black uppercase">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{log.profiles?.full_name}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-black">{log.profiles?.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-[10px] font-mono text-white/70">
                    {format(new Date(log.check_in), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-[11px] font-mono font-bold text-emerald-400">
                    {format(new Date(log.check_in), "HH:mm:ss")}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-[11px] font-mono font-bold text-white/50">
                    {log.check_out ? format(new Date(log.check_out), "HH:mm:ss") : "--:--:--"}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <Badge variant="outline" className={`text-[8px] rounded-md ${!log.check_out ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-muted-foreground'}`}>
                      {!log.check_out ? "ACTIVE SESSION" : "COMPLETED"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-4 px-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {attendance.length === 0 && (
          <div className="py-20 text-center">
            <Calendar className="w-12 h-12 text-white/5 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium text-sm italic">No participation logs found in the ledger.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
