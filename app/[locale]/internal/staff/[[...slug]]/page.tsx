import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { StaffPortalClient } from "../StaffPortalClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnnouncements } from "../../actions";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { getRoleById } from "@/lib/constants/roles";

export default function StaffPortalPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<StaffPortalSkeleton />}>
      <StaffPortalContent params={params} />
    </Suspense>
  );
}

async function StaffPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";
  const roleData = getRoleById(userRole);

  // --- Hub Silo Guard ---
  // Ensure only Level 4 (Execution/Staff) can access this hub
  if (roleData.level !== 4) {
    const hub = roleData.level <= 3.5 ? 'manager' : roleData.level === 5 ? 'associate' : null;
    if (hub) redirect(`/${locale}/internal/${hub}/${userRole}`);
    else redirect(`/${locale}/dashboard`);
  }

  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // 1. Role Silo Check
  if (!requestedRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

  // 2. Sub-View Routing
  if (subView) {
    return (
      <AdminViewWrapper
        title={`${subView.charAt(0).toUpperCase() + subView.slice(1)} Module`}
        subtitle={`Internal resource access for ${profile.role.replace('_', ' ').toUpperCase()}.`}
        badgeLabel="WORKSPACE DEPTH"
        authorityLevel="Execution Access"
      >
        <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-2">{subView} integration is being finalized.</h3>
          <p className="text-muted-foreground text-sm">Productivity modules are being synchronized across the workspace.</p>
        </div>
      </AdminViewWrapper>
    );
  }

  const announcements = await getAnnouncements();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StaffPortalClient profile={profile} initialAnnouncements={announcements} />
    </div>
  );
}

function StaffPortalSkeleton() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-10 w-1/4" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
