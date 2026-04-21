import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { TechnicalPortalClient, type SysStat, type ServiceStatus } from "../TechnicalClient";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { getTechnicalHealthMetrics } from "../../actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnicalPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<TechnicalPortalSkeleton />}>
      <TechnicalPortalContent params={params} />
    </Suspense>
  );
}

async function TechnicalPortalContent({
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
  // 1. Authorization Check (Executives or Tech Dept Managers)
  const isAuthorized = hasPermission(userRole, 1) || (roleData.department === "Technical" && hasPermission(userRole, 3));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="Technical Leadership" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting root /tech, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/tech/${userRole}`);
  }

  // If attempting to access another role's tech view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/tech/${userRole}`);
  }

  const { sysStats, services }: { sysStats: SysStat[], services: ServiceStatus[] } = await getTechnicalHealthMetrics();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TechnicalPortalClient sysStats={sysStats} services={services} />
    </div>
  );
}

function TechnicalPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    </div>
  );
}
