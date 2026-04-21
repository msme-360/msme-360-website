import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AssociateClient } from "../AssociateClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs, getOnboardingChecklist, getMentorDetails } from "@/app/[locale]/internal/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AssociatePortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<AssociatePortalSkeleton />}>
      <AssociatePortalContent params={params} />
    </Suspense>
  );
}

async function AssociatePortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }
  
  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  // 1. Level Check (Must be Associate L5 or higher)
  if (!hasPermission(userRole, 5)) {
    redirect(`/${locale}/dashboard`);
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting the root hub without a slug, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  // If attempting to access another role's silo, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/associate/${userRole}`);
  }

  const [tasks, attendance, checklist] = await Promise.all([
    getTasks(user.id),
    getAttendanceLogs(user.id),
    getOnboardingChecklist(user.id)
  ]);

  const mentor = profile.manager_id ? await getMentorDetails(profile.manager_id) : null;
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssociateClient 
        profile={profile} 
        initialTasks={tasks}
        initialAttendance={attendance}
        initialChecklist={checklist}
        mentor={mentor}
      />
    </div>
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
