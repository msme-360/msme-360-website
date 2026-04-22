"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for VP role features
const VpEngineeringStrategy = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp_engineering/VpEngineeringStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const VpProductStrategy = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp_product/VpProductStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const VpOperationsStrategy = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp_operations/VpOperationsStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const VpMarketingStrategy = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp_marketing/VpMarketingStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const VpFinanceStrategy = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp_finance/VpFinanceStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const VerticalStrategy = dynamic<{ role: string; metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-5-senior-management/vp/VerticalStrategy"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface VPGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function VPGroup({ role, subView, metrics = [] }: VPGroupProps) {
  if (subView) {
    return (
      <AdminViewWrapper
        title={`${subView.toUpperCase()} Intelligence`}
        subtitle={`Detailed executive analytics for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="VP DEPTH"
        authorityLevel="L1.5 EXEC"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Compiling {subView.charAt(0).toUpperCase() + subView.slice(1)} Intel</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            Aggregating department-wide telemetry and performance markers for the <strong>{role.replace('_', ' ')}</strong> vertical.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Strategy`}
      subtitle="Departmental growth and strategic alignment."
      badgeLabel="VP PORTAL"
      authorityLevel="L1.5 EXEC"
    >
      <div className="space-y-10">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'vp_engineering' && <VpEngineeringStrategy metrics={metrics} />}
          {role === 'vp_product' && <VpProductStrategy metrics={metrics} />}
          {role === 'vp_operations' && <VpOperationsStrategy metrics={metrics} />}
          {role === 'vp_marketing' && <VpMarketingStrategy metrics={metrics} />}
          {role === 'vp_finance' && <VpFinanceStrategy metrics={metrics} />}
          {!['vp_engineering', 'vp_product', 'vp_operations', 'vp_marketing', 'vp_finance'].includes(role) && (
            <VerticalStrategy role={role} metrics={metrics} />
          )}
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((m: DashboardMetric) => (
            <div key={m.id} className="p-8 border border-white/5 bg-white/[0.01] rounded-3xl hover:bg-white/[0.03] transition-all group">
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
      </div>
    </AdminViewWrapper>
  );
}

