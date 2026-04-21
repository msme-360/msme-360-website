import { getUser as getAuthUser } from "@/lib/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { redirect } from "next/navigation";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export default async function PersonnelIdentityPage({ params }: { params: { locale: string } }) {
  const user = await getAuthUser();
  if (!user) redirect(`/${params.locale}/auth/login`);
  
  const profile = await getProfileDirect(user.id);

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <AdminViewWrapper
      title="Personnel Identity"
      subtitle="Operational personnel profile and organizational verification status."
      badgeLabel="OFFICIAL RECORD"
      authorityLevel="Personnel Ledger"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <ProfileTabContent profile={profile} />
      </div>
    </AdminViewWrapper>
  );
}
