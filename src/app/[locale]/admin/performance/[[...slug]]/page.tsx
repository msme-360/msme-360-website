import { getUser as getAuthUser } from "@/services/supabase/supabase-server";
import { getProfile as getProfileDirect } from "@/app/[locale]/dashboard/queries";
import { hasPermission } from "@/lib/constants/roles";
import { RestrictedAccess } from "@/components/auth/RestrictedAccess";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createServiceClient } from "@/services/supabase/supabase-server";
import { PerformanceClient } from "../PerformanceClient";

export default function PerformancePage({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  return (
    <Suspense fallback={<PerformanceSkeleton />}>
      <PerformanceContent params={params} />
    </Suspense>
  );
}

async function PerformanceContent({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/${locale}/login`);

  const profile = await getProfileDirect(user.id);
  const userRole = profile?.role || "user";

  // L2+ can view performance analytics
  if (!hasPermission(userRole, 2)) {
    return <RestrictedAccess requiredLevel="Director" />;
  }

  const requestedRole = slug?.[0];
  if (!requestedRole) redirect(`/${locale}/admin/performance/${userRole}`);
  if (requestedRole !== userRole && !hasPermission(userRole, 0)) {
    redirect(`/${locale}/admin/performance/${userRole}`);
  }

  // Fetch real performance data
  const supabase = await createServiceClient();

  const [
    { data: profiles },
    { data: metrics },
    { data: attendance },
    { data: logs },
  ] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role, department, is_verified").order("full_name"),
    supabase.from("platform_metrics").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("attendance_logs").select("user_id, status, date").order("date", { ascending: false }).limit(200),
    supabase.from("system_logs").select("action, status, created_at").order("created_at", { ascending: false }).limit(30),
  ]);

  return (
    <PerformanceClient
      profiles={profiles || []}
      metrics={metrics || []}
      attendance={attendance || []}
      logs={logs || []}
      role={userRole}
    />
  );
}

function PerformanceSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

