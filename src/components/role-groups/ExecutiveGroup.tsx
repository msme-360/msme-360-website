"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { DashboardMetric, DashboardProfile } from "@/types/dashboard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { useTranslations } from "next-intl";

// Dynamic imports for executive role features
const CTOTechOversight = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/cto/TechOversight"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CEORoadmap = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/ceo/StrategicRoadmap"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CFOTreasury = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/cfo/TreasuryControl"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const COOEfficiency = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/coo/OperationsPulse"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CMOIntelligence = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/cmo/CMOIntelligence"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CHROPeople = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/chro/CHROPeopleOperations"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CIOControl = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-1-executive/cio/CIOInformationControl"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});


interface ExecutiveGroupProps {
  profile: DashboardProfile;
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function ExecutiveGroup({ profile, role, subView, metrics = [] }: ExecutiveGroupProps) {
  const tStaff = useTranslations("Common.Staff");
  if (subView) {
    const subViewTitles: Record<string, string> = {
      performance: "Performance Intelligence",
      pr: "Public Relations Hub",
      ip: "Patent Portfolio",
      growth: "Growth Strategy",
      workforce: "Workforce Analytics",
      policy: "Policy Manager",
      security: "Cybersecurity Bureau",
      ops: "Efficiency Hub",
      velocity: "Delivery Velocity",
      adoption: "Market Adoption",
      flows: "Process Flow",
      campaigns: "Campaign Intel",
      fiscal: "Fiscal Review",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Intelligence`}
        subtitle={`Detailed executive analytics and controls for ${role.toUpperCase()}.`}
        badgeLabel="EXECUTIVE DEPTH"
        authorityLevel="L1 Workspace"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <Activity className="w-10 h-10 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Synchronizing {title} Stream</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is currently mapping real-time <strong>{title.toLowerCase()}</strong> data from the <strong>{role.toUpperCase()}</strong> silo to this module.
            Real-time telemetry will appear here shortly.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }

  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Intelligence`}
      subtitle="Strategic oversight and company-wide KPI monitoring."
      badgeLabel="EXECUTIVE PORTAL"
      authorityLevel="Strategic Control"
    >
      <div className="space-y-10">
        <WelcomeHeader
          profile={profile}
          t={tStaff as (key: string, values?: Record<string, unknown>) => string}
          roleName={role.replace("_", " ").toUpperCase()}
        />

        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'cto' && <CTOTechOversight metrics={metrics} />}
          {role === 'ceo' && <CEORoadmap metrics={metrics} />}
          {role === 'cfo' && <CFOTreasury metrics={metrics} />}
          {role === 'coo' && <COOEfficiency metrics={metrics} />}
          {role === 'cmo' && <CMOIntelligence metrics={metrics} />}
          {role === 'chro' && <CHROPeople metrics={metrics} />}
          {role === 'cio' && <CIOControl metrics={metrics} />}

          {/* Fallback for other C-Suite roles */}
          {!['cto', 'ceo', 'cfo', 'coo', 'cmo', 'chro', 'cio'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">Executive Intelligence for {role.toUpperCase()}</h3>
              <p className="text-muted-foreground">Standard strategic modules are active. Custom dashboard is being optimized.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Real-time Strategic Metrics - De-duplicated */}
        {!['cto', 'ceo', 'cfo', 'coo', 'cmo', 'chro', 'cio'].includes(role) && metrics.length > 0 && (
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

