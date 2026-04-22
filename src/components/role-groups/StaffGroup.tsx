"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for staff role features
const DomainExpertise = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-4-staff/senior_specialist/DomainExpertise"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const EngineerConsole = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-4-staff/software_engineer/DevTerminal"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const AnalystHub = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-4-staff/analyst/DataPulse"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const EmployeeHub = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-4-staff/employee/EmployeeHub"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const FinancialConsole = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-4-staff/financial_analyst/FinancialAnalystConsole"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface StaffGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function StaffGroup({ role, subView, metrics = [] }: StaffGroupProps) {
  if (subView) {
    const subViewTitles: Record<string, string> = {
      logs: "Task Ledger",
      policy: "Organizational Policy",
      training: "Growth & Skill Center",
      reports: "Operational Analytics",
      documents: "Technical Documentation",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Workspace`}
        subtitle={`Specialized productivity tools for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="STAFF DEPTH"
        authorityLevel="L4 Professional"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Syncing {title} Module</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is optimizing your workflow and synchronizing <strong>{title.toLowerCase()}</strong> for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Portal`}
      subtitle="Operational execution and domain-specific tools."
      badgeLabel="STAFF HUB"
      authorityLevel="L4 Professional"
    >
      <div className="space-y-10">
        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'software_engineer' && <EngineerConsole metrics={metrics} />}
          {role === 'analyst' && <AnalystHub metrics={metrics} />}
          {role === 'employee' && <EmployeeHub metrics={metrics} />}
          {role === 'financial_analyst' && <FinancialConsole metrics={metrics} />}
          {(role === 'senior_specialist' || role === 'marketing_specialist') && <DomainExpertise metrics={metrics} />}

          {/* Generic fallback for other staff */}
          {!['software_engineer', 'analyst', 'employee', 'financial_analyst', 'senior_specialist', 'marketing_specialist'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.replace('_', ' ').toUpperCase()} Workspace</h3>
              <p className="text-muted-foreground">Execution modules are active. Task queue is synchronizing.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Staff Metrics Grid - De-duplicated */}
        {!['software_engineer', 'analyst', 'employee', 'financial_analyst', 'senior_specialist', 'marketing_specialist'].includes(role) && metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {metrics.map((m: DashboardMetric) => (
              <div key={m.id || m.label} className="p-8 border border-white/5 bg-white/[0.01] rounded-3xl hover:bg-white/[0.03] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{m.label}</p>
                  <span className={`text-[10px] px-2 py-1 rounded-full ${m.status === 'Optimal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-4xl font-bold tracking-tighter">{m.value}</p>
                  <span className="text-xs text-emerald-400 font-bold">{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminViewWrapper>
  );
}

