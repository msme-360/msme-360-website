import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { ExecutiveGroup } from "@/components/role-groups/ExecutiveGroup";
import { VPGroup } from "@/components/role-groups/VPGroup";
import { hasPermission, getRoleById } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExecutivePortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<ExecutivePortalSkeleton />}>
      <ExecutivePortalContent params={params} />
    </Suspense>
  );
}

async function ExecutivePortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  if (!hasPermission(userRole, 1.5)) {
    return <RestrictedAccess requiredLevel="Senior Executive" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/admin/executive/${userRole}`);
  }

  if (requestedRole !== userRole) {
    return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Workspace`} />;
  }

  // 2. Fetch Data
  const metrics = await getPlatformMetrics('executive');
  const financeMetrics = await getPlatformMetrics('finance');
  const roleData = getRoleById(userRole);

  if (roleData.level === 1.5) {
    return <VPGroup profile={profile} role={userRole} subView={subView} metrics={[...metrics, ...financeMetrics]} />;
  }

  return <ExecutiveGroup profile={profile} role={userRole} subView={subView} metrics={[...metrics, ...financeMetrics]} />;
}

function ExecutivePortalSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

