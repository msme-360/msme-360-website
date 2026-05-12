import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { HiringPortalClient } from "../HiringPortalClient";
import { Applicant } from "../components/HiringTypes";
import { getApplicants } from "../../actions";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HiringPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<HiringPortalSkeleton />}>
      <HiringPortalContent params={params} />
    </Suspense>
  );
}

async function HiringPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Silo Guard ---
  // 1. Authorization Check (Executives or People Dept Managers)
  const isAuthorized = hasPermission(userRole, 1) || (roleData.department === "People" && hasPermission(userRole, 3));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="HR Management" />;
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting root /hiring, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/hiring/${userRole}`);
  }

  // If attempting to access another role's hiring view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/hiring/${userRole}`);
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

function HiringPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

