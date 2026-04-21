import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { HiringPortal } from "../HiringPortal";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export default async function ExecutiveHiringPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';

  if (!hasPermission(userRole, 1)) {
    return <RestrictedAccess requiredLevel="Executive" />;
  }

  return (
    <AdminViewWrapper
      title="Talent Acquisition"
      subtitle="Strategic oversight of organization-wide recruitment and onboarding pipelines."
      badgeLabel="GROWTH HUB"
      authorityLevel="L1 Executive"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <HiringPortal />
      </div>
    </AdminViewWrapper>
  );
}
