import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { WorkforceManager } from "../../WorkforceManager";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getWorkforce } from "@/services/api/workforce";

export default function ExecutiveWorkforcePage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<WorkforcePortalSkeleton />}>
      <ExecutiveWorkforceContent params={params} />
    </Suspense>
  );
}

async function ExecutiveWorkforceContent({
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
  // 1. Authorization Check (Executive L1 Only)
  if (!hasPermission(userRole, 1)) {
    return <RestrictedAccess requiredLevel="Executive" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting root /workforce, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/executive/workforce/${userRole}`);
  }

  // If attempting to access another role's workforce view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/executive/workforce/${userRole}`);
  }

  // Fetch Real Data
  const profiles = await getWorkforce();

  return (
    <AdminViewWrapper
      title="Workforce Management"
      subtitle="Comprehensive oversight of organization-wide human capital and departmental allocations."
      badgeLabel="OPERATIONAL AUDIT"
      authorityLevel="L1 Executive"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WorkforceManager profiles={profiles} />
      </div>
    </AdminViewWrapper>
  );
}

function WorkforcePortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
