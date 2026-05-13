"use client";

import { useMemo, useState } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Users, ShieldCheck, Clock, Search, TrendingUp, Activity, Server } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface Profile {
  id: string;
  full_name?: string;
  role?: string;
  department?: string;
  is_verified?: boolean;
}

interface Metric {
  label: string;
  value: string;
  change?: string;
  status?: string;
  category?: string;
}

interface AttendanceLog {
  user_id: string;
  status: string;
  date: string;
}

interface SystemLog {
  action: string;
  status: string;
  created_at: string;
}

interface ServiceHealth {
  name: string;
  status: string;
  load_percentage: number;
  uptime_percentage: number;
}

interface PerformanceClientProps {
  profiles: Profile[];
  metrics: Metric[];
  attendance: AttendanceLog[];
  logs: SystemLog[];
  health: ServiceHealth[];
  role: string;
}

export function PerformanceClient({ profiles, metrics, attendance, logs, health, role }: PerformanceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const search = searchParams.get("q") || "";

  const setSearch = useCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  // Pre-process attendance into O(1) lookup Map (Eliminate O(N) nested lookups)
  const attendanceMap = useMemo(() => {
    const m = new Map<string, string>();
    attendance.forEach(a => {
      // Only keep the most recent status for each user today
      if (!m.has(a.user_id)) {
        m.set(a.user_id, a.status);
      }
    });
    return m;
  }, [attendance]);

  // Derived stats (Memoized for high-frequency telemetry stability)
  const { verified, presentToday, recentErrors, avgLoad } = useMemo(() => ({
    verified: profiles.filter(p => p.is_verified).length,
    presentToday: Array.from(attendanceMap.values()).filter(s => s === "present").length,
    recentErrors: logs.filter(l => l.status === "error").length,
    avgLoad: health.length > 0 
      ? Math.round(health.reduce((acc, h) => acc + (h.load_percentage || 0), 0) / health.length)
      : 0
  }), [profiles, attendanceMap, logs, health]);

  // KPI cards - prefer DB metrics, fall back to computed (Memoized)
  const kpis = useMemo(() => [
    {
      label: "Total Personnel",
      value: profiles.length.toString(),
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      sub: `${verified} verified`,
    },
    {
      label: "Attendance Today",
      value: presentToday > 0 ? `${presentToday}` : "—",
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      sub: "present records",
    },
    {
      label: "System Health",
      value: health.length > 0 ? `${100 - avgLoad}%` : "100%",
      icon: ShieldCheck,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: `${health.filter(h => h.status === 'Healthy').length}/${health.length} online`,
    },
    {
      label: "Platform Metrics",
      value: metrics.length.toString(),
      icon: BarChart3,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      sub: "tracked indicators",
    },
  ], [profiles.length, verified, presentToday, health, avgLoad, metrics.length]);

  // Department breakdown
  const deptMap = useMemo(() => {
    const m = new Map<string, number>();
    profiles.forEach(p => {
      const dept = p.department || "Unassigned";
      m.set(dept, (m.get(dept) || 0) + 1);
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [profiles]);

  // Filtered personnel table (Memoized)
  const filtered = useMemo(() => profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase()) ||
    p.department?.toLowerCase().includes(search.toLowerCase())
  ), [profiles, search]);


  return (
    <AdminViewWrapper
      title="Strategic Performance"
      subtitle="Real-time workforce analytics, system telemetry, and organizational KPIs."
      badgeLabel="PERFORMANCE INTELLIGENCE"
      authorityLevel={role.replace("_", " ").toUpperCase()}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <Card key={kpi.label} className="glass-card border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <TrendingUp className="w-3 h-3 text-muted-foreground opacity-40" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{kpi.label}</p>
                  <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Breakdown */}
          <Card className="glass-card border-white/10">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Department Breakdown
              </CardTitle>
              <CardDescription className="text-xs">{profiles.length} total personnel</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {deptMap.slice(0, 8).map(([dept, count]) => {
                  const pct = Math.round((count / profiles.length) * 100);
                  return (
                    <div key={dept} className="px-6 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{dept}</p>
                        <div className="h-1 mt-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-black text-muted-foreground shrink-0">{count}</span>
                    </div>
                  );
                })}
                {deptMap.length === 0 && (
                  <p className="px-6 py-8 text-xs text-muted-foreground italic text-center">No department data.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Metrics from DB */}
          <Card className="glass-card border-white/10 lg:col-span-2">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                Live Platform Metrics
              </CardTitle>
              <CardDescription className="text-xs">Pulled from platform_metrics table</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {health.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase font-black px-6 py-3">Infrastructure Node</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Load</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Uptime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {health.map((h, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="px-6 py-3">
                          <div className="flex items-center gap-2">
                             <Server className="w-3.5 h-3.5 text-muted-foreground" />
                             <span className="font-medium text-sm">{h.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={`text-[9px] font-black uppercase ${
                            h.status === "Healthy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {h.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-xs font-mono">{h.load_percentage}%</TableCell>
                        <TableCell className="px-4 py-3 text-xs font-mono text-emerald-400/70">{h.uptime_percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : metrics.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] uppercase font-black px-6 py-3">Indicator</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Value</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Change</TableHead>
                      <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.map((m, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="px-6 py-3 font-medium text-sm">{m.label}</TableCell>
                        <TableCell className="px-4 py-3 font-bold">{m.value}</TableCell>
                        <TableCell className="px-4 py-3 text-xs text-muted-foreground">{m.change || "—"}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="outline" className={`text-[9px] font-black uppercase ${
                            m.status === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            m.status === "warning" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                            "bg-white/5 text-muted-foreground border-white/5"
                          }`}>
                            {m.status || "active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="px-6 py-10 text-xs text-muted-foreground italic text-center">
                  No telemetry metrics recorded yet.
                </p>
              )}
            </CardContent>

          </Card>
        </div>

        {/* Personnel Data Table */}
        <Card className="glass-card border-white/10 overflow-hidden">
          <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm">Personnel Register</CardTitle>
                <CardDescription className="text-xs">All active profiles in the platform</CardDescription>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search personnel…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-8 bg-white/5 border-white/10 text-xs"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black px-6 py-3">Name</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Role</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Department</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-12 text-center text-muted-foreground italic text-xs">
                        No personnel found.
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(p => (
                    <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] group">
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold shrink-0">
                            {(p.full_name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {p.full_name || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {p.role?.replace(/_/g, " ") || "user"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="text-xs text-muted-foreground">{p.department || "—"}</span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            attendanceMap.get(p.id) === 'present' ? 'bg-emerald-500' :
                            attendanceMap.get(p.id) === 'absent' ? 'bg-rose-500' :
                            'bg-amber-400'
                          }`} />
                          <span className="text-[10px] font-black uppercase">
                            {attendanceMap.get(p.id) || (p.is_verified ? "Pending Check-in" : "Unverified")}
                          </span>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="border-t border-white/5 px-6 py-3 text-[10px] text-muted-foreground">
              Showing {filtered.length} of {profiles.length} personnel
            </div>
          </CardContent>
        </Card>

      </div>
    </AdminViewWrapper>
  );
}
