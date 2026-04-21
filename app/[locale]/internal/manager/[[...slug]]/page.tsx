import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { ManagerClient } from "../ManagerClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs } from "@/app/[locale]/internal/actions";
import { getAllProfiles } from "@/app/[locale]/admin/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManagerPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<ManagerPortalSkeleton />}>
      <ManagerPortalContent params={params} />
    </Suspense>
  );
}

async function ManagerPortalContent({
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
  // 1. Level Check (Must be Manager L3/L3.5 or higher)
  if (!hasPermission(userRole, 3.5)) {
    redirect(`/${locale}/dashboard`);
  }

  // 2. Path-Based Entity Silo Guard
  const requestedRole = slug?.[0];

  // If hitting the root hub without a slug, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  // If attempting to access another role's silo, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  const [tasks, attendance, team] = await Promise.all([
    getTasks(),
    getAttendanceLogs(),
    getAllProfiles()
  ]);
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ManagerClient 
        profile={profile} 
        initialTasks={tasks}
        initialAttendance={attendance}
        team={team}
      />
    </div>
  );
}

function ManagerPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-12 w-1/4" />
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
