import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { TeamClient } from "../TeamClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<TeamPortalSkeleton />}>
      <TeamPortalContent params={params} />
    </Suspense>
  );
}

async function TeamPortalContent({
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
  // Manager level or higher (L1.5/L2+)
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Organizational Manager" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];
  
  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/team/${userRole}`);
  }

  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
     return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Team Workspace`} />;
  }

  return (
    <TeamClient 
      subView={subView}
    />
  );
}

function TeamPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-[500px] w-full mt-8" />
    </div>
  );
}
