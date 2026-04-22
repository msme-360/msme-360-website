import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { getAttendanceLogs } from "@/app/[locale]/internal/actions";
import { AttendanceLogClient } from "../AttendanceLogClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendancePortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<AttendancePortalSkeleton />}>
      <AttendancePortalContent params={params} />
    </Suspense>
  );
}

async function AttendancePortalContent({
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
  // Personnel Admin level or higher (L2+)
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Personnel Administrator" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];
  
  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/admin/attendance/${userRole}`);
  }

  // Attendance is a shared tool for L2+, so we check if the user has at least L2
  // We don't necessarily silo by requestedRole here if it's a global log, 
  // but we follow the pattern for consistency.
  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
     // Allow Super Admin (L0) to view any role's attendance view, others only their own context
     return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Attendance Workspace`} />;
  }

  const attendance = await getAttendanceLogs();

  return (
    <AttendanceLogClient 
      initialAttendance={attendance} 
      subView={subView}
    />
  );
}

function AttendancePortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-[500px] w-full mt-8" />
    </div>
  );
}
