import { getUser } from "@/services/supabase/supabase-server";
import { getProfile, getPlatformMetrics } from "./queries";
import { ExternalGroup } from "@/components/role-groups/ExternalGroup";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";
import { STARTUP_ROLES } from "@/lib/constants/roles";

export default async function DashboardPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const user = await getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const profile = await getProfile(user.id);
  const userRole = profile?.role || "user";
  const roleData = STARTUP_ROLES[userRole] || STARTUP_ROLES.user;

  // Redirect to role-specific homePath if it's not the dashboard itself
  if (roleData.homePath && roleData.homePath !== '/dashboard') {
    redirect(`/${locale}${roleData.homePath}`);
  }

  const metrics = await getPlatformMetrics('external');

  return (
    <div className="space-y-12">
      <ExternalGroup role={userRole} metrics={metrics} />
      <DashboardClient />
    </div>
  );
}

