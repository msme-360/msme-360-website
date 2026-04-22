import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { AssociateGroup } from "@/components/role-groups/AssociateGroup";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssociatePortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<AssociatePortalSkeleton />}>
      <AssociatePortalContent params={params} />
    </Suspense>
  );
}

async function AssociatePortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  if (!hasPermission(userRole, 5)) {
    redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  // 2. Fetch Data
  const metrics = await getPlatformMetrics('associate');


  return (
    <AssociateGroup
      role={userRole}
      subView={subView}
      metrics={metrics}
    />
  );
}

function AssociatePortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
