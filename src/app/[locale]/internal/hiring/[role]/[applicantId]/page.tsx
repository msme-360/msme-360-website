import { getUser } from "@/services/supabase/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { getApplicants, getApplicationMetrics } from "@/app/[locale]/admin/actions";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileViewerClient from "./ProfileViewerClient";

export default function ApplicantProfilePage({
  params
}: {
  params: Promise<{ locale: string, role: string, applicantId: string }>
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent params={params} />
    </Suspense>
  );
}

async function ProfileContent({
  params
}: {
  params: Promise<{ locale: string, role: string, applicantId: string }>
}) {
  const { locale, role, applicantId } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // Silo Guard
  const isAuthorized = roleData.department === "People" && hasPermission(userRole, 3);
  if (!isAuthorized || userRole !== role) {
    return <RestrictedAccess requiredLevel="HR Management" />;
  }

  const applicants = await getApplicants();
  const applicant = applicants.find(a => a.id === applicantId);

  if (!applicant) {
    return notFound();
  }

  const metrics = await getApplicationMetrics(applicantId);
  const { getCareerRoles } = await import("@/app/[locale]/admin/actions");
  const availableRoles = await getCareerRoles();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ProfileViewerClient 
        applicant={applicant}
        initialMetrics={metrics}
        user={user}
        userRole={userRole}
        availableRoles={availableRoles}
      />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-96 w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  );
}

