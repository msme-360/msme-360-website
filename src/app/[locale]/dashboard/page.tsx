import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "./queries";
import { ExternalGroup } from "@/components/role-groups/ExternalGroup";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";

  const metrics = await getPlatformMetrics('external');

  return (
    <div className="space-y-12">
      <ExternalGroup role={userRole} metrics={metrics} />
      <DashboardClient />
    </div>
  );
}
