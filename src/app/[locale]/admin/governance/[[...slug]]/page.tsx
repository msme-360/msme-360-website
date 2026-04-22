import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { GovernanceGroup } from "@/components/role-groups/GovernanceGroup";
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

  const { resolutions, metrics, nicCodes } = await getGovernanceData();

  return (
    <GovernanceGroup
      role={userRole}
      subView={subView}
      initialResolutions={resolutions}
      initialMetrics={metrics}
      nicCodes={nicCodes}
    />
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
