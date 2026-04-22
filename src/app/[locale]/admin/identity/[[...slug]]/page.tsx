import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { redirect } from "next/navigation";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonnelIdentityPage({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  return (
    <Suspense fallback={<IdentityPortalSkeleton />}>
      <IdentityPortalContent params={params} />
    </Suspense>
  );
}

async function IdentityPortalContent({
  params
}: {
  params: Promise<{ locale: string, slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);

  const profile = await getProfileDirect(user.id);
  if (!profile) return <div>Profile not found.</div>;

  const userRole = profile?.role || "user";

  // --- Silo Guard ---
  const requestedRole = slug?.[0];
  const subView = slug?.[1];

  // If hitting root /identity, redirect to own silo
  if (!requestedRole) {
    redirect(`/${locale}/admin/identity/${userRole}`);
  }

  // If attempting to access another role's identity view, block
  if (requestedRole !== userRole) {
    redirect(`/${locale}/admin/identity/${userRole}`);
  }

  return (
    <AdminViewWrapper
      title="Personnel Identity"
      subtitle="Operational personnel profile and organizational verification status."
      badgeLabel="OFFICIAL RECORD"
      authorityLevel="Personnel Ledger"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProfileTabContent profile={profile} locale={locale} subView={subView} />
      </div>
    </AdminViewWrapper>
  );
}

function IdentityPortalSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
