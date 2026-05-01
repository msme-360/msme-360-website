"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardProfile, DashboardMetric } from "@/types/dashboard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { useTranslations } from "next-intl";

// Dynamic imports for operations role features
const HROperations = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-2-operations-leadership/director_operations/OpsEfficiency"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const FinancialOperations = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-2-operations-leadership/director_finance/FiscalAudit"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const TechnicalOperations = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-2-operations-leadership/director_engineering/DevXDashboard"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const MarketingOperations = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-2-operations-leadership/director_product/ProductLifecycle"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const MarketingExcellence = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-2-operations-leadership/director_marketing/DirectorMarketingPanel"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface OperationsGroupProps {
  profile: DashboardProfile;
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function OperationsGroup({ profile, role, subView, metrics = [] }: OperationsGroupProps) {
  const tStaff = useTranslations("Common.Staff");
  if (subView) {
    const subViewTitles: Record<string, string> = {
      resources: "Resource Planning",
      finance: "Cash Flow Hub",
      product: "Roadmap Alignment",
      roi: "Campaign ROI",
      flows: "Process Architecture",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Tactical Hub`}
        subtitle={`Detailed operational toolset for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="OPS DEPTH"
        authorityLevel="L2 Operations"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Routing {title} Workflow</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            Configuring tactical <strong>{title.toLowerCase()}</strong> tools and resource trackers for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Dashboard`}
      subtitle="Strategic scaling and resource management for operations."
      badgeLabel="OPERATIONS HUB"
      authorityLevel="L5 Strategic Lead"
    >
      <div className="space-y-10">
        <WelcomeHeader
          profile={profile}
          t={tStaff}
          roleName={role.replace("_", " ").toUpperCase()}
        />

        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'director_operations' && <HROperations metrics={metrics} />}
          {role === 'director_finance' && <FinancialOperations metrics={metrics} />}
          {role === 'director_engineering' && <TechnicalOperations metrics={metrics} />}
          {role === 'director_product' && <MarketingOperations metrics={metrics} />}
          {role === 'director_marketing' && <MarketingExcellence metrics={metrics} />}

          {/* Generic fallback for other directors */}
          {!['director_operations', 'director_finance', 'director_engineering', 'director_product', 'director_marketing'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.replace('_', ' ').toUpperCase()} Intelligence</h3>
              <p className="text-muted-foreground">Strategic departmental oversight is active. Resource modules are synchronizing.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Operations Metrics Grid - De-duplicated */}
        {!['director_operations', 'director_finance', 'director_engineering', 'director_product', 'director_marketing'].includes(role) && metrics.length > 0 && (
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

