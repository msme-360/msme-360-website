"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for management role features
const RecruiterPanel = dynamic<{ metrics?: DashboardMetric[], trends?: any[] }>(() => import("@/components/roles/level-3-management/recruiter/RecruiterPanel"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const HRManagerPanel = dynamic<{ metrics?: DashboardMetric[], trends?: any[] }>(() => import("@/components/roles/level-3-management/hr_manager/TalentStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const EngineeringManagerPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-management/engineering_manager/VelocityBoard"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const ProductManagerHub = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-management/product_manager/ProductManagerHub"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const OperationsManagerHub = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-management/operations_manager/OperationsManagerHub"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});


interface ManagementGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
  trends?: any[];
}

export function ManagementGroup({ role, subView, metrics = [], trends = [] }: ManagementGroupProps) {
  if (subView) {
    const subViewTitles: Record<string, string> = {
      sla: "SLA Tracker",
      docs: "Team Documentation",
      sync: "Daily Sync Portal",
      milestones: "Project Milestones",
      logistics: "Logistics Console",
      routing: "Task Routing Hub",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Management`}
        subtitle={`Detailed operational controls for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="MGMT DEPTH"
        authorityLevel="L4 Operations"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Syncing {title} Module</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is aggregating team performance and <strong>{title.toLowerCase()}</strong> logs for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Command`}
      subtitle="Operational leadership and people management hub."
      badgeLabel="MANAGEMENT HUB"
      authorityLevel="L4 Operational Lead"
    >
      <div className="space-y-10">
        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'hr_manager' && <HRManagerPanel metrics={metrics} trends={trends} />}
          {role === 'engineering_manager' && <EngineeringManagerPanel metrics={metrics} />}
          {role === 'recruiter' && <RecruiterPanel metrics={metrics} trends={trends} />}
          {role === 'product_manager' && <ProductManagerHub metrics={metrics} />}
          {role === 'operations_manager' && <OperationsManagerHub metrics={metrics} />}

          {/* Generic fallback for other managers */}
          {!['hr_manager', 'engineering_manager', 'recruiter', 'product_manager', 'operations_manager'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.replace('_', ' ').toUpperCase()} Command</h3>
              <p className="text-muted-foreground">Operational management modules are active. Team data is synchronizing.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Management Metrics Grid - De-duplicated */}
        {!['hr_manager', 'engineering_manager', 'recruiter', 'product_manager', 'operations_manager'].includes(role) && metrics.length > 0 && (
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

