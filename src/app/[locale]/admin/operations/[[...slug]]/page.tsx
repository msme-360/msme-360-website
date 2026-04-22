import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { OperationsGroup } from "@/components/role-groups/OperationsGroup";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function OperationsPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<OperationsPortalSkeleton />}>
      <OperationsPortalContent params={params} />
    </Suspense>
  );
}

async function OperationsPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Silo Guard ---
  const isAuthorized = hasPermission(userRole, 2) || (roleData.department === "Operations" && hasPermission(userRole, 3));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="Operations Leadership" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // If hitting root /operations, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/operations/${userRole}`);
  }

  // If attempting to access another role's operations view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/operations/${userRole}`);
  }

  const metrics = await getPlatformMetrics('operations');

  return <OperationsGroup role={userRole} subView={subView} metrics={metrics} />;
}

function OperationsPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
