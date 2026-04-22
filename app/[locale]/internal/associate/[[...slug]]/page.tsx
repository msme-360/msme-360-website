import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AssociateClient } from "../AssociateClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs, getOnboardingChecklist, getMentorDetails } from "@/app/[locale]/internal/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

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

  // 2. Sub-View Routing
  if (subView) {
    return (
      <AdminViewWrapper
        title={`${subView.charAt(0).toUpperCase() + subView.slice(1)} Registry`}
        subtitle={`Live career development data for ${profile.role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="ASSOCIATE DEPTH"
        authorityLevel="L5 Talent"
      >
        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-2">The {subView} module is being initialized.</h3>
          <p className="text-muted-foreground text-sm">MSME 360 Talent Framework is synchronizing this experience.</p>
        </div>
      </AdminViewWrapper>
    );
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
