import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { SupportClient } from "../SupportClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupportPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<SupportPortalSkeleton />}>
      <SupportPortalContent params={params} />
    </Suspense>
  );
}

async function SupportPortalContent({
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
  // Support level or higher (L3+)
  if (!hasPermission(userRole, 3)) {
    return <RestrictedAccess requiredLevel="Technical Support" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];
  
  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/admin/support/${userRole}`);
  }

  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
     return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Support Workspace`} />;
  }

  return (
    <SupportClient 
      subView={subView}
    />
  );
}

function SupportPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-[600px] w-full mt-8" />
    </div>
  );
}
