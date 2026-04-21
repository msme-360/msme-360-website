import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { StaffPortalClient } from "../StaffPortalClient";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnnouncements } from "../../actions";

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
  const announcements = await getAnnouncements();
  const userRole = profile?.role || "user";

  // --- Hub Silo Guard ---
  const requestedRole = slug?.[0];

  // If hitting the root hub without a slug, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

  // If attempting to access another role's silo, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/internal/staff/${userRole}`);
  }

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
