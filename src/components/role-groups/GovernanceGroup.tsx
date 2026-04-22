"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { GovernanceClientProps } from "@/app/[locale]/admin/governance/GovernanceClient";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardMetric } from "@/types/dashboard";

// Dynamic imports for role-specific components
const SuperAdminPanel = dynamic<{ metrics?: DashboardMetric[]; subView?: string }>(() => import("@/components/roles/level-0-governance/super_admin/SuperAdminPanel"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const ManagingPartnerPanel = dynamic<{ metrics?: DashboardMetric[]; subView?: string }>(() => import("@/components/roles/level-0-governance/managing_partner/PartnerFinancialTools"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

const BoardOversightDashboard = dynamic<{ metrics?: DashboardMetric[]; subView?: string }>(() => import("@/components/roles/level-0-governance/board_member/BoardOversightDashboard"), {
  loading: () => <Skeleton className="h-64 w-full rounded-3xl" />,
});

interface GovernanceGroupProps extends GovernanceClientProps {
  role: string;
  subView?: string;
}

export function GovernanceGroup({ role, subView, initialMetrics }: GovernanceGroupProps) {
  // 1. Sub-View Rendering
  if (subView) {
    const subViewTitles: Record<string, string> = {
      constitution: "Constitutional Ledger",
      compliance: "Regulatory Framework",
      voting: "Board Resolutions",
      assets: "Capital Assets",
      audit: "System Audit Logs",
    };

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
      {/* Role-Specific Component Injection */}
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-3xl" />}>
        {isSuperAdmin && <SuperAdminPanel metrics={initialMetrics} />}
        {isPartner && <ManagingPartnerPanel metrics={initialMetrics} />}
        {isBoard && <BoardOversightDashboard metrics={initialMetrics} />}
      </Suspense>

      {/* Common Governance Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground italic">
            Shared Governance Modules for {role.replace('_', ' ')} are active.
          </p>
        </div>
      </div>
    </div>
  );
}

