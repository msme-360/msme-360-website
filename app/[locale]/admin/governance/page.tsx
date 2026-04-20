import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { GovernanceClient } from "./GovernanceClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";

export default async function GovernanceCenterPage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';

  // Level 0 is Governance (Board/Owner)
  if (!hasPermission(userRole, 0)) {
    return <RestrictedAccess requiredLevel="Governance" />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GovernanceClient />
    </div>
  );
}
