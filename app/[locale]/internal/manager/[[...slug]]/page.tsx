import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { ManagerClient } from "../ManagerClient";
import { SupervisoryClient } from "../SupervisoryClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs } from "@/app/[locale]/internal/actions";
import { getAllProfiles } from "@/app/[locale]/admin/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { getRoleById } from "@/lib/constants/roles";

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
  if (!hasPermission(userRole, 3.5)) {
    redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/manager/${userRole}`);
  }

  // 2. Sub-View Routing
  if (subView) {
    return (
      <AdminViewWrapper
        title={`${subView.charAt(0).toUpperCase() + subView.slice(1)} Intelligence`}
        subtitle={`Live departmental data for the ${profile.role.replace('_', ' ').toUpperCase()} hub.`}
        badgeLabel="MANAGEMENT DEPTH"
        authorityLevel="L3.5 Oversight"
      >
        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-2">Detailed {subView} metrics are under construction.</h3>
          <p className="text-muted-foreground text-sm">MSME 360 AI is synchronizing this module for your department.</p>
        </div>
      </AdminViewWrapper>
    );
  }

  const [tasks, attendance, team] = await Promise.all([
    getTasks(),
    getAttendanceLogs(),
    getAllProfiles()
  ]);

  const roleData = getRoleById(userRole);
  const isSupervisory = roleData.level === 3.5;
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isSupervisory ? (
        <SupervisoryClient 
          profile={profile} 
          initialTasks={tasks}
          initialAttendance={attendance}
          team={team}
        />
      ) : (
        <ManagerClient 
          profile={profile} 
          initialTasks={tasks}
          initialAttendance={attendance}
          team={team}
        />
      )}
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
