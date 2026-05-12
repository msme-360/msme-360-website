import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { ManagementGroup } from "@/components/role-groups/ManagementGroup";
import { SupervisoryGroup } from "@/components/role-groups/SupervisoryGroup";
import { redirect } from "next/navigation";
import { hasPermission, getRoleById } from "@/lib/constants/roles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<ManagerPortalSkeleton />}>
      <ManagerPortalContent params={params} />
    </Suspense>
  );
}

async function ManagerPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  if (!hasPermission(userRole, 3.5)) {
    redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  const metrics = (userRole === 'recruiter' || userRole === 'hr_manager')
    ? await (await import("@/app/[locale]/dashboard/queries")).getRecruitmentMetrics()
    : await getPlatformMetrics('management');

  const trends = (userRole === 'recruiter' || userRole === 'hr_manager')
    ? await (await import("@/app/[locale]/dashboard/queries")).getRecruitmentTrends()
    : [];

  const roleData = getRoleById(userRole);

  if (roleData.level === 3.5) {
    const managedProfiles = await (await import("@/app/[locale]/dashboard/queries")).getManagedProfiles(user.id);
    return (
      <SupervisoryGroup
        role={userRole}
        subView={subView}
        metrics={metrics}
        managedProfiles={managedProfiles}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ManagementGroup 
        role={userRole} 
        subView={subView} 
        metrics={metrics} 
        trends={trends}
      />
    </div>
  );
}

function ManagerPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

