"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for external role features
const ClientPortalPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-6-external/client/ProjectOverview"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const FounderOversight = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-6-external/founder/CorporateVision"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CustomerHub = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-6-external/customer/CustomerDashboard"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const UserView = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-6-external/user/UserView"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface ExternalGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function ExternalGroup({ role, subView, metrics = [] }: ExternalGroupProps) {
  if (subView) {
    const subViewTitles: Record<string, string> = {
      projects: "Project Portfolio",
      support: "Service Desk",
      vision: "Corporate Roadmap",
      billing: "Fiscal Portal",
      feedback: "Feedback Hub",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Portal`}
        subtitle={`Self-service modules and resource center for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="GUEST ACCESS"
        authorityLevel="L6 Stakeholder"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Opening {title} Dashboard</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            Retrieving your personalized <strong>{title.toLowerCase()}</strong> and active status for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Portal`}
      subtitle="Collaboration hub and project visibility."
      badgeLabel="EXTERNAL ACCESS"
      authorityLevel="L6 Stakeholder"
    >
      <div className="space-y-10">
        <DashboardHeader />

        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'client' && <ClientPortalPanel metrics={metrics} />}
          {role === 'founder' && <FounderOversight metrics={metrics} />}
          {role === 'customer' && <CustomerHub metrics={metrics} />}
          {role === 'user' && <UserView metrics={metrics} />}

          {/* Generic fallback for other external users */}
          {!['client', 'founder', 'customer', 'user'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.toUpperCase()} Workspace</h3>
              <p className="text-muted-foreground">Self-service modules are active. Support channel is open.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Stakeholder Metrics Grid - De-duplicated */}
        {!['client', 'founder', 'customer', 'user'].includes(role) && metrics.length > 0 && (
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

