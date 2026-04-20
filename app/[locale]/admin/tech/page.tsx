import React from "react";
import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { TechnicalPortalClient } from "./TechnicalClient";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";

export default async function TechnicalPortalPage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';
  const roleData = getRoleById(userRole);

  // Level 1 Executives or anyone in Technical department with Level 2 or better
  const isAuthorized = hasPermission(userRole, 1) || (roleData.department === 'Technical' && hasPermission(userRole, 2));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="Technical Leadership" />;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <TechnicalPortalClient />
    </div>
  );
}
