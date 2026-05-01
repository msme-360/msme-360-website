import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { HiringPortalClient } from "@/app/[locale]/admin/hiring/HiringPortalClient";
import { Applicant } from "@/app/[locale]/admin/hiring/components/HiringTypes";
import { getApplicants } from "@/app/[locale]/admin/actions";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function InternalHiringPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<HiringSkeleton />}>
      <HiringContent params={params} />
    </Suspense>
  );
}

async function HiringContent({
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
  // Ensure only People Dept Managers or higher can access
  const isAuthorized = roleData.department === "People" && hasPermission(userRole, 3.5);

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="HR Management" />;
  }

  const requestedRole = slug?.[0];

  if (!requestedRole) {
    redirect(`/${locale}/internal/hiring/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/hiring/${userRole}`);
  }

  const applicants = await getApplicants();
  const subView = slug?.[1];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HiringPortalClient
        initialApplicants={applicants as unknown as Applicant[]}
        profile={profile}
        subView={subView}
        role={userRole}
      />
    </div>
  );
}

function HiringSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
