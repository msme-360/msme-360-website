import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { WorkforceManager } from "../WorkforceManager";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export default async function ExecutiveWorkforcePage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';

  if (!hasPermission(userRole, 1)) {
    return <RestrictedAccess requiredLevel="Executive" />;
  }

  return (
    <AdminViewWrapper
      title="Workforce Management"
      subtitle="Comprehensive oversight of organization-wide human capital and departmental allocations."
      badgeLabel="OPERATIONAL AUDIT"
      authorityLevel="L1 Executive"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <WorkforceManager />
      </div>
    </AdminViewWrapper>
  );
}
