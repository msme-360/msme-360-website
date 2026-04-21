"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  FileSpreadsheet, Download, Clock, 
  MessageSquare 
} from "lucide-react";
import { format } from "date-fns";
import { AttendanceLog } from "./ManagerTypes";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface AttendanceMonitorProps {
  attendance: AttendanceLog[];
  department?: string;
}

export default function AttendanceMonitor({
  attendance,
  department = "N/A"
}: AttendanceMonitorProps) {
  const activeAttendance = attendance.filter(log => {
    const isToday = new Date(log.check_in).toDateString() === new Date().toDateString();
    return isToday && !log.check_out;
  });

  const handleExportCSV = () => {
    const headers = ["Name", "Role", "Check In", "Check Out", "Duration"];
    const rows = attendance.map(log => [
      log.profiles?.full_name || "Unknown",
      log.profiles?.role || "N/A",
      format(new Date(log.check_in), "yyyy-MM-dd HH:mm:ss"),
      log.check_out ? format(new Date(log.check_out), "yyyy-MM-dd HH:mm:ss") : "Active",
      log.check_out ? `${Math.round((new Date(log.check_out).getTime() - new Date(log.check_in).getTime()) / 3600000)}h` : "N/A"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export initialized.");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Personnel Attendance Audit - ${format(new Date(), "MMMM dd, yyyy")}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Department: ${department}`, 14, 22);
    const tableData = attendance.map(log => [
      log.profiles?.full_name || "Unknown",
      log.profiles?.role || "N/A",
      format(new Date(log.check_in), "yyyy-MM-dd HH:mm"),
      log.check_out ? format(new Date(log.check_out), "yyyy-MM-dd HH:mm") : "Active",
    ]);
    autoTable(doc, {
      head: [["Personnel", "Role", "Check In", "Check Out"]],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    doc.save(`attendance_audit_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF Audit generated.");
  };

  return (
    <div className="space-y-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              className="h-9 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-emerald-400"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF}
              className="h-9 gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400"
            >
              <Download className="w-3.5 h-3.5" />
              PDF Audit
            </Button>
          </div>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-none">
            {activeAttendance.length} On-Site
          </Badge>
        </div>
      
        <Card className="glass-card border-white/5 overflow-hidden">
          <div className="p-4 bg-emerald-500/5 border-b border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Participation Logs</p>
          </div>
          <div className="p-2 space-y-1">
            {attendance.slice(0, 8).map((log, i) => (
              <div key={i} className="flex justify-between items-center text-xs p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${!log.check_out ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                  <div>
                    <p className="font-bold text-white/90">{log.profiles?.full_name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{log.profiles?.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-white/70 font-mono">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    {format(new Date(log.check_in), "HH:mm")}
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">
                    {log.check_out ? `Out: ${format(new Date(log.check_out), "HH:mm")}` : 'Active Session'}
                  </p>
                </div>
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="p-6 text-center text-[10px] text-muted-foreground uppercase tracking-widest">No logs recorded today.</p>
            )}
          </div>
          <div className="p-4 border-t border-white/5 bg-slate-900/40">
            <Button variant="ghost" className="w-full text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest h-8 transition-all hover:bg-emerald-500/10">
              View Audit Archives
            </Button>
          </div>
        </Card>
      </section>

      <Card className="bg-emerald-500/5 border-emerald-500/20 overflow-hidden relative group">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            Team Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <p className="text-[11px] text-emerald-100/60 leading-relaxed font-medium">
            Department synchronization is at **98%**. All Level 1 associates have completed their morning protocols. Ensure mission briefings are documented for audit compliance.
          </p>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
            Start Weekly Sync
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
