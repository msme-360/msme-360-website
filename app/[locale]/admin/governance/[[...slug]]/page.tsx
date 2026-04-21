import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { GovernanceClient, type BoardResolution, type GovernanceMetric } from "../GovernanceClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { getGovernanceData } from "../../actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
  // 1. Authorization Check (Governance L0 Only)
  if (!hasPermission(userRole, 0)) {
    return <RestrictedAccess requiredLevel="Governance" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting root /governance, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/governance/${userRole}`);
  }

  // If attempting to access another role's governance view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/governance/${userRole}`);
  }

  const { resolutions, metrics }: { resolutions: BoardResolution[], metrics: GovernanceMetric[] } = await getGovernanceData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GovernanceClient initialResolutions={resolutions} initialMetrics={metrics} />
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
