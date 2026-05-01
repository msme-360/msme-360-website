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

export default function OnboardingRegistryPage({
  params
}: {
  params: Promise<{ locale: string, role: string }>
}) {
  return (
    <Suspense fallback={<HiringSkeleton />}>
      <OnboardingContent params={params} />
    </Suspense>
  );
}

async function OnboardingContent({
  params
}: {
  params: Promise<{ locale: string, role: string }>
}) {
  const { locale, role } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Silo Guard ---
  // Ensure only People Dept Managers or higher can access
  const isAuthorized = roleData.department === "People" && hasPermission(userRole, 3);

  if (!isAuthorized || userRole !== role) {
    return <RestrictedAccess requiredLevel="HR Management" />;
  }

  const applicants = await getApplicants();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HiringPortalClient
        initialApplicants={applicants as unknown as Applicant[]}
        profile={profile}
        subView="onboarding"
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
