"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { format } from "date-fns";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceLogTable from "./components/AttendanceLogTable";

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
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Filter logs based on deferred search term
  const filteredLogs = useMemo(() => {
    const query = deferredSearchTerm.toLowerCase();
    return attendance.filter(log => 
      log.profiles?.full_name?.toLowerCase().includes(query) ||
      log.profiles?.role?.toLowerCase().includes(query)
    );
  }, [attendance, deferredSearchTerm]);

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
      <AttendanceHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={handleExportCSV}
      />

      <AttendanceStats 
        totalLogs={attendance.length}
      />

      <AttendanceLogTable 
        logs={filteredLogs}
      />
    </div>
  );
}
