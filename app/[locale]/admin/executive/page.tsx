import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { ExecutivePortalClient } from "./ExecutiveClient";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";

export default async function ExecutivePortalPage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';

  // Level 1 is Executive (CEO, MP, etc.)
  if (!hasPermission(userRole, 1)) {
    return <RestrictedAccess requiredLevel="Executive" />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ExecutivePortalClient />
    </div>
  );
}
