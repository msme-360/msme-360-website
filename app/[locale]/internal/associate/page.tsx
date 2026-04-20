import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AssociateClient } from "./AssociateClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";

export default async function AssociatePortalPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfile(user.id);
  
  // Strict Isolation Check: Must be Level 5 (Associate/Intern) or higher
  if (!hasPermission(profile.role, 5)) {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssociateClient profile={profile} />
    </div>
  );
}
