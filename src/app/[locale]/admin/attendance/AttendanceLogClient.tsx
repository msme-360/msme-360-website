"use client";

import { useState } from "react";
import { format } from "date-fns";
import AttendanceHeader from "./components/AttendanceHeader";
import AttendanceStats from "./components/AttendanceStats";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, Timer, MoreHorizontal, FileSearch, Edit, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

  const columns: ColumnDef<AttendanceLog>[] = [
    {
      accessorKey: "profiles.full_name",
      header: "Personnel",
      cell: ({ row }) => {
        const profile = row.original.profiles;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-white/5 text-[10px] font-bold">
                {profile.full_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-white text-sm">{profile.full_name}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{profile.role.replace('_', ' ')}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "check_in",
      header: "Reference Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-muted-foreground">
          {format(new Date(row.original.check_in), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      accessorKey: "clock_in_time",
      header: "Clock In",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-sm font-mono font-bold text-emerald-400">
            {format(new Date(row.original.check_in), "HH:mm:ss")}
          </span>
          <span className="text-[8px] font-bold text-emerald-500/50 uppercase tracking-tighter">Secured</span>
        </div>
      ),
    },
    {
      accessorKey: "clock_out_time",
      header: "Clock Out",
      cell: ({ row }) => {
        const checkOut = row.original.check_out;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${checkOut ? 'bg-amber-500' : 'bg-white/20'}`} />
            <span className={`text-sm font-mono font-bold ${checkOut ? 'text-amber-400' : 'text-white/20'}`}>
              {checkOut ? format(new Date(checkOut), "HH:mm:ss") : "--:--:--"}
            </span>
            {checkOut && <span className="text-[8px] font-bold text-amber-500/50 uppercase tracking-tighter text-nowrap">Archived</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Operational Status",
      cell: ({ row }) => {
        const isCompleted = !!row.original.check_out;
        return (
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Mission Complete</span>
              </>
            ) : (
              <>
                <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Active Duty</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-white/10 w-48">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Log Controls</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/10" asChild>
              <a href={`/internal/team/${row.original.profiles.role}/${row.original.user_id}`}>
                <FileSearch className="w-3.5 h-3.5" /> View Full Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/10" onClick={() => toast.info("Correction module launching...")}>
              <Edit className="w-3.5 h-3.5" /> Correct Timestamps
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="gap-2 cursor-pointer text-amber-500 focus:bg-amber-500/10" onClick={() => toast.warning("Discrepancy flagged for review.")}>
              <AlertCircle className="w-3.5 h-3.5" /> Flag Discrepancy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleExportCSV = () => {
    // Basic export logic (could be improved)
    const headers = ["Personnel", "Role", "Date", "Check In", "Check Out", "Status"];
    const rows = attendance.map(log => [
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

        <DataTable
          columns={columns}
          data={attendance}
          searchKey="profiles_full_name" 
          defaultSort={[{ id: 'check_in', desc: true }]}
        />
      </div>
    </AdminViewWrapper>
  );
}
