"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { GovernanceClientProps } from "@/app/[locale]/admin/governance/GovernanceClient";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric, DashboardProfile } from "@/types/dashboard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { ShieldAlert, Book, Vote, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

// Dynamic imports for role-specific components
const ManagingPartnerPanel = dynamic<{ metrics?: DashboardMetric[]; subView?: string }>(() => import("@/components/roles/level-0-governance/managing_partner/PartnerFinancialTools"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const BoardOversightDashboard = dynamic<{ metrics?: DashboardMetric[]; subView?: string }>(() => import("@/components/roles/level-0-governance/board_member/BoardOversightDashboard"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const ConstitutionalLedger = dynamic<{ health?: any[] }>(() => import("@/components/roles/level-0-governance/super_admin/ConstitutionalLedger"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const SystemControlPanel = dynamic<{ health?: any[] }>(() => import("@/components/roles/level-0-governance/super_admin/SystemControlPanel"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const BoardVoteInterface = dynamic(() => import("@/components/roles/level-0-governance/super_admin/BoardVoteInterface"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const StrategicExitFlow = dynamic(() => import("@/components/roles/level-0-governance/super_admin/StrategicExitFlow"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

// Governance intelligence view (resolutions, NIC registry, compliance)
const GovernanceIntelligence = dynamic(
  () => import("@/app/[locale]/admin/governance/GovernanceClient").then(m => ({ default: m.GovernanceClient })),
  { loading: () => <Skeleton className="h-96 w-full rounded-3xl" /> }
);

interface GovernanceGroupProps extends GovernanceClientProps {
  profile: DashboardProfile;
  role: string;
  subView?: string;
}

export function GovernanceGroup({ profile, role, subView, initialMetrics, initialResolutions, nicCodes, health, framework }: GovernanceGroupProps) {
  const tStaff = useTranslations("Common.Staff");
  const router = useRouter();
  const pathname = usePathname();

  // 1. Sub-View Rendering
  if (subView) {
    if (subView === "constitution") {
      return <ConstitutionalLedger health={health} />;
    }

    if (subView === "system") {
      return <SystemControlPanel health={health} />;
    }

    const subViewTitles: Record<string, string> = {
      constitution: "Constitutional Ledger",
      compliance: "Regulatory Framework",
      voting: "Board Resolutions",
      assets: "Capital Assets",
      audit: "System Audit Logs",
    };

    if (subView === "voting") {
      return <BoardVoteInterface />;
    }

    if (subView === "exit") {
      return <StrategicExitFlow />;
    }

    const title = subViewTitles[subView] || subView.charAt(0).toUpperCase() + subView.slice(1);

    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] animate-in fade-in zoom-in duration-500">
        <div className="p-5 bg-white/5 rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">Accessing {title} Feed</h3>
        <p className="text-muted-foreground text-sm max-w-md text-center leading-relaxed">
          Retrieving historical records and official resolutions for the <strong>{role.replace('_', ' ')}</strong> silo.
        </p>
      </div>
    );
  }

  // 2. Hub View Rendering
  const isSuperAdmin = role === 'super_admin';
  const isPartner = role === 'managing_partner';
  const isBoard = role === 'board_member';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <WelcomeHeader
        profile={profile}
        t={tStaff}
        roleName={role.replace("_", " ").toUpperCase()}
      />

      {/* Role-Specific Component Injection */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        {isPartner && <ManagingPartnerPanel metrics={initialMetrics} />}
        {isBoard && <BoardOversightDashboard metrics={initialMetrics} />}
      </Suspense>

      {/* Super Admin: Full Governance Intelligence View */}
      {isSuperAdmin && (
        <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
          <GovernanceIntelligence
            initialResolutions={initialResolutions}
            initialMetrics={initialMetrics}
            nicCodes={nicCodes}
            health={health}
            framework={framework}
            role={role}
          />
        </Suspense>
      )}

      {/* Common Governance Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card
          className="glass-card border-rose-500/20 bg-rose-500/[0.02] cursor-pointer hover:bg-rose-500/5 transition-all group"
          onClick={() => router.push(`${pathname}/system`)}
        >
          <CardContent className="p-8 flex items-center gap-6">
            <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">System Lockdown</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Protocol-Zero Controls</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="glass-card border-indigo-500/20 bg-indigo-500/[0.02] cursor-pointer hover:bg-indigo-500/5 transition-all group"
          onClick={() => router.push(`${pathname}/constitution`)}
        >
          <CardContent className="p-8 flex items-center gap-6">
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
              <Book className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Governance Ledger</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Constitutional Bylaws</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="glass-card border-emerald-500/20 bg-emerald-500/[0.02] cursor-pointer hover:bg-emerald-500/5 transition-all group"
          onClick={() => router.push(`${pathname}/voting`)}
        >
          <CardContent className="p-8 flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
              <Vote className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Board Voting</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Resolution Ratification</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="glass-card border-rose-500/20 bg-rose-500/[0.02] cursor-pointer hover:bg-rose-500/5 transition-all group"
          onClick={() => router.push(`${pathname}/exit`)}
        >
          <CardContent className="p-8 flex items-center gap-6">
            <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 group-hover:scale-110 transition-transform">
              <LogOut className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Strategic Exit</h3>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Offboarding Protocol</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
