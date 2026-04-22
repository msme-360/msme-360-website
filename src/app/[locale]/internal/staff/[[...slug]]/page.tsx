import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { StaffGroup } from "@/components/role-groups/StaffGroup";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoleById } from "@/lib/constants/roles";

export default function StaffPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<StaffPortalSkeleton />}>
      <StaffPortalContent params={params} />
    </Suspense>
  );
}

async function StaffPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Hub Silo Guard ---
  if (roleData.level !== 4) {
    const hub = roleData.level <= 3.5 ? 'manager' : roleData.level === 5 ? 'associate' : null;
    if (hub) redirect(`/${locale}/internal/${hub}/${userRole}`);
    else redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

  const metrics = await getPlatformMetrics('staff');

  return <StaffGroup role={userRole} subView={subView} metrics={metrics} />;
}

function StaffPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
