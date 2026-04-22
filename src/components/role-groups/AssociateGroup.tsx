"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for associate role features
const InternOnboardingPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-5-associates/intern/OnboardingFlow"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const JrDevLaunchpad = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-5-associates/jr_developer/LearningPath"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const AssociateLaunchpad = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-5-associates/associate/AssociateLaunchpad"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const TraineeLaunchpad = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-5-associates/trainee/TraineeLaunchpad"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface AssociateGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
}

export function AssociateGroup({ role, subView, metrics = [] }: AssociateGroupProps) {
  if (subView) {
    const subViewTitles: Record<string, string> = {
      roadmap: "Growth Roadmap",
      tasks: "Operational Tasks",
      hub: "Tactical Hub",
      performance: "Performance Analytics",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Portal`}
        subtitle={`Career progression and training modules for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="ASSOCIATE DEPTH"
        authorityLevel="L5 Emerging"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Initializing {title} Path</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            MSME 360 AI is generating your personalized <strong>{title.toLowerCase()}</strong> and training curriculum for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Launchpad`}
      subtitle="Foundational training and tactical execution."
      badgeLabel="ASSOCIATE HUB"
      authorityLevel="L5 Emerging Talent"
    >
      <div className="space-y-10">
        {/* 1. Role-Specific Component Injection */}
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'intern' && <InternOnboardingPanel metrics={metrics} />}
          {role === 'jr_developer' && <JrDevLaunchpad metrics={metrics} />}
          {role === 'associate' && <AssociateLaunchpad metrics={metrics} />}
          {role === 'trainee' && <TraineeLaunchpad metrics={metrics} />}

          {/* Generic fallback for other associates */}
          {!['intern', 'jr_developer', 'associate', 'trainee'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.replace('_', ' ').toUpperCase()} Launchpad</h3>
              <p className="text-muted-foreground">Foundational modules are active. Career roadmap is initializing.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Associate Metrics Grid - De-duplicated for specialized roles */}
        {!['intern', 'jr_developer', 'associate', 'trainee'].includes(role) && metrics.length > 0 && (
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

