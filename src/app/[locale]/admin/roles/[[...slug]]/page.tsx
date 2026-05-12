import { getAllProfiles } from "@/app/[locale]/admin/queries";
import { RoleManagerClient } from "../RoleManagerClient";
import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RoleManagerPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<RolesPortalSkeleton />}>
      <RolesPortalContent params={params} />
    </Suspense>
  );
}

async function RolesPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // --- Silo Guard ---
  // 1. Authorization Check (Governance L0 or Executive L1)
  if (!hasPermission(userRole, 1)) {
    return <RestrictedAccess requiredLevel="Executive Management" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // If hitting root /roles, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/roles/${userRole}`);
  }

  // If attempting to access another role's roles view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/roles/${userRole}`);
  }

  const profiles = await getAllProfiles();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <RoleManagerClient initialProfiles={profiles} subView={subView} />
    </div>
  );
}

function RolesPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    </div>
  );
}

