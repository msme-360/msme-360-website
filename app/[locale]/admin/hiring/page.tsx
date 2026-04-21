import React from "react";
import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { HiringPortalClient } from "./HiringPortalClient";
import { getApplicants } from "@/app/[locale]/admin/actions";
import { getRoleById, hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";

export default async function HiringPortalPage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || 'user';
  const roleData = getRoleById(userRole);

  // Level 1 Executives or anyone in People department with Level 2 or better
  const isAuthorized = hasPermission(userRole, 1) || (roleData.department === 'People' && hasPermission(userRole, 2));

  if (!isAuthorized) {
    return <RestrictedAccess requiredLevel="HR Management" />;
  }

  const applicants = await getApplicants();
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <HiringPortalClient 
        initialApplicants={applicants} 
        userId={user.id}
        profile={profile}
      />
    </div>
  );
}
