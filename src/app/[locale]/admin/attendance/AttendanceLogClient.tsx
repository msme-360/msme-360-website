"use client";

import { useState, useMemo, useDeferredValue } from "react";
import { format } from "date-fns";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceStats from "./components/AttendanceStats";
import AttendanceLogTable from "./components/AttendanceLogTable";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

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
  subView?: string;
}

export function AttendanceLogClient({ initialAttendance, subView }: AttendanceLogClientProps) {
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

  if (subView) {
    const subViewTitles: Record<string, string> = {
      reports: "Attendance Reports",
      shifts: "Shift Scheduler",
      anomalies: "Discrepancy Log",
      requests: "Leave Management",
      verification: "Biometric Audit",
    };
    
    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Module`}
        subtitle="Operational tracking and verification tools."
        badgeLabel="PERSONNEL DEPTH"
        authorityLevel="L2 Admin"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Syncing {title} Feed</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is mapping personnel data and synchronizing <strong>{title.toLowerCase()}</strong> for the organization.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }

  return (
    <AdminViewWrapper
      title="Personnel Attendance"
      subtitle="Comprehensive audit log of organizational presence and shifts."
      badgeLabel="ATTENDANCE HUB"
      authorityLevel="Personnel Ledger"
    >
      <div className="space-y-8 pb-20">
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
    </AdminViewWrapper>
  );
}
