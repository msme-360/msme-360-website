import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { RoleUnifiedDashboard } from "@/components/dashboards/RoleUnifiedDashboard";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlatformMetrics } from "../../actions";

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
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const metrics = await getPlatformMetrics('governance'); // Executive hub usually strategic or governance metrics
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  // 1. Level Check (Must be Executive L1 or L1.5)
  if (!hasPermission(userRole, 1.5)) {
    return <RestrictedAccess requiredLevel="Senior Executive" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];
  
  // If hitting the root hub without a slug, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/executive/${userRole}`);
  }

  // If attempting to access another role's silo, block or redirect
  if (requestedRole !== userRole) {
    return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Workspace`} />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RoleUnifiedDashboard profile={profile} initialMetrics={metrics} />
    </div>
  );
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
