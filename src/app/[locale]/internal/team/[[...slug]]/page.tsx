import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { 
  getAttendanceLogs, 
  getTasksForVerification, 
  getActiveAssignedMissions,
  getManagedTeam,
  getTeamReflections,
  getTeamLeaveRequests,
  getScheduledSyncs
} from "@/app/[locale]/internal/actions";
import { getTeamPerformanceStats } from "@/app/[locale]/admin/actions";

import { AttendanceLog } from "@/app/[locale]/admin/attendance/AttendanceLogClient";
import { TeamClient, ReviewTask, TeamPerformance, TeamMember } from "../TeamClient";
import { Reflection } from "../TeamReflectionClient";
import { LeaveRequest } from "../TeamLeaveClient";
import { hasPermission } from "@/lib/constants/roles";
import { Meeting } from "@/types/meeting";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<TeamPortalSkeleton />}>
      <AttendancePortalContentWrapper params={params} />
    </Suspense>
  );
}

async function AttendancePortalContentWrapper({ params }: { params: Promise<{ locale: string, slug?: string[] }> }) {
  return <TeamPortalContent params={params} />;
}

async function TeamPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  // Supervisory level or higher (L3.5+)
  if (!hasPermission(userRole, 3.5)) {
    return <RestrictedAccess requiredLevel="Management" />;
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];
  
  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/team/${userRole}`);
  }

  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
     return <RestrictedAccess requiredLevel={`Bespoke ${userRole.toUpperCase()} Team Workspace`} />;
  }

  let attendance: AttendanceLog[] = [];
  if (subView === 'attendance') {
    attendance = await getAttendanceLogs() as unknown as AttendanceLog[];
  }

  let pendingTasks: ReviewTask[] = [];
  let activeTasks: ReviewTask[] = [];
  if (subView === 'reviews') {
    pendingTasks = await getTasksForVerification(user.id) as unknown as ReviewTask[];
    activeTasks = await getActiveAssignedMissions(user.id) as unknown as ReviewTask[];
  }

  let performance: TeamPerformance[] = [];
  if (subView === 'performance') {
    performance = await getTeamPerformanceStats() as unknown as TeamPerformance[];
  }

  let reflections: Reflection[] = [];
  if (subView === 'reflections') {
    reflections = await getTeamReflections(user.id);
  }

  let leaveRequests: LeaveRequest[] = [];
  if (subView === 'leaves') {
    leaveRequests = await getTeamLeaveRequests(user.id);
  }

  let scheduledSyncs: Meeting[] = [];
  if (subView === 'performance' || subView === 'syncs') {
    scheduledSyncs = await getScheduledSyncs();
  }


  const teamMembers = await getManagedTeam(user.id, userRole);

  return (
    <TeamClient 
      initialTeam={teamMembers as unknown as TeamMember[]}
      initialAttendance={attendance}
      initialPendingTasks={pendingTasks}
      initialActiveTasks={activeTasks}
      initialPerformance={performance}
      initialReflections={reflections}
      initialLeaveRequests={leaveRequests}
      initialSyncs={scheduledSyncs}
      subView={subView}
      mentorId={user.id}
      userRole={userRole}
      isGoogleConnected={!!profile?.metadata?.google_tokens}
    />

  );
}

function TeamPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-12 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-125 w-full mt-8" />
    </div>
  );
}

