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

  // 2. Sub-View Routing (Phase 1 Placeholder Integration)
  if (subView) {
    return (
      <RoleUnifiedDashboard 
        profile={profile} 
        activeTab={subView}
        isSubView={true}
      />
    );
  }

  const metrics = await getPlatformMetrics('governance');

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
