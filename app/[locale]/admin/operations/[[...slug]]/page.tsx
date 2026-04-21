import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { RoleUnifiedDashboard } from "@/components/dashboards/RoleUnifiedDashboard";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
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
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  // 1. Level Check (Must be Director L2 or higher)
  if (!hasPermission(userRole, 2)) {
    redirect(`/${locale}/dashboard`);
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting the root hub without a slug, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/operations/${userRole}`);
  }

  // If attempting to access another role's silo, block
  if (requestedRole !== userRole) {
    // In operations hub, we strictly force own silo
    redirect(`/${locale}/admin/operations/${userRole}`);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RoleUnifiedDashboard profile={profile as any} />
    </div>
  );
}

function OperationsPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
