"use client";

import { useState } from "react";
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
import {
  Building2,
  Search,
  Globe,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CompanyProfile {
  id: string;
  full_name?: string;
  email?: string;
  role?: string;
  department?: string;
  is_verified?: boolean;
  created_at?: string;
}

interface NicCode {
  id: string;
  code: string;
  description?: string;
  category?: string;
}

interface ComplianceTask {
  id: string;
  title?: string;
  status?: string;
  due_date?: string;
  user_id?: string;
}

interface TeamMember {
  id: string;
  name?: string;
  role?: string;
  department?: string;
  status?: string;
}

interface CompanyRegistryClientProps {
  companies: CompanyProfile[];
  nicCodes: NicCode[];
  compliance: ComplianceTask[];
  teamMembers: TeamMember[];
  role: string;
}

const statusIcon = (status?: string) => {
  switch (status) {
    case "completed":
    case "done":
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case "pending":
    case "in_progress":
      return <Clock className="w-3.5 h-3.5 text-amber-400" />;
    default:
      return <AlertCircle className="w-3.5 h-3.5 text-rose-400" />;
  }
};

export function CompanyRegistryClient({
  companies,
  nicCodes,
  compliance,
  teamMembers,
  role,
}: CompanyRegistryClientProps) {
  const [companySearch, setCompanySearch] = useState("");
  const [nicSearch, setNicSearch] = useState("");
  const [tab, setTab] = useState<"company" | "nic" | "compliance" | "team">("company");

  const complianceDone = compliance.filter(c =>
    ["completed", "done"].includes(c.status || "")
  ).length;

  const kpis = [
    {
      label: "Registered Entities",
      value: companies.length,
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "NIC Classifications",
      value: nicCodes.length,
      icon: Globe,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Compliance Score",
      value: compliance.length > 0
        ? `${Math.round((complianceDone / compliance.length) * 100)}%`
        : "—",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Workforce",
      value: teamMembers.length,
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  const tabs = [
    { id: "company", label: "Entities" },
    { id: "nic", label: "NIC Registry" },
    { id: "compliance", label: "Compliance" },
    { id: "team", label: "Workforce" },
  ] as const;

  const filteredCompanies = companies.filter(c =>
    c.full_name?.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.department?.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredNic = nicCodes.filter(n =>
    n.code?.toLowerCase().includes(nicSearch.toLowerCase()) ||
    n.description?.toLowerCase().includes(nicSearch.toLowerCase()) ||
    n.category?.toLowerCase().includes(nicSearch.toLowerCase())
  );

  return (
    <AdminViewWrapper
      title="Company Registry"
      subtitle="Organizational entities, NIC classifications, compliance status and workforce ledger."
      badgeLabel="CORPORATE REGISTRY"
      authorityLevel={role.replace(/_/g, " ").toUpperCase()}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <Card key={kpi.label} className="glass-card border-white/10">
              <CardContent className="p-6">
                <div className={`inline-flex p-2.5 rounded-xl ${kpi.bg} mb-4`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{kpi.label}</p>
                <p className="text-3xl font-bold mt-1">{kpi.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 p-1 bg-white/[0.03] border border-white/10 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Entities Tab */}
        {tab === "company" && (
          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">Registered Entities</CardTitle>
                  <CardDescription className="text-xs">
                    Founders, principals, and executive leads in the system
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search entities…"
                    value={companySearch}
                    onChange={e => setCompanySearch(e.target.value)}
                    className="pl-9 h-8 bg-white/5 border-white/10 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black px-6 py-3">Entity / Principal</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Role</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Department</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center text-muted-foreground italic text-xs">
                        No entities found. Founders and principals will appear here once onboarded.
                      </TableCell>
                    </TableRow>
                  ) : filteredCompanies.map(c => (
                    <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02] group">
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold shrink-0">
                            {(c.full_name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {c.full_name || "—"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{c.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {c.role?.replace(/_/g, " ") || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">
                        {c.department || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase ${
                          c.is_verified
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          {c.is_verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">
                        {c.created_at
                          ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true })
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-white/5 px-6 py-3 text-[10px] text-muted-foreground">
                {filteredCompanies.length} of {companies.length} entities
              </div>
            </CardContent>
          </Card>
        )}

        {/* NIC Registry Tab */}
        {tab === "nic" && (
          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm">NIC Code Registry</CardTitle>
                  <CardDescription className="text-xs">
                    National Industry Classification codes for business categorization
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search code or sector…"
                    value={nicSearch}
                    onChange={e => setNicSearch(e.target.value)}
                    className="pl-9 h-8 bg-white/5 border-white/10 text-xs"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black px-6 py-3 w-28">NIC Code</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Description</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNic.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-16 text-center text-muted-foreground italic text-xs">
                        No NIC codes found.
                      </TableCell>
                    </TableRow>
                  ) : filteredNic.map(n => (
                    <TableRow key={n.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="px-6 py-3">
                        <Badge variant="outline" className="font-black text-[10px] bg-primary/10 text-primary border-primary/20 px-2">
                          {n.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">{n.description || "—"}</TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">{n.category || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t border-white/5 px-6 py-3 text-[10px] text-muted-foreground">
                {filteredNic.length} of {nicCodes.length} codes
              </div>
            </CardContent>
          </Card>
        )}

        {/* Compliance Tab */}
        {tab === "compliance" && (
          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
              <CardTitle className="text-sm">Compliance Tasks</CardTitle>
              <CardDescription className="text-xs">
                {complianceDone} of {compliance.length} tasks completed
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black px-6 py-3">Task</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compliance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-16 text-center text-muted-foreground italic text-xs">
                        No compliance tasks found.
                      </TableCell>
                    </TableRow>
                  ) : compliance.map(c => (
                    <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="px-6 py-3.5 font-medium text-sm">{c.title || "Untitled Task"}</TableCell>
                      <TableCell className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {statusIcon(c.status)}
                          <span className="text-[10px] font-black uppercase">{c.status || "unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">
                        {c.due_date ? new Date(c.due_date).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Workforce Tab */}
        {tab === "team" && (
          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
              <CardTitle className="text-sm">Workforce Register</CardTitle>
              <CardDescription className="text-xs">{teamMembers.length} team members</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black px-6 py-3">Name</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Role</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Department</TableHead>
                    <TableHead className="text-[10px] uppercase font-black px-4 py-3">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-16 text-center text-muted-foreground italic text-xs">
                        No team members found.
                      </TableCell>
                    </TableRow>
                  ) : teamMembers.map(m => (
                    <TableRow key={m.id} className="border-white/5 hover:bg-white/[0.02] group">
                      <TableCell className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold shrink-0">
                            {(m.name || "?").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {m.name || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">{m.role || "—"}</TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-muted-foreground">{m.department || "—"}</TableCell>
                      <TableCell className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                          <span className="text-[10px] font-black uppercase">{m.status || "—"}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      </div>
    </AdminViewWrapper>
  );
}
