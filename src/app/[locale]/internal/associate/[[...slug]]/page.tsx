import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "@/app/[locale]/dashboard/queries";
import { 
  getTasks, 
  getAttendanceLogs, 
  getOnboardingChecklist, 
  getMentorDetails,
  getPromotionStatus,
  getPerformanceData
} from "@/app/[locale]/internal/actions";
import { AssociateClient } from "../AssociateClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssociatePortalPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string, slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <Suspense fallback={<AssociatePortalSkeleton />}>
      <AssociatePortalContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function AssociatePortalContent({
  params,
  searchParams
}: {
  params: Promise<{ locale: string, slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, slug } = await params;
  const { view: queryView } = await searchParams;

  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  if (!hasPermission(userRole, 5)) {
    redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  // 2. Fetch Data (Parallelized for Industry-Grade Performance)
  const [tasks, attendance, checklist, promotion, metrics, performanceData] = await Promise.all([
    getTasks(user.id),
    getAttendanceLogs(user.id),
    getOnboardingChecklist(user.id),
    getPromotionStatus(user.id),
    getPlatformMetrics('associate'),
    getPerformanceData(user.id)
  ]);

  const mentor = profile?.manager_id ? await getMentorDetails(profile.manager_id) : null;

  return (
    <AssociateClient
      profile={profile}
      initialTasks={tasks}
      initialAttendance={attendance}
      initialChecklist={checklist}
      mentor={mentor}
      promotion={promotion}
      view={(queryView || subView) as "roadmap" | "hub" | "attendance" | "planner" | undefined}
      metrics={metrics}
      performanceData={performanceData}
    />
  );
}

function AssociatePortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

