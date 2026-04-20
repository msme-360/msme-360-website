import React from "react";
import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { StaffPortalClient } from "./StaffPortalClient";
import { redirect } from "next/navigation";

export default async function StaffPortalPage({ params }: { params: { locale: string } }) {
  const user = await getUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfile(user.id);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StaffPortalClient profile={profile} />
    </div>
  );
}
