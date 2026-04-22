import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { GovernanceClient } from "../GovernanceClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { getGovernanceData } from "../../actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export default function GovernanceCenterPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<GovernancePortalSkeleton />}>
      <GovernancePortalContent params={params} />
    </Suspense>
  );
}

async function GovernancePortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // --- Silo Guard ---
  if (!hasPermission(userRole, 0)) {
    return <RestrictedAccess requiredLevel="Governance" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/admin/governance/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/governance/${userRole}`);
  }

  // 2. Sub-View Routing (New Phase 1 Implementation)
  if (subView) {
    return (
      <AdminViewWrapper
        title={`${subView.charAt(0).toUpperCase() + subView.slice(1)} Registry`}
        subtitle={`Detailed governance records for ${requestedRole.replace('_', ' ')}.`}
        badgeLabel="GOVERNANCE DEPTH"
        authorityLevel="L0 Registry"
      >
        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-2">Detailed {subView} view is under construction.</h3>
          <p className="text-muted-foreground text-sm">MSME 360 Governance Framework is synchronizing this module.</p>
        </div>
      </AdminViewWrapper>
    );
  }

  const { resolutions, metrics, nicCodes } = await getGovernanceData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GovernanceClient 
        initialResolutions={resolutions} 
        initialMetrics={metrics} 
        nicCodes={nicCodes} 
        role={userRole}
      />
    </div>
  );
}

function GovernancePortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
