"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";
import type { TeamMember, ProjectPulseItem } from "@/components/roles/level-3-5-supervisory/team_lead/MentorshipOversight";
import type { Meeting } from "@/types/meeting";

// Dynamic imports for supervisory role features
const ProjectLeadPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-5-supervisory/project_lead/DeliveryPulse"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const TeamLeadPanel = dynamic<{ metrics?: DashboardMetric[]; managedProfiles?: TeamMember[]; mentorId?: string; syncs?: Meeting[]; projectPulse?: ProjectPulseItem[] }>(() => import("@/components/roles/level-3-5-supervisory/team_lead/MentorshipOversight"), {
  loading: () => <Skeleton className="h-[500px] w-full rounded-3xl" />,
});

const SupervisorPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-5-supervisory/supervisor/ShiftHub"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const CoordinatorPanel = dynamic<{ metrics?: DashboardMetric[] }>(() => import("@/components/roles/level-3-5-supervisory/coordinator/RouteOptimizer"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface SupervisoryGroupProps {
  role: string;
  subView?: string;
  metrics?: DashboardMetric[];
  managedProfiles?: TeamMember[];
  mentorId?: string;
  syncs?: Meeting[];
  projectPulse?: ProjectPulseItem[];
}

export function SupervisoryGroup({ role, subView, metrics = [], managedProfiles = [], mentorId, syncs = [], projectPulse = [] }: SupervisoryGroupProps) {
  if (subView) {
    const subViewTitles: Record<string, string> = {
      inspection: "Site Inspection Hub",
      qa: "Quality Assurance",
      shifts: "Shift Scheduler",
      logistics: "Supply Coordination",
      safety: "Safety Protocol",
    };

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <AdminViewWrapper
        title={`${title} Oversight`}
        subtitle={`Detailed tactical coordination for ${role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="SUPV DEPTH"
        authorityLevel="L3.5 Supervisor"
      >
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
          <div className="p-5 bg-white/5 rounded-full mb-6 relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-2xl font-bold mb-3 tracking-tight">Accessing {title} Feed</h3>
          <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
            Streaming real-time operational logs and <strong>{title.toLowerCase()}</strong> metrics for <strong>{role.replace('_', ' ')}</strong>.
          </p>
        </div>
      </AdminViewWrapper>
    );
  }
  return (
    <AdminViewWrapper
      title={`${role.replace('_', ' ').toUpperCase()} Oversight`}
      subtitle="Tactical coordination and unit performance monitoring."
      badgeLabel="SUPERVISORY HUB"
      authorityLevel="L3.5 Supervisor"
    >
      <div className="space-y-10">
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          {role === 'project_lead' && <ProjectLeadPanel metrics={metrics} />}
          {role === 'team_lead' && <TeamLeadPanel metrics={metrics} managedProfiles={managedProfiles} mentorId={mentorId} syncs={syncs} projectPulse={projectPulse} />}
          {role === 'supervisor' && <SupervisorPanel metrics={metrics} />}
          {role === 'coordinator' && <CoordinatorPanel metrics={metrics} />}
          {!['project_lead', 'team_lead', 'supervisor', 'coordinator'].includes(role) && (
            <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] text-center">
              <h3 className="text-xl font-bold mb-2">{role.replace('_', ' ').toUpperCase()} Oversight</h3>
              <p className="text-muted-foreground">Tactical monitoring modules are active. Unit data is synchronizing.</p>
            </div>
          )}
        </Suspense>

        {/* 2. Supervisory Metrics Grid - De-duplicated */}
        {!['project_lead', 'team_lead', 'supervisor', 'coordinator'].includes(role) && metrics.length > 0 && (
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

