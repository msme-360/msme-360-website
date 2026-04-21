"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Clock, 
  FileText, 
  Calendar,
  MoreVertical,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

interface AttendanceLogClientProps {
  initialAttendance: AttendanceLog[];
}

export function AttendanceLogClient({ initialAttendance }: AttendanceLogClientProps) {
  const [attendance] = useState(initialAttendance);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter logs based on debounced search term
  const filteredLogs = attendance.filter(log => 
    log.profiles?.full_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    log.profiles?.role?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Personnel", "Role", "Date", "Check In", "Check Out", "Status"];
    const rows = filteredLogs.map(log => [
      log.profiles?.full_name || "N/A",
      log.profiles?.role || "N/A",
      format(new Date(log.check_in), "yyyy-MM-dd"),
      format(new Date(log.check_in), "HH:mm:ss"),
      log.check_out ? format(new Date(log.check_out), "HH:mm:ss") : "--",
      log.check_out ? "COMPLETED" : "ACTIVE"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_audit_${format(new Date(), "yyyy_MM_dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 p-6 lg:p-10 bg-slate-950/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <Clock className="w-5 h-5 text-indigo-400" />
             </div>
             <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-white">Participation Ledger</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                   <Filter className="w-3.5 h-3.5" />
                   Industrial oversight of organization-wide participation logs.
                </p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search personnel tier..." 
              className="pl-11 bg-white/5 border-white/5 rounded-2xl h-12 focus:ring-indigo-500 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
             onClick={handleExportCSV}
             className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 gap-2 border-t border-white/20"
          >
             <FileText className="w-3.5 h-3.5" />
             Export Audit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="glass-card bg-indigo-500/5 border-white/5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
            <CardContent className="pt-6 relative z-10">
               <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Total Logs</div>
               <div className="text-4xl font-display font-black text-white">{attendance.length}</div>
            </CardContent>
         </Card>
      </div>

      <Card className="glass-card border-white/5 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
           <Badge variant="outline" className="bg-indigo-500/5 border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest py-1">Tactical Audit Mode</Badge>
        </div>
        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-8 px-8">
          <CardTitle className="text-lg flex items-center gap-3">
             <History className="w-5 h-5 text-indigo-400" />
             Strategic Participation Repository
          </CardTitle>
          <CardDescription className="text-xs">Real-time verification of departmental operations and personnel readiness.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.01]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">Personnel</TableHead>
                  <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Reference Date</TableHead>
                  <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Clock In</TableHead>
                  <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Clock Out</TableHead>
                  <TableHead className="py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Operational Status</TableHead>
                  <TableHead className="text-right py-5 px-8 text-[10px] font-black uppercase tracking-widest text-white/40">Trace</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
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
                       <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                          !log.check_out ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5 ring-1 ring-indigo-500/20' : 'border-white/5 text-muted-foreground bg-white/[0.02]'
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
          {filteredLogs.length === 0 && (
            <div className="py-32 text-center bg-indigo-500/[0.01]">
               <div className="w-16 h-16 rounded-full bg-indigo-500/5 flex items-center justify-center mx-auto mb-6 border border-indigo-500/10">
                  <Calendar className="w-8 h-8 text-indigo-500/20" />
               </div>
               <h3 className="text-white font-bold mb-1">No Trace Detected</h3>
               <p className="text-muted-foreground text-xs font-medium italic">The participation ledger is current for this query range.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper icons
function History({ className }: { className?: string }) {
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
